import { detectAll, type Detection } from "./detector";

// ─── Column-name PII heuristics ───────────────────────────────────────────

export type ColumnKind =
  | "email"
  | "phone"
  | "name"
  | "address"
  | "ssn"
  | "card"
  | "id"
  | "secret"
  | "ip"
  | "dob"
  | "location"
  | "other";

const COLUMN_RULES: { kind: ColumnKind; pattern: RegExp }[] = [
  { kind: "email", pattern: /^(?:e[-_]?mail|email[-_]?address|user[-_]?email|mail)$/i },
  { kind: "phone", pattern: /^(?:phone|phone[-_]?number|mobile|cell|tel|telephone|whatsapp)$/i },
  { kind: "name", pattern: /^(?:name|full[-_]?name|first[-_]?name|last[-_]?name|fname|lname|customer[-_]?name|user[-_]?name|username|person)$/i },
  { kind: "address", pattern: /^(?:address|street|street[-_]?address|address[-_]?line[-_]?\d?|home[-_]?address|shipping[-_]?address|billing[-_]?address|postal|zip|zipcode|postcode)$/i },
  { kind: "ssn", pattern: /^(?:ssn|social[-_]?security|aadhaar|pan|nin)$/i },
  { kind: "card", pattern: /^(?:card[-_]?number|credit[-_]?card|cc[-_]?num|cardnum|cvv|cvc|card[-_]?expiry|expiry)$/i },
  { kind: "id", pattern: /^(?:passport|driver[-_]?licen[cs]e|license|national[-_]?id|tax[-_]?id|vin)$/i },
  { kind: "secret", pattern: /^(?:password|passwd|pwd|secret|api[-_]?key|token|auth(?:orization)?|access[-_]?key|refresh[-_]?token|private[-_]?key|client[-_]?secret|session|cookie|jwt)$/i },
  { kind: "ip", pattern: /^(?:ip|ip[-_]?address|ipv4|ipv6|client[-_]?ip|remote[-_]?ip)$/i },
  { kind: "dob", pattern: /^(?:dob|date[-_]?of[-_]?birth|birth[-_]?date|birthday)$/i },
  { kind: "location", pattern: /^(?:latitude|lat|longitude|lng|long|coordinates|geo|location)$/i },
];

export function classifyColumn(name: string): ColumnKind {
  const n = name.trim().toLowerCase();
  for (const r of COLUMN_RULES) {
    if (r.pattern.test(n)) return r.kind;
  }
  return "other";
}

export const COLUMN_KIND_LABEL: Record<ColumnKind, string> = {
  email: "Email",
  phone: "Phone",
  name: "Name",
  address: "Address",
  ssn: "Govt ID (SSN/Aadhaar/PAN)",
  card: "Card",
  id: "ID document",
  secret: "Secret / Token",
  ip: "IP",
  dob: "Date of birth",
  location: "Geo coords",
  other: "Other",
};

export const COLUMN_KIND_DEFAULT_MASK: Record<ColumnKind, boolean> = {
  email: true,
  phone: true,
  name: true,
  address: true,
  ssn: true,
  card: true,
  id: true,
  secret: true,
  ip: true,
  dob: true,
  location: true,
  other: false,
};

export const MASK_TOKEN: Record<ColumnKind, string> = {
  email: "[EMAIL_MASKED]",
  phone: "[PHONE_MASKED]",
  name: "[NAME_MASKED]",
  address: "[ADDRESS_MASKED]",
  ssn: "[SSN_MASKED]",
  card: "[CARD_MASKED]",
  id: "[ID_MASKED]",
  secret: "[SECRET_MASKED]",
  ip: "[IP_MASKED]",
  dob: "[DOB_MASKED]",
  location: "[GEO_MASKED]",
  other: "[MASKED]",
};

// ─── CSV parsing (minimal RFC-4180-ish) ───────────────────────────────────

export function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const out: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n" || c === "\r") {
      // commit field + row
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") out.push(row);
      row = [];
      // swallow \r\n
      if (c === "\r" && text[i + 1] === "\n") i += 2;
      else i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") out.push(row);
  }
  if (!out.length) return { headers: [], rows: [] };
  return { headers: out[0], rows: out.slice(1) };
}

function escapeCSVField(s: string): string {
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rebuildCSV(headers: string[], rows: string[][]): string {
  const lines = [headers.map(escapeCSVField).join(",")];
  for (const r of rows) lines.push(r.map(escapeCSVField).join(","));
  return lines.join("\n");
}

// ─── Format detection ─────────────────────────────────────────────────────

export type DataFormat = "csv" | "json" | "unknown";

export function detectFormat(text: string): DataFormat {
  const t = text.trim();
  if (!t) return "unknown";
  if (t.startsWith("{") || t.startsWith("[")) {
    try {
      JSON.parse(t);
      return "json";
    } catch {
      // not valid JSON
    }
  }
  // CSV heuristic: first non-empty line has at least one comma AND
  // the first 3 lines roughly share the same field count.
  const lines = t.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length >= 1 && lines[0].includes(",")) {
    const counts = lines.slice(0, Math.min(4, lines.length)).map((l) => l.split(",").length);
    const allMatch = counts.every((c) => c === counts[0]);
    if (allMatch && counts[0] >= 2) return "csv";
  }
  return "unknown";
}

// ─── CSV cleaning ─────────────────────────────────────────────────────────

export type ColumnPlan = {
  index: number;
  name: string;
  kind: ColumnKind;
  mask: boolean;
  sample?: string;
};

export function planCSV(text: string): { headers: string[]; columns: ColumnPlan[]; rows: string[][] } {
  const { headers, rows } = parseCSV(text);
  const columns: ColumnPlan[] = headers.map((h, i) => {
    const kind = classifyColumn(h);
    return {
      index: i,
      name: h,
      kind,
      mask: COLUMN_KIND_DEFAULT_MASK[kind],
      sample: rows[0]?.[i],
    };
  });
  return { headers, columns, rows };
}

export function cleanCSV(
  headers: string[],
  rows: string[][],
  columns: ColumnPlan[]
): { output: string; maskedCells: number } {
  let maskedCells = 0;
  const cleanRows = rows.map((row) =>
    row.map((cell, i) => {
      const col = columns[i];
      if (col?.mask) {
        if (cell.trim()) maskedCells += 1;
        return MASK_TOKEN[col.kind];
      }
      // Even on un-masked columns, run the detector to catch in-line secrets / emails / etc.
      const detections = detectAll(cell);
      if (detections.length) {
        let v = cell;
        const sorted = [...detections].sort((a, b) => b.start - a.start);
        for (const d of sorted) {
          v = v.slice(0, d.start) + `[${d.redactedLabel}]` + v.slice(d.end);
          maskedCells += 1;
        }
        return v;
      }
      return cell;
    })
  );
  return { output: rebuildCSV(headers, cleanRows), maskedCells };
}

// ─── JSON cleaning ────────────────────────────────────────────────────────

const SENSITIVE_JSON_KEY = /^(password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|auth(?:orization)?|credential|client[_-]?secret|refresh[_-]?token|session[_-]?id|cookie|jwt|email|e[_-]?mail|phone|mobile|ssn|aadhaar|name|first[_-]?name|last[_-]?name|address|street|zip|postcode|dob|date[_-]?of[_-]?birth|birthday|ip|ip[_-]?address|card[_-]?number|cvv|cvc|passport|license|driver[_-]?licen[cs]e|tax[_-]?id|latitude|longitude|lat|lng)$/i;

export function cleanJSON(text: string): { output: string; maskedFields: number; detections: Detection[] } {
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    // fall back: run the detector on the whole text
    let masked = text;
    const dets = detectAll(text);
    const sorted = [...dets].sort((a, b) => b.start - a.start);
    for (const d of sorted) {
      masked = masked.slice(0, d.start) + `[${d.redactedLabel}]` + masked.slice(d.end);
    }
    return { output: masked, maskedFields: dets.length, detections: dets };
  }
  let count = 0;
  const allDetections: Detection[] = [];

  function walk(node: any, parentKey?: string): any {
    if (node === null || node === undefined) return node;
    if (Array.isArray(node)) return node.map((n) => walk(n, parentKey));
    if (typeof node === "object") {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(node)) {
        if (typeof v === "string" && SENSITIVE_JSON_KEY.test(k)) {
          count += 1;
          out[k] = `[${k.toUpperCase()}_MASKED]`;
        } else {
          out[k] = walk(v, k);
        }
      }
      return out;
    }
    if (typeof node === "string") {
      const dets = detectAll(node);
      if (!dets.length) return node;
      let v = node;
      const sorted = [...dets].sort((a, b) => b.start - a.start);
      for (const d of sorted) {
        v = v.slice(0, d.start) + `[${d.redactedLabel}]` + v.slice(d.end);
        count += 1;
        allDetections.push(d);
      }
      return v;
    }
    return node;
  }

  const masked = walk(parsed);
  return {
    output: JSON.stringify(masked, null, 2),
    maskedFields: count,
    detections: allDetections,
  };
}

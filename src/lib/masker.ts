import { detectAll, type Detection } from "./detector";

export type MaskMode = "plain" | "json" | "sql";

export type MaskResult = {
  output: string;
  detections: Detection[];
};

const SENSITIVE_JSON_KEYS = /(password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|auth(orization)?|credential|client[_-]?secret|refresh[_-]?token|session[_-]?id|cookie|jwt)/i;

export function mask(input: string, mode: MaskMode = "plain"): MaskResult {
  if (!input) return { output: "", detections: [] };
  if (mode === "json") return maskJson(input);
  if (mode === "sql") return maskSql(input);
  return maskPlain(input);
}

function placeholder(label: string): string {
  return `[${label}]`;
}

function maskPlain(text: string): MaskResult {
  const detections = detectAll(text);
  if (!detections.length) return { output: text, detections };
  // walk from end to start so indices stay valid
  let out = text;
  const sorted = [...detections].sort((a, b) => b.start - a.start);
  for (const d of sorted) {
    out = out.slice(0, d.start) + placeholder(d.redactedLabel) + out.slice(d.end);
  }
  return { output: out, detections };
}

function maskJson(text: string): MaskResult {
  try {
    const parsed = JSON.parse(text);
    const collected: Detection[] = [];
    const masked = walkJson(parsed, collected);
    return {
      output: JSON.stringify(masked, null, 2),
      detections: collected,
    };
  } catch {
    // Not valid JSON — fall back to plain masking
    return maskPlain(text);
  }
}

function walkJson(node: any, collected: Detection[], parentKey?: string): any {
  if (node === null || node === undefined) return node;
  if (Array.isArray(node)) {
    return node.map((n) => walkJson(n, collected, parentKey));
  }
  if (typeof node === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "string" && SENSITIVE_JSON_KEYS.test(k)) {
        collected.push({
          id: randomId(),
          ruleId: "json-sensitive-key",
          label: `Sensitive JSON key: ${k}`,
          category: "api-key",
          severity: "high",
          start: 0,
          end: 0,
          match: v,
          redactedLabel: `${k.toUpperCase()}_MASKED`,
        });
        out[k] = placeholder(`${k.toUpperCase()}_MASKED`);
      } else {
        out[k] = walkJson(v, collected, k);
      }
    }
    return out;
  }
  if (typeof node === "string") {
    const detections = detectAll(node);
    if (!detections.length) return node;
    let v = node;
    const sorted = [...detections].sort((a, b) => b.start - a.start);
    for (const d of sorted) {
      v = v.slice(0, d.start) + placeholder(d.redactedLabel) + v.slice(d.end);
      collected.push({ ...d, start: 0, end: 0 });
    }
    return v;
  }
  return node;
}

function maskSql(text: string): MaskResult {
  const collected: Detection[] = [];
  let out = text;

  // Quoted string literals: 'foo' or "foo"
  out = out.replace(/'([^'\\]|\\.)*'|"([^"\\]|\\.)*"/g, (m) => {
    const inner = m.slice(1, -1);
    if (!inner) return m;
    // Run detector on the inner content first
    const detected = detectAll(inner);
    if (detected.length) {
      let v = inner;
      const sorted = [...detected].sort((a, b) => b.start - a.start);
      for (const d of sorted) {
        v = v.slice(0, d.start) + placeholder(d.redactedLabel) + v.slice(d.end);
        collected.push({ ...d, start: 0, end: 0 });
      }
      return m[0] + v + m[0];
    }
    // Heuristic: if literal sits next to a sensitive column name, mask whole literal
    return m;
  });

  // INSERT INTO t (a, b, c) VALUES ('x', 'y', 'z') — match sensitive columns to values
  out = out.replace(
    /INSERT\s+INTO\s+[`"\w.]+\s*\(\s*([^)]+?)\s*\)\s*VALUES\s*\(\s*([^)]+?)\s*\)/gi,
    (full, cols: string, vals: string) => {
      const colList = cols.split(",").map((c) => stripIdent(c.trim()));
      const valList = splitSqlValues(vals);
      if (colList.length !== valList.length) return full;
      const newVals = valList.map((v, i) =>
        SENSITIVE_JSON_KEYS.test(colList[i])
          ? `'${placeholder(`${colList[i].toUpperCase()}_MASKED`)}'`
          : v
      );
      // record detections for sensitive columns
      colList.forEach((c) => {
        if (SENSITIVE_JSON_KEYS.test(c)) {
          collected.push({
            id: randomId(),
            ruleId: "sql-sensitive-column",
            label: `Sensitive SQL column: ${c}`,
            category: "api-key",
            severity: "high",
            start: 0,
            end: 0,
            match: c,
            redactedLabel: `${c.toUpperCase()}_MASKED`,
          });
        }
      });
      return full.replace(/VALUES\s*\(\s*[^)]+\)/i, `VALUES (${newVals.join(", ")})`);
    }
  );

  // WHERE col = 'literal' — mask sensitive columns
  out = out.replace(
    /\b([`"\w.]+)\s*=\s*('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/gi,
    (m, col: string, lit: string) => {
      const colName = stripIdent(col);
      if (SENSITIVE_JSON_KEYS.test(colName)) {
        collected.push({
          id: randomId(),
          ruleId: "sql-where-sensitive",
          label: `Sensitive WHERE on ${colName}`,
          category: "api-key",
          severity: "high",
          start: 0,
          end: 0,
          match: lit,
          redactedLabel: `${colName.toUpperCase()}_MASKED`,
        });
        const quote = lit[0];
        return `${col} = ${quote}${placeholder(`${colName.toUpperCase()}_MASKED`)}${quote}`;
      }
      return m;
    }
  );

  // Finally run general plain pass over the result for anything still leaking
  const plain = maskPlain(out);
  collected.push(...plain.detections.map((d) => ({ ...d, start: 0, end: 0 })));
  return { output: plain.output, detections: dedupe(collected) };
}

function dedupe(list: Detection[]): Detection[] {
  const seen = new Set<string>();
  const out: Detection[] = [];
  for (const d of list) {
    const k = `${d.ruleId}:${d.match}:${d.redactedLabel}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(d);
  }
  return out;
}

function stripIdent(s: string): string {
  return s.replace(/^[`"]|[`"]$/g, "").trim().toLowerCase();
}

function splitSqlValues(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let inStr: string | null = null;
  let buf = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      buf += ch;
      if (ch === "\\" && i + 1 < s.length) {
        buf += s[++i];
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      inStr = ch;
      buf += ch;
      continue;
    }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

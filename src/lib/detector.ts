export type Severity = "critical" | "high" | "medium" | "low";

export type Category =
  | "api-key"
  | "auth"
  | "crypto"
  | "pii"
  | "infra"
  | "env"
  | "high-entropy";

export type Detection = {
  id: string;
  ruleId: string;
  label: string;
  category: Category;
  severity: Severity;
  start: number;
  end: number;
  match: string;
  redactedLabel: string;
};

type Rule = {
  id: string;
  label: string;
  category: Category;
  severity: Severity;
  redactedLabel: string;
  pattern: RegExp;
  validate?: (m: string) => boolean;
};

const RULES: Rule[] = [
  // === API keys ===
  {
    id: "aws-access-key",
    label: "AWS Access Key",
    category: "api-key",
    severity: "critical",
    redactedLabel: "AWS_ACCESS_KEY_MASKED",
    pattern: /\b(AKIA|ASIA|AROA|AIDA)[0-9A-Z]{16}\b/g,
  },
  {
    id: "aws-secret-key",
    label: "AWS Secret Key",
    category: "api-key",
    severity: "critical",
    redactedLabel: "AWS_SECRET_KEY_MASKED",
    // contextual: appears after aws_secret_access_key or similar
    pattern:
      /(?<=aws[_-]?secret[_-]?access[_-]?key\s*[:=]\s*["']?)[A-Za-z0-9/+=]{40}(?=["']?)/gi,
  },
  {
    id: "openai-key",
    label: "OpenAI API Key",
    category: "api-key",
    severity: "critical",
    redactedLabel: "OPENAI_API_KEY_MASKED",
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: "anthropic-key",
    label: "Anthropic API Key",
    category: "api-key",
    severity: "critical",
    redactedLabel: "ANTHROPIC_API_KEY_MASKED",
    pattern: /\bsk-ant-[A-Za-z0-9_-]{80,}\b/g,
  },
  {
    id: "google-api-key",
    label: "Google API Key",
    category: "api-key",
    severity: "high",
    redactedLabel: "GOOGLE_API_KEY_MASKED",
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    id: "github-pat",
    label: "GitHub Personal Access Token",
    category: "api-key",
    severity: "critical",
    redactedLabel: "GITHUB_TOKEN_MASKED",
    pattern: /\bghp_[A-Za-z0-9]{36}\b/g,
  },
  {
    id: "github-oauth",
    label: "GitHub OAuth Token",
    category: "api-key",
    severity: "critical",
    redactedLabel: "GITHUB_OAUTH_MASKED",
    pattern: /\bgho_[A-Za-z0-9]{36}\b/g,
  },
  {
    id: "github-server",
    label: "GitHub App Server Token",
    category: "api-key",
    severity: "critical",
    redactedLabel: "GITHUB_SERVER_TOKEN_MASKED",
    pattern: /\bghs_[A-Za-z0-9]{36}\b/g,
  },
  {
    id: "github-fine-grained",
    label: "GitHub Fine-grained PAT",
    category: "api-key",
    severity: "critical",
    redactedLabel: "GITHUB_FG_TOKEN_MASKED",
    pattern: /\bgithub_pat_[A-Za-z0-9_]{22,255}\b/g,
  },
  {
    id: "stripe-live-secret",
    label: "Stripe Live Secret Key",
    category: "api-key",
    severity: "critical",
    redactedLabel: "STRIPE_SECRET_MASKED",
    pattern: /\bsk_live_[A-Za-z0-9]{24,}\b/g,
  },
  {
    id: "stripe-live-publishable",
    label: "Stripe Live Publishable Key",
    category: "api-key",
    severity: "medium",
    redactedLabel: "STRIPE_PUBLISHABLE_MASKED",
    pattern: /\bpk_live_[A-Za-z0-9]{24,}\b/g,
  },
  {
    id: "stripe-test",
    label: "Stripe Test Key",
    category: "api-key",
    severity: "medium",
    redactedLabel: "STRIPE_TEST_MASKED",
    pattern: /\b(sk|pk|rk)_test_[A-Za-z0-9]{24,}\b/g,
  },
  {
    id: "slack-token",
    label: "Slack Token",
    category: "api-key",
    severity: "high",
    redactedLabel: "SLACK_TOKEN_MASKED",
    pattern: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    id: "slack-webhook",
    label: "Slack Webhook URL",
    category: "api-key",
    severity: "high",
    redactedLabel: "SLACK_WEBHOOK_MASKED",
    pattern: /https:\/\/hooks\.slack\.com\/services\/[A-Z0-9/]+/g,
  },
  {
    id: "twilio-sid",
    label: "Twilio Account SID",
    category: "api-key",
    severity: "high",
    redactedLabel: "TWILIO_SID_MASKED",
    pattern: /\bAC[a-f0-9]{32}\b/g,
  },
  {
    id: "sendgrid-key",
    label: "SendGrid API Key",
    category: "api-key",
    severity: "high",
    redactedLabel: "SENDGRID_KEY_MASKED",
    pattern: /\bSG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}\b/g,
  },
  {
    id: "mailgun-key",
    label: "Mailgun API Key",
    category: "api-key",
    severity: "high",
    redactedLabel: "MAILGUN_KEY_MASKED",
    pattern: /\bkey-[a-f0-9]{32}\b/g,
  },
  {
    id: "azure-key",
    label: "Azure Storage Key (probable)",
    category: "api-key",
    severity: "high",
    redactedLabel: "AZURE_KEY_MASKED",
    pattern:
      /(?<=AccountKey=)[A-Za-z0-9+/=]{60,100}/g,
  },

  // === Auth tokens ===
  {
    id: "jwt",
    label: "JWT",
    category: "auth",
    severity: "high",
    redactedLabel: "JWT_MASKED",
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    id: "bearer-token",
    label: "Bearer Token",
    category: "auth",
    severity: "high",
    redactedLabel: "BEARER_TOKEN_MASKED",
    pattern: /Bearer\s+[A-Za-z0-9._\-+/=]{16,}/g,
  },
  {
    id: "basic-auth",
    label: "Basic Auth Header",
    category: "auth",
    severity: "high",
    redactedLabel: "BASIC_AUTH_MASKED",
    pattern: /Basic\s+[A-Za-z0-9+/=]{12,}/g,
  },
  {
    id: "auth-url-creds",
    label: "Credentials in URL",
    category: "auth",
    severity: "high",
    redactedLabel: "URL_CREDS_MASKED",
    pattern: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:[^\s@/]+@[^\s/]+/gi,
  },

  // === Crypto / private keys ===
  {
    id: "private-key-block",
    label: "Private Key Block",
    category: "crypto",
    severity: "critical",
    redactedLabel: "PRIVATE_KEY_BLOCK_MASKED",
    pattern:
      /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP |ENCRYPTED |)PRIVATE KEY-----[\s\S]*?-----END (?:RSA |DSA |EC |OPENSSH |PGP |ENCRYPTED |)PRIVATE KEY-----/g,
  },

  // === Database / infrastructure ===
  {
    id: "mongo-uri",
    label: "MongoDB Connection URI",
    category: "infra",
    severity: "high",
    redactedLabel: "MONGO_URI_MASKED",
    pattern: /\bmongodb(?:\+srv)?:\/\/[^\s"'`<>]+/g,
  },
  {
    id: "postgres-uri",
    label: "Postgres Connection URI",
    category: "infra",
    severity: "high",
    redactedLabel: "POSTGRES_URI_MASKED",
    pattern: /\bpostgres(?:ql)?:\/\/[^\s"'`<>]+/g,
  },
  {
    id: "mysql-uri",
    label: "MySQL Connection URI",
    category: "infra",
    severity: "high",
    redactedLabel: "MYSQL_URI_MASKED",
    pattern: /\bmysql:\/\/[^\s"'`<>]+/g,
  },
  {
    id: "redis-uri",
    label: "Redis Connection URI",
    category: "infra",
    severity: "high",
    redactedLabel: "REDIS_URI_MASKED",
    pattern: /\bredis(?:s)?:\/\/[^\s"'`<>]+/g,
  },
  {
    id: "s3-url",
    label: "S3 Bucket URL",
    category: "infra",
    severity: "low",
    redactedLabel: "S3_BUCKET_MASKED",
    pattern: /\b(?:s3:\/\/[a-z0-9.\-]{3,63}|[a-z0-9.\-]{3,63}\.s3[.-][a-z0-9.\-]*amazonaws\.com)\b/gi,
  },

  // === .env style ===
  {
    id: "env-line",
    label: ".env-style secret",
    category: "env",
    severity: "high",
    redactedLabel: "ENV_VALUE_MASKED",
    pattern:
      /(?<=^|\n)\s*(?:export\s+)?[A-Z][A-Z0-9_]{2,}(?:KEY|TOKEN|SECRET|PASSWORD|PASS|PWD|AUTH|CREDENTIAL)S?\s*=\s*["']?[^\s"'\n]{6,}["']?/g,
  },

  // === PII ===
  {
    id: "email",
    label: "Email",
    category: "pii",
    severity: "medium",
    redactedLabel: "EMAIL_MASKED",
    pattern:
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}\b/g,
  },
  {
    id: "phone-intl",
    label: "Phone Number",
    category: "pii",
    severity: "medium",
    redactedLabel: "PHONE_MASKED",
    // Match a leading optional country code, then 2 or 3 groups of 3–5 digits separated by space/dash/dot/parens.
    // Negative lookbehind/lookahead rejects matches adjacent to ':' or '-' (timestamps, IDs).
    pattern:
      /(?<![\w./:-])(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{2,5}\)|\d{2,5})(?:[\s.-]\d{2,5}){1,3}(?![\w.:-])/g,
    validate: (m) => {
      const digits = m.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) return false;
      // Reject ISO-date-like patterns (YYYY-MM-DD, YYYY/MM/DD)
      if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(m)) return false;
      // Reject if the entire match is just numeric without any country-code or grouping cue
      // (e.g. random 8+ digit ID). Require a + prefix OR at least one separator inside.
      if (!/^\+/.test(m) && !/[\s.\-()]/.test(m)) return false;
      return true;
    },
  },
  {
    id: "ssn-us",
    label: "US SSN",
    category: "pii",
    severity: "high",
    redactedLabel: "SSN_MASKED",
    pattern: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g,
  },
  {
    id: "aadhaar",
    label: "Aadhaar Number",
    category: "pii",
    severity: "high",
    redactedLabel: "AADHAAR_MASKED",
    pattern: /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/g,
    validate: (m) => verhoeffValidate(m.replace(/\s/g, "")),
  },
  {
    id: "credit-card",
    label: "Credit Card Number",
    category: "pii",
    severity: "high",
    redactedLabel: "CARD_NUMBER_MASKED",
    pattern: /\b(?:\d[ -]?){12,18}\d\b/g,
    validate: (m) => {
      const digits = m.replace(/\D/g, "");
      if (digits.length < 13 || digits.length > 19) return false;
      return luhn(digits);
    },
  },
  {
    id: "ipv4",
    label: "IPv4 Address",
    category: "pii",
    severity: "low",
    redactedLabel: "IPV4_MASKED",
    pattern:
      /\b(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\b/g,
    validate: (m) => {
      // Skip the obvious non-sensitive ones (0.0.0.0, broadcast, common docs)
      const skip = new Set([
        "0.0.0.0",
        "127.0.0.1",
        "255.255.255.255",
        "1.1.1.1",
        "8.8.8.8",
      ]);
      return !skip.has(m);
    },
  },
  {
    id: "ipv6",
    label: "IPv6 Address",
    category: "pii",
    severity: "low",
    redactedLabel: "IPV6_MASKED",
    pattern:
      /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
  },
];

// === High-entropy fallback (catches unknown secrets) ===
const HIGH_ENTROPY_LABEL = "Likely Secret (high entropy)";

function shannonEntropy(s: string): number {
  const freq: Record<string, number> = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  let h = 0;
  for (const k of Object.keys(freq)) {
    const p = freq[k] / s.length;
    h -= p * Math.log2(p);
  }
  return h;
}

const ENTROPY_CANDIDATE = /\b[A-Za-z0-9+/=_-]{32,}\b/g;
const ENTROPY_THRESHOLD = 4.3;

function detectHighEntropy(
  text: string,
  alreadyMatched: Detection[]
): Detection[] {
  const taken = new Array<boolean>(text.length).fill(false);
  for (const d of alreadyMatched) {
    for (let i = d.start; i < d.end; i++) taken[i] = true;
  }
  const found: Detection[] = [];
  for (const m of text.matchAll(ENTROPY_CANDIDATE)) {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    // skip if overlapping known detection
    let overlap = false;
    for (let i = start; i < end; i++) {
      if (taken[i]) {
        overlap = true;
        break;
      }
    }
    if (overlap) continue;
    if (shannonEntropy(m[0]) < ENTROPY_THRESHOLD) continue;
    // require mix of letter and digit to reduce false positives
    if (!/[A-Za-z]/.test(m[0]) || !/\d/.test(m[0])) continue;
    found.push({
      id: cryptoRandomId(),
      ruleId: "high-entropy",
      label: HIGH_ENTROPY_LABEL,
      category: "high-entropy",
      severity: "high",
      start,
      end,
      match: m[0],
      redactedLabel: "POSSIBLE_SECRET_MASKED",
    });
  }
  return found;
}

function luhn(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// Verhoeff (Aadhaar) checksum
const verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
function verhoeffValidate(num: string): boolean {
  if (!/^\d{12}$/.test(num)) return false;
  let c = 0;
  const reversed = num.split("").reverse();
  for (let i = 0; i < reversed.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][parseInt(reversed[i], 10)]];
  }
  return c === 0;
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function detectAll(text: string): Detection[] {
  if (!text) return [];
  const detections: Detection[] = [];
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    for (const m of text.matchAll(rule.pattern)) {
      const match = m[0];
      if (rule.validate && !rule.validate(match)) continue;
      const start = m.index ?? 0;
      detections.push({
        id: cryptoRandomId(),
        ruleId: rule.id,
        label: rule.label,
        category: rule.category,
        severity: rule.severity,
        start,
        end: start + match.length,
        match,
        redactedLabel: rule.redactedLabel,
      });
    }
  }
  // Add high-entropy detections that don't overlap known matches
  detections.push(...detectHighEntropy(text, detections));

  // Sort and dedupe overlaps — keep the higher severity / earlier match
  detections.sort((a, b) => a.start - b.start || b.end - a.end);
  const out: Detection[] = [];
  for (const d of detections) {
    const prev = out[out.length - 1];
    if (prev && d.start < prev.end) {
      // overlap — keep the more severe one
      if (severityRank(d.severity) > severityRank(prev.severity)) {
        out[out.length - 1] = d;
      }
      continue;
    }
    out.push(d);
  }
  return out;
}

export function severityRank(s: Severity): number {
  return s === "critical" ? 4 : s === "high" ? 3 : s === "medium" ? 2 : 1;
}

export function severityColorClass(s: Severity): string {
  if (s === "critical")
    return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  if (s === "high")
    return "bg-orange-500/15 text-orange-300 border-orange-500/30";
  if (s === "medium")
    return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  return "bg-sky-500/15 text-sky-300 border-sky-500/30";
}

export function categoryLabel(c: Category): string {
  switch (c) {
    case "api-key":
      return "API Key";
    case "auth":
      return "Auth";
    case "crypto":
      return "Crypto";
    case "pii":
      return "PII";
    case "infra":
      return "Infrastructure";
    case "env":
      return ".env";
    case "high-entropy":
      return "High Entropy";
  }
}

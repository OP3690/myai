// Slimmed inline copy of the FixAIPrompt detector — same rules, vanilla JS so the
// extension can run without a build step.

const RULES = [
  { id: "aws-access-key", label: "AWS Access Key", severity: "critical", pattern: /\b(AKIA|ASIA|AROA|AIDA)[0-9A-Z]{16}\b/g },
  { id: "openai-key", label: "OpenAI API Key", severity: "critical", pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g },
  { id: "anthropic-key", label: "Anthropic API Key", severity: "critical", pattern: /\bsk-ant-[A-Za-z0-9_-]{80,}\b/g },
  { id: "google-api-key", label: "Google API Key", severity: "high", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { id: "github-pat", label: "GitHub Token", severity: "critical", pattern: /\b(?:ghp|gho|ghs|ghu|ghr)_[A-Za-z0-9]{36}\b/g },
  { id: "github-fg", label: "GitHub Fine-grained PAT", severity: "critical", pattern: /\bgithub_pat_[A-Za-z0-9_]{22,255}\b/g },
  { id: "stripe-live", label: "Stripe Live Key", severity: "critical", pattern: /\b(?:sk|pk|rk)_live_[A-Za-z0-9]{24,}\b/g },
  { id: "slack-token", label: "Slack Token", severity: "high", pattern: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g },
  { id: "slack-webhook", label: "Slack Webhook", severity: "high", pattern: /https:\/\/hooks\.slack\.com\/services\/[A-Z0-9/]+/g },
  { id: "jwt", label: "JWT", severity: "high", pattern: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
  { id: "bearer-token", label: "Bearer Token", severity: "high", pattern: /Bearer\s+[A-Za-z0-9._\-+/=]{16,}/g },
  { id: "private-key", label: "Private Key Block", severity: "critical", pattern: /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP |ENCRYPTED |)PRIVATE KEY-----[\s\S]*?-----END (?:RSA |DSA |EC |OPENSSH |PGP |ENCRYPTED |)PRIVATE KEY-----/g },
  { id: "mongo-uri", label: "MongoDB URI", severity: "high", pattern: /\bmongodb(?:\+srv)?:\/\/[^\s"'`<>]+/g },
  { id: "postgres-uri", label: "Postgres URI", severity: "high", pattern: /\bpostgres(?:ql)?:\/\/[^\s"'`<>]+/g },
  { id: "mysql-uri", label: "MySQL URI", severity: "high", pattern: /\bmysql:\/\/[^\s"'`<>]+/g },
  { id: "redis-uri", label: "Redis URI", severity: "high", pattern: /\bredis(?:s)?:\/\/[^\s"'`<>]+/g },
  { id: "url-creds", label: "URL with credentials", severity: "high", pattern: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:[^\s@/]+@[^\s/]+/gi },
  { id: "env-line", label: ".env-style secret", severity: "high", pattern: /(?<=^|\n)\s*(?:export\s+)?[A-Z][A-Z0-9_]{2,}(?:KEY|TOKEN|SECRET|PASSWORD|PASS|PWD|AUTH|CREDENTIAL)S?\s*=\s*["']?[^\s"'\n]{6,}["']?/g },
  { id: "email", label: "Email", severity: "medium", pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}\b/g },
  { id: "ssn", label: "US SSN", severity: "high", pattern: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g },
];

export function scan(text) {
  if (!text) return { detections: [], score: 100 };
  const detections = [];
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    for (const m of text.matchAll(rule.pattern)) {
      detections.push({
        id: rule.id,
        label: rule.label,
        severity: rule.severity,
        match: m[0],
        start: m.index ?? 0,
      });
    }
  }
  const weight = { critical: 30, high: 15, medium: 7, low: 2 };
  let penalty = 0;
  for (const d of detections) penalty += weight[d.severity] || 2;
  const score = Math.max(0, 100 - penalty);
  return { detections, score };
}

export function band(score) {
  if (score >= 80) return "safe";
  if (score >= 50) return "warning";
  return "danger";
}

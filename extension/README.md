# FixAIPrompt — Safe Paste browser extension

Browser-side guardrail that scans pastes into ChatGPT, Claude, Gemini, Copilot, and Grok for API keys, JWTs, PII, and credentials. **All scanning is local** — the extension never sends your clipboard anywhere.

## Status

**MVP / unpacked.** Not yet on the Chrome Web Store. You can load it manually for development.

## Install (developer mode)

1. Open `chrome://extensions/` (or `edge://extensions/`).
2. Toggle on **"Developer mode"** (top-right).
3. Click **"Load unpacked"**.
4. Select this `extension/` folder.
5. Pin the FixAIPrompt extension to your toolbar.

## What it does

- **On paste**: any time you `Cmd/Ctrl + V` into ChatGPT, Claude, Gemini, Copilot, or Grok, the extension scans the pasted text. If it finds API keys, JWTs, private keys, DB URIs, or PII, a top-right toast warns you with the leak score and a one-click link to the full Safe Paste tool on the website.
- **Clean pastes are silent.** No noise on day-to-day work.
- **Popup**: click the toolbar icon to scan your current clipboard manually before pasting anywhere.

## Permissions

| Permission | Why |
|---|---|
| `clipboardRead` | The popup reads your clipboard when you click "Scan now". |
| `storage` | Local state (settings — none stored remotely). |
| `activeTab`, `scripting` | The content script runs on the chat sites listed under `host_permissions`. |
| `host_permissions` | Limited to `chat.openai.com`, `chatgpt.com`, `claude.ai`, `gemini.google.com`, `bing.com/chat`, `copilot.microsoft.com`, `grok.x.ai`. We do not run on any other site. |

## Detection rules

Same engine as the web app's Safe Paste, slimmed to vanilla JS so the extension runs without a build step. Covers AWS / OpenAI / Anthropic / Google / GitHub / Stripe / Slack keys, JWTs, bearer tokens, RSA/SSH private key blocks, Mongo/Postgres/MySQL/Redis URIs, .env-style secrets, emails, US SSNs, and URL-embedded credentials.

## Roadmap

- [ ] Icons (placeholder for now — add `icons/icon16.png` etc.)
- [ ] Settings page (toggle per-site, mute specific rules)
- [ ] One-click "mask & paste" (replace the paste in-place with the masked version)
- [ ] Firefox manifest
- [ ] Chrome Web Store submission

## License

MIT.

import { scan, band } from "./detector.js";

const scanBtn = document.getElementById("scan");
const result = document.getElementById("result");

function render(state) {
  result.classList.add("show");
  if (state.error) {
    result.innerHTML = `<div class="danger">${state.error}</div>`;
    return;
  }
  const b = state.band;
  const title =
    b === "danger" ? "🚨 Risky clipboard"
    : b === "warning" ? "⚠️ Sensitive items detected"
    : "✓ Clipboard looks safe";
  const items = state.detections
    .slice(0, 6)
    .map((d) => `<li>• ${d.label}</li>`)
    .join("");
  result.innerHTML = `
    <div><strong class="${b}">${title}</strong> — <span class="score">${state.score}/100</span></div>
    ${state.detections.length ? `<ul>${items}${state.detections.length > 6 ? `<li>… and ${state.detections.length - 6} more</li>` : ""}</ul>` : ""}
  `;
}

scanBtn.addEventListener("click", async () => {
  scanBtn.disabled = true;
  scanBtn.textContent = "Scanning…";
  try {
    const txt = await navigator.clipboard.readText();
    const r = scan(txt);
    render({ ...r, band: band(r.score) });
  } catch (e) {
    render({ error: "Couldn't read clipboard. Click in the page once, then try again." });
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = "Scan clipboard now";
  }
});

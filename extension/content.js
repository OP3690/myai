// Content script — watches paste events on AI chat pages and warns if the
// clipboard contents contain secrets / PII before letting the paste proceed.

(function () {
  // Don't run inside <iframe>s for known chat hosts; only the top-level page.
  if (window.top !== window.self) return;

  const TOAST_ID = "fixaiprompt-toast-root";

  function ensureToastRoot() {
    let el = document.getElementById(TOAST_ID);
    if (el) return el;
    el = document.createElement("div");
    el.id = TOAST_ID;
    el.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 2147483647;
      font-family: ui-sans-serif, system-ui, sans-serif;
      pointer-events: none;
    `;
    document.documentElement.appendChild(el);
    return el;
  }

  function showToast({ score, detections, band }) {
    const root = ensureToastRoot();
    const box = document.createElement("div");
    box.style.cssText = `
      pointer-events: auto;
      max-width: 380px;
      margin-bottom: 12px;
      padding: 14px 16px;
      border-radius: 14px;
      backdrop-filter: blur(10px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.45);
      border: 1px solid;
      color: #e7e7f0;
      font-size: 13px;
      line-height: 1.45;
    `;
    const tone =
      band === "danger"
        ? { bg: "rgba(244,63,94,0.18)", border: "rgba(244,63,94,0.55)", title: "🚨 Risky paste blocked" }
        : band === "warning"
        ? { bg: "rgba(251,191,36,0.18)", border: "rgba(251,191,36,0.5)", title: "⚠️ Sensitive items detected" }
        : { bg: "rgba(52,211,153,0.18)", border: "rgba(52,211,153,0.4)", title: "✓ Clipboard looks safe" };
    box.style.background = tone.bg;
    box.style.borderColor = tone.border;

    const itemsList = detections
      .slice(0, 5)
      .map((d) => `<li style="margin: 2px 0; font-family: ui-monospace, Menlo, monospace; font-size: 11px;">• ${d.label}</li>`)
      .join("");

    box.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
        <strong style="font-size:13px;">${tone.title}</strong>
        <span style="font-family:ui-monospace,Menlo,monospace; font-size:12px; opacity:0.85;">Score: ${score}/100</span>
      </div>
      ${detections.length ? `<ul style="margin: 8px 0 0 0; padding-left: 14px;">${itemsList}${detections.length > 5 ? `<li style="opacity:0.7; font-size:11px;">… and ${detections.length - 5} more</li>` : ""}</ul>` : ""}
      <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
        <button data-action="open-safe-paste" style="
          font-family: inherit; font-size: 12px; padding: 5px 10px;
          border-radius: 6px; border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08); color: #e7e7f0; cursor: pointer;
        ">Mask in Safe Paste →</button>
        <button data-action="dismiss" style="
          font-family: inherit; font-size: 12px; padding: 5px 10px;
          border-radius: 6px; border: 1px solid rgba(255,255,255,0.12);
          background: transparent; color: rgba(231,231,240,0.7); cursor: pointer;
        ">Dismiss</button>
      </div>
    `;

    box.querySelector('[data-action="dismiss"]').addEventListener("click", () => box.remove());
    box.querySelector('[data-action="open-safe-paste"]').addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "fixaiprompt:open-safe-paste" });
    });

    root.appendChild(box);
    if (band === "safe") {
      setTimeout(() => box.remove(), 4000);
    }
  }

  document.addEventListener(
    "paste",
    async (e) => {
      try {
        const txt = (e.clipboardData || window.clipboardData)?.getData("text") || "";
        if (!txt || txt.length < 8) return;
        // Skip very long pastes to avoid jank; we leave Safe Paste for those.
        const sample = txt.length > 50_000 ? txt.slice(0, 50_000) : txt;
        const res = await chrome.runtime.sendMessage({ type: "fixaiprompt:scan", text: sample });
        if (!res) return;
        if (res.detections.length === 0) return; // silent on clean pastes
        showToast(res);
      } catch {
        // swallow — never break the user's paste
      }
    },
    true
  );
})();

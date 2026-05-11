import { scan, band } from "./detector.js";

// Listen for messages from content scripts requesting a scan.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "fixaiprompt:scan") {
    const result = scan(msg.text || "");
    sendResponse({ ...result, band: band(result.score) });
    return true;
  }
  if (msg?.type === "fixaiprompt:open-safe-paste") {
    chrome.tabs.create({
      url: `https://fixaiprompt.com/safe-paste?from=extension`,
    });
    return false;
  }
});

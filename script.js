let loading = false;
let observer;

function start() {
  injectShareButton();
  observeDOMChanges();
}

function injectShareButton() {
  // Targeting the flex container directly
  const container = document.querySelector("div.absolute.bottom-0.right-0.top-0.flex.items-center");
  if (!container) return;

  const existingShareButton = container.querySelector(".gptbest-share-button");
  if (existingShareButton) return; // Prevent adding the button more than once

  const shareButton = createButton();
  shareButton.addEventListener("click", save);
  
  // Adjust styling if needed to match the existing button
  shareButton.style.marginLeft = "8px"; // Adding some space between buttons
  
  container.appendChild(shareButton);
}


async function save() {
  try {
    const html = document.querySelector(
      "div[class*='react-scroll-to-bottom']"
    ).innerHTML;
    const response = await chrome.runtime.sendMessage({ html });
    window.open(response.url, "_blank");
  } catch (error) {
    console.error(error);
    alert(
      "Error saving. Use direct HTML method from https://gpt.best to save."
    );
  } finally {
    loading = false;
  }
}

function createButton() {
  const shareButton = document.createElement("button");
  shareButton.style.color = "white";
  // Add or adjust styles to match the existing button
  shareButton.classList.add("gptbest-share-button");
  // Set button type to match existing UI conventions
  shareButton.setAttribute("type", "button");
  shareButton.style.padding = "0 8px"; // Example adjustment for padding
  // Other styling adjustments as needed...
  shareButton.appendChild(createShareIcon());
  return shareButton;
}


function createShareIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("height", "16");
  svg.setAttribute("width", "16");
  svg.setAttribute("fill", "currentColor");
  svg.innerHTML = `<path d="M26,28H6a2.0027,2.0027,0,0,1-2-2V6A2.0027,2.0027,0,0,1,6,4H16V6H6V26H26V16h2V26A2.0027,2.0027,0,0,1,26,28Z"/><polygon points="20 2 20 4 26.586 4 18 12.586 19.414 14 28 5.414 28 12 30 12 30 2 20 2"/>`;
  return svg;
}

function observeDOMChanges() {
  const targetNode = document.querySelector("#__next");
  if (!targetNode) return;

  const config = { subtree: false, childList: true };

  const callback = function (mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        injectShareButton();
      }
    });
  };

  observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

start();

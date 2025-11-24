// content.js

// ----- Extract post text near the clicked comment button -----
function extractPostTextFromButton(commentButton) {
  try {
    const article = commentButton.closest("article");
    if (!article) return "";

    // 1️⃣ PRIMARY — LinkedIn main post text (most common)
    // The actual text is in the nested span with dir="ltr" inside the break-words span
    let el = article.querySelector(
      "div.update-components-text span.break-words span[dir='ltr']"
    );
    if (el && el.innerText.trim().length > 10) {
      return el.innerText.trim();
    }

    // 2️⃣ SECONDARY — Try to get text from the innermost span in the break-words container
    el = article.querySelector("div.update-components-text span.break-words span span");
    if (el && el.innerText.trim().length > 10) {
      return el.innerText.trim();
    }

    // 3️⃣ TERTIARY — LinkedIn variations (A/B tests)
    el = article.querySelector("div.update-components-text span.break-words span");
    if (el && el.innerText.trim().length > 10) {
      return el.innerText.trim();
    }

    // 4️⃣ FALLBACK — any break-words span
    el = article.querySelector("span.break-words");
    if (el && el.innerText.trim().length > 10) {
      return el.innerText.trim();
    }

    // 4️⃣ FINAL RESCUE — get ONLY the readable text, ignore buttons, etc.
    const cleaned = article.innerText
      .replace(/(Like|Comment|Share|Send)/gi, "")
      .replace(/\d+( reactions| comments| shares)/gi, "")
      .replace(/\d+[smhdw] ago/gi, "")
      .trim();

    return cleaned.length > 20 ? cleaned : "";
  } catch (err) {
    console.error("extractPostTextFromButton() failed:", err);
    return "";
  }
}

// ----- Fill LinkedIn comment editor -----
function fillEditor(editorEl, text) {
  if (!editorEl) return;
  editorEl.focus();
  editorEl.innerHTML = "";
  editorEl.appendChild(document.createTextNode(text));

  const evt = new InputEvent("input", { bubbles: true });
  editorEl.dispatchEvent(evt);
}

// ----- Create toolbar (Short / Long / Emoji+) -----
function createToolbarForEditor(editorEl, postText) {
  if (!editorEl) return;

  // Remove any existing toolbar
  const existing = editorEl.parentElement.querySelector(
    ".li-ai-comment-toolbar"
  );
  if (existing) existing.remove();

  // Create the toolbar container
  const toolbar = document.createElement("div");
  toolbar.className = "li-ai-comment-toolbar";

  // Enhanced styling for better visibility and modern look
  toolbar.style.display = "flex";
  toolbar.style.flexWrap = "wrap";
  toolbar.style.gap = "8px";
  toolbar.style.marginTop = "8px";
  toolbar.style.fontSize = "12px";
  toolbar.style.padding = "6px 10px";
  toolbar.style.borderRadius = "8px";
  toolbar.style.border = "1px solid rgba(0,119,181,0.2)";
  toolbar.style.background = "rgba(255,255,255,0.98)";
  toolbar.style.alignItems = "center";
  toolbar.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
  toolbar.style.zIndex = "1000";
  toolbar.style.position = "relative";

  // Create a label with icon
  const label = document.createElement("span");
  label.textContent = "✨ AI comment:";
  label.style.opacity = "0.9";
  label.style.fontWeight = "500";
  label.style.width = "100%";
  label.style.marginBottom = "4px";

  // Create tone selector
  const toneContainer = document.createElement("div");
  toneContainer.style.display = "flex";
  toneContainer.style.alignItems = "center";
  toneContainer.style.gap = "6px";
  toneContainer.style.width = "100%";
  toneContainer.style.marginBottom = "6px";

  const toneLabel = document.createElement("span");
  toneLabel.textContent = "Tone:";
  toneLabel.style.fontSize = "11px";
  toneLabel.style.fontWeight = "500";

  const toneSelect = document.createElement("select");
  toneSelect.style.fontSize = "11px";
  toneSelect.style.padding = "2px 6px";
  toneSelect.style.borderRadius = "4px";
  toneSelect.style.border = "1px solid rgba(0,119,181,0.3)";

  const tones = [
    { value: "default", text: "Default" },
    { value: "professional", text: "Professional" },
    { value: "casual", text: "Casual" },
    { value: "supportive", text: "Supportive" },
    { value: "thoughtful", text: "Thoughtful" },
    { value: "enthusiastic", text: "Enthusiastic" },
  ];

  tones.forEach((tone) => {
    const option = document.createElement("option");
    option.value = tone.value;
    option.textContent = tone.text;
    if (tone.value === "default") {
      option.selected = true;
    }
    toneSelect.appendChild(option);
  });

  toneContainer.appendChild(toneLabel);
  toneContainer.appendChild(toneSelect);

  // Create buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.gap = "8px";
  buttonsContainer.style.width = "100%";

  // Create buttons with enhanced styling
  const shortBtn = document.createElement("button");
  const longBtn = document.createElement("button");
  const emojiBtn = document.createElement("button");
  const resetBtn = document.createElement("button");

  [shortBtn, longBtn, emojiBtn, resetBtn].forEach((btn) => {
    btn.type = "button";
    btn.style.cursor = "pointer";
    btn.style.borderRadius = "6px";
    btn.style.border = "1px solid rgba(0,119,181,0.3)";
    btn.style.padding = "4px 8px";
    btn.style.background = "white";
    btn.style.fontSize = "11px";
    btn.style.fontWeight = "500";
    btn.style.color = "#0077B5";
    btn.style.transition = "all 0.2s ease";

    // Add hover effect
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "#f0f8ff";
      btn.style.transform = "translateY(-1px)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.background = "white";
      btn.style.transform = "translateY(0)";
    });
  });

  // Set button text
  shortBtn.textContent = "Short";
  longBtn.textContent = "Long";
  emojiBtn.textContent = "Emoji+";
  resetBtn.textContent = "Reset";
  resetBtn.style.color = "#d32f2f";
  resetBtn.style.borderColor = "rgba(211, 47, 47, 0.3)";

  // Add elements to buttons container
  buttonsContainer.appendChild(shortBtn);
  buttonsContainer.appendChild(longBtn);
  buttonsContainer.appendChild(emojiBtn);
  buttonsContainer.appendChild(resetBtn);

  // Add all elements to toolbar
  toolbar.appendChild(label);
  toolbar.appendChild(toneContainer);
  toolbar.appendChild(buttonsContainer);

  // Add toolbar to the DOM
  if (editorEl.parentElement) {
    editorEl.parentElement.appendChild(toolbar);
  }

  function setLoading(isLoading) {
    const text = isLoading ? "Generating..." : "✨ AI comment:";
    label.textContent = text;
    [shortBtn, longBtn, emojiBtn, resetBtn].forEach((btn) => {
      btn.disabled = isLoading;
      btn.style.opacity = isLoading ? "0.6" : "1";
    });
    // Also disable tone selector during loading
    toneSelect.disabled = isLoading;
    toneSelect.style.opacity = isLoading ? "0.6" : "1";
  }

  async function handleClick(style) {
    try {
      setLoading(true);
      const tone = toneSelect.value;

      // Check if we have API key configured
      chrome.storage.local.get(["apiKey"], (data) => {
        if (!data.apiKey) {
          setLoading(false);
          // Create a more user-friendly notification
          const notification = document.createElement("div");
          notification.style.position = "fixed";
          notification.style.top = "20px";
          notification.style.right = "20px";
          notification.style.padding = "12px 20px";
          notification.style.background = "#fff3cd";
          notification.style.color = "#856404";
          notification.style.border = "1px solid #ffeeba";
          notification.style.borderRadius = "6px";
          notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
          notification.style.zIndex = "10000";
          notification.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px;">API Key Required</div>
            <div>Please set up your API key in the extension options.</div>
            <button id="openOptions" style="margin-top: 8px; padding: 4px 10px; background: #0077B5; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Options</button>
          `;

          document.body.appendChild(notification);

          // Add event listener to the button
          document
            .getElementById("openOptions")
            .addEventListener("click", () => {
              try {
                chrome.runtime.openOptionsPage();
              } catch (e) {
                // Fallback if openOptionsPage fails
                chrome.tabs.create({
                  url: chrome.runtime.getURL("options.html"),
                });
              }
              notification.remove();
            });

          // Auto-remove after 10 seconds
          setTimeout(() => {
            if (document.body.contains(notification)) {
              notification.remove();
            }
          }, 10000);

          return;
        }

        // If API key exists, proceed with comment generation
        chrome.runtime.sendMessage(
          {
            type: "generateComment",
            style,
            postText,
            tone, // Pass the selected tone to the background script
          },
          (response) => {
            setLoading(false);

            if (!response || !response.ok) {
              const msg = response?.error || "Failed to generate comment.";

              // Create a better error notification
              const errorNotification = document.createElement("div");
              errorNotification.style.position = "fixed";
              errorNotification.style.top = "20px";
              errorNotification.style.right = "20px";
              errorNotification.style.padding = "12px 20px";
              errorNotification.style.background = "#f8d7da";
              errorNotification.style.color = "#721c24";
              errorNotification.style.border = "1px solid #f5c6cb";
              errorNotification.style.borderRadius = "6px";
              errorNotification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
              errorNotification.style.zIndex = "10000";
              errorNotification.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 5px;">Error</div>
                <div>${msg}</div>
              `;

              document.body.appendChild(errorNotification);

              // Auto-remove after 5 seconds
              setTimeout(() => {
                if (document.body.contains(errorNotification)) {
                  errorNotification.remove();
                }
              }, 5000);

              return;
            }

            // Success - fill the editor with the generated comment
            fillEditor(editorEl, response.text);

            // Show a subtle success indicator
            const successNotification = document.createElement("div");
            successNotification.style.position = "fixed";
            successNotification.style.bottom = "20px";
            successNotification.style.right = "20px";
            successNotification.style.padding = "8px 16px";
            successNotification.style.background = "#d4edda";
            successNotification.style.color = "#155724";
            successNotification.style.border = "1px solid #c3e6cb";
            successNotification.style.borderRadius = "6px";
            successNotification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            successNotification.style.zIndex = "10000";
            successNotification.textContent = "✓ Comment generated";

            document.body.appendChild(successNotification);

            // Auto-remove after 2 seconds
            setTimeout(() => {
              if (document.body.contains(successNotification)) {
                successNotification.remove();
              }
            }, 2000);
          }
        );
      });
    } catch (err) {
      setLoading(false);
      console.error("Error generating comment:", err);

      // Create a better error notification
      const errorNotification = document.createElement("div");
      errorNotification.style.position = "fixed";
      errorNotification.style.top = "20px";
      errorNotification.style.right = "20px";
      errorNotification.style.padding = "12px 20px";
      errorNotification.style.background = "#f8d7da";
      errorNotification.style.color = "#721c24";
      errorNotification.style.border = "1px solid #f5c6cb";
      errorNotification.style.borderRadius = "6px";
      errorNotification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      errorNotification.style.zIndex = "10000";
      errorNotification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 5px;">Error</div>
        <div>${err.message}</div>
      `;

      document.body.appendChild(errorNotification);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (document.body.contains(errorNotification)) {
          errorNotification.remove();
        }
      }, 5000);
    }
  }

  // Reset button functionality
  resetBtn.addEventListener("click", () => {
    fillEditor(editorEl, "");
    // Show a subtle reset indicator
    const resetNotification = document.createElement("div");
    resetNotification.style.position = "fixed";
    resetNotification.style.bottom = "20px";
    resetNotification.style.right = "20px";
    resetNotification.style.padding = "8px 16px";
    resetNotification.style.background = "#e2e3e5";
    resetNotification.style.color = "#383d41";
    resetNotification.style.border = "1px solid #d6d8db";
    resetNotification.style.borderRadius = "6px";
    resetNotification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    resetNotification.style.zIndex = "10000";
    resetNotification.textContent = "✓ Comment cleared";

    document.body.appendChild(resetNotification);

    // Auto-remove after 2 seconds
    setTimeout(() => {
      if (document.body.contains(resetNotification)) {
        resetNotification.remove();
      }
    }, 2000);
  });

  shortBtn.addEventListener("click", () => handleClick("short"));
  longBtn.addEventListener("click", () => handleClick("long"));
  emojiBtn.addEventListener("click", () => handleClick("emoji"));
}

// ----- Attach listeners to comment buttons -----
function attachCommentButtonListeners(root = document) {
  // Expanded selectors to catch more comment button variations
  const buttons = root.querySelectorAll(
    'button[aria-label*="omment"], button[aria-label*="comment"], button[aria-label*="Comment"], button[aria-label*="Comment on"], button[data-control-name="comment"], button[data-control-name="comment_reshare"]'
  );

  buttons.forEach((btn) => {
    if (btn.dataset.liAiAttached === "true") return;
    btn.dataset.liAiAttached = "true";

    btn.addEventListener("click", () => {
      // Increased timeout to ensure the comment editor is fully loaded
      setTimeout(() => {
        try {
          const postText = extractPostTextFromButton(btn);
          console.log("Extracted Post Text:", postText);

          // Try multiple methods to find the comment editor
          let editorEl = document.activeElement;

          // Method 1: Check if the active element is a textbox
          if (!editorEl || editorEl.getAttribute("role") !== "textbox") {
            // Method 2: Look for textbox in the same article
            const article = btn.closest("article");
            if (article) {
              editorEl = article.querySelector('div[role="textbox"]');
            }

            // Method 3: Look for the most recent textbox in the document
            if (!editorEl) {
              const allTextboxes = document.querySelectorAll(
                'div[role="textbox"]'
              );
              if (allTextboxes.length > 0) {
                // Get the last textbox which is likely the most recently focused one
                editorEl = allTextboxes[allTextboxes.length - 1];
              }
            }

            // Method 4: Look for contenteditable divs
            if (!editorEl) {
              const contentEditables = document.querySelectorAll(
                'div[contenteditable="true"]'
              );
              if (contentEditables.length > 0) {
                editorEl = contentEditables[contentEditables.length - 1];
              }
            }
          }

          if (
            editorEl &&
            (editorEl.getAttribute("role") === "textbox" ||
              editorEl.getAttribute("contenteditable") === "true")
          ) {
            createToolbarForEditor(editorEl, postText);
          }
        } catch (error) {
          console.error("Error handling comment button click:", error);
        }
      }, 500); // Increased timeout for better reliability
    });
  });
}

// ----- Observe SPA updates -----
function startObserver() {
  attachCommentButtonListeners(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList" && m.addedNodes.length > 0) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            attachCommentButtonListeners(node);
          }
        });
      }
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
}

startObserver();

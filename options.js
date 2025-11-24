const providerEl = document.getElementById("provider");
const apiKeyEl = document.getElementById("apiKey");
const modelEl = document.getElementById("model");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");
const openaiModelsEl = document.getElementById("openai-models");
const geminiModelsEl = document.getElementById("gemini-models");

// Function to show the appropriate model options based on the selected provider
function updateModelOptions(provider) {
  if (provider === "gemini") {
    openaiModelsEl.style.display = "none";
    geminiModelsEl.style.display = "grid";
  } else {
    openaiModelsEl.style.display = "grid";
    geminiModelsEl.style.display = "none";
  }

  // Update selected model option
  const modelValue = modelEl.value.trim();
  const modelOptions = document.querySelectorAll(`#${provider}-models .model-option`);

  modelOptions.forEach(option => {
    if (option.dataset.model === modelValue) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });
}

// Function to handle model option clicks
function setupModelOptions() {
  const modelOptions = document.querySelectorAll(".model-option");

  modelOptions.forEach(option => {
    option.addEventListener("click", () => {
      const model = option.dataset.model;
      modelEl.value = model;

      // Update selected state
      const parent = option.parentElement;
      parent.querySelectorAll(".model-option").forEach(opt => {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
    });
  });
}

// Load saved settings
chrome.storage.local.get(["provider", "apiKey", "model"], (data) => {
  providerEl.value = data.provider || "openai";
  apiKeyEl.value = data.apiKey || "";
  modelEl.value =
    data.model ||
    (data.provider === "gemini" ? "gemini-1.5-flash" : "gpt-3.5-turbo");

  // Update UI based on loaded settings
  updateModelOptions(providerEl.value);
  setupModelOptions();
});

// Handle provider change
providerEl.addEventListener("change", () => {
  updateModelOptions(providerEl.value);

  // Set default model if none is selected
  if (!modelEl.value.trim()) {
    modelEl.value = providerEl.value === "gemini" ? "gemini-1.5-flash" : "gpt-3.5-turbo";
  }
});

// Save settings
saveBtn.addEventListener("click", () => {
  const provider = providerEl.value;
  const apiKey = apiKeyEl.value.trim();
  const model = modelEl.value.trim();

  // Validate inputs
  if (!apiKey) {
    statusEl.textContent = "API key is required";
    statusEl.className = "status-error";
    setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "";
    }, 3000);
    return;
  }

  if (!model) {
    statusEl.textContent = "Model is required";
    statusEl.className = "status-error";
    setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "";
    }, 3000);
    return;
  }

  chrome.storage.local.set({ provider, apiKey, model }, () => {
    statusEl.textContent = "Settings saved successfully!";
    statusEl.className = "status-success";
    setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "";
    }, 3000);
  });
});

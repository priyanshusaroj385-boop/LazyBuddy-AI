
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showResult(id, html) {
  const result = document.getElementById(id);
  result.innerHTML = html;
  result.classList.add("show");
}

function addCopyButton(id) {
  return `<button class="copy-btn" onclick="copyResult('${id}')">
    Copy Result
  </button>`;
}

// Simple extractive summary, not AI-generated.
function summarize() {
  const text = document.getElementById("summaryInput").value.trim();

  if (!text) {
    alert("Please enter some text first!");
    return;
  }

  const sentences = text.match(/[^.!?\n]+[.!?]?/g) || [text];
  const clean = sentences.map(s => s.trim()).filter(Boolean);

  const count = Math.max(1, Math.ceil(clean.length / 3));
  const summary = clean.slice(0, count).join(" ");

  showResult("summaryResult",
    "<strong>Your Summary</strong><p>" +
    escapeHTML(summary) + "</p>" +
    addCopyButton("summaryResult")
  );
}

// Create a checklist from comma-separated or line-separated tasks.
function generateTodos() {
  const text = document.getElementById("todoInput").value.trim();

  if (!text) {
    alert("Please enter your tasks first!");
    return;
  }

  const tasks = [...new Set(
    text.split(/[\n,;]+/).map(t => t.trim()).filter(Boolean)
  )];

  const items = tasks.map(task =>
    `<li><label><input type="checkbox"> ${
      escapeHTML(task)
    }</label></li>`
  ).join("");

  showResult("todoResult",
    "<strong>Your Checklist</strong><ul>" + items +
    "</ul>" + addCopyButton("todoResult")
  );
}

// Sort and remove duplicate notes.
function organizeText() {
  const text = document.getElementById("organizeInput").value.trim();

  if (!text) {
    alert("Please paste some notes first!");
    return;
  }

  const lines = [...new Set(
    text.split(/[\n,;]+/).map(line => line.trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const items = lines.map(line =>
    "<li>" + escapeHTML(line) + "</li>"
  ).join("");

  showResult("organizeResult",
    "<strong>Organized Notes</strong><ul>" + items +
    "</ul>" + addCopyButton("organizeResult")
  );
}

async function copyResult(id) {
  const result = document.getElementById(id);

  // Copy the readable result without the Copy Result button.
  const clone = result.cloneNode(true);
  clone.querySelectorAll("button").forEach(button => button.remove());

  try {
    await navigator.clipboard.writeText(clone.innerText.trim());
    alert("Result copied successfully!");
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = clone.innerText.trim();
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    alert("Result copied!");
  }
}

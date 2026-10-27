const lessons = [
  {
    title: "Give a page structure", label: "HTML FOUNDATIONS",
    intro: "HTML is the structure of a web page. Think of it like the frame of a house: it gives every piece a place and a purpose.",
    idea: "Tags come in pairs. An opening tag starts an element, a closing tag ends it, and the content lives in between. Semantic tags tell the browser what a piece of content means.",
    exampleHtml: '<main>\n  <h1>A little headline</h1>\n  <p>Some words go here.</p>\n</main>',
    startHtml: '<main>\n  <h1>My first page</h1>\n  <p>I made this with HTML.</p>\n</main>',
    startCss: "/* Your styles will go here */",
    task: "Add another <p> paragraph inside <main>. Give it any words you like.",
    hint: "Wrap your new sentence in <p> and </p>, just like the first one.",
    test: html => { const doc = new DOMParser().parseFromString(html, "text/html"); return doc.querySelector("main h1") && doc.querySelectorAll("main p").length >= 2; },
    success: "Lovely. Your page has a clear heading and two paragraphs. That's real structure!"
  },
  {
    title: "Make a link", label: "HTML FOUNDATIONS",
    intro: "Links connect your page to the rest of the web. The &lt;a&gt; element holds the words people click; its href attribute tells the browser where to go.",
    idea: "Attributes add details to an element. Put them in the opening tag, with a value in quotes: href=\"https://example.com\".",
    exampleHtml: '<a href="https://example.com">Visit Example</a>',
    startHtml: '<main>\n  <h1>Places to explore</h1>\n  <a href="#">Visit the garden</a>\n</main>',
    startCss: "a {\n  color: #557b39;\n}",
    task: "Change the link's href from # to https://example.com. The preview will show your link.",
    hint: "Find href=\"#\" and replace just the # with https://example.com.",
    test: html => { const doc = new DOMParser().parseFromString(html, "text/html"); const link = doc.querySelector("a"); return !!link && /^https:\/\//.test(link.getAttribute("href") || ""); },
    success: "That's a working link. You just gave your page a way out into the wider web."
  },
  {
    title: "Style with a selector", label: "CSS FOUNDATIONS",
    intro: "CSS is the visual layer. A selector points at the HTML you want to style, and declarations describe how it should look.",
    idea: "A class selector starts with a dot. If your HTML says class=\"card\", write .card in CSS. The braces hold each property and value.",
    exampleHtml: '<article class="card">\n  <h2>A cozy card</h2>\n  <p>Content with a little room to breathe.</p>\n</article>',
    startHtml: '<main>\n  <article class="card">\n    <h1>A cozy card</h1>\n    <p>Give this card a softer edge.</p>\n  </article>\n</main>',
    startCss: '.card {\n  padding: 1.25rem;\n  background: #f1f5e9;\n}',
    task: "Add border-radius: 12px; to the .card rule to soften its corners.",
    hint: "Add a new line inside .card's braces: border-radius: 12px;",
    test: (html, css) => { const doc = new DOMParser().parseFromString(html, "text/html"); return !!doc.querySelector(".card") && /\.card\s*\{[^}]*border-radius\s*:/is.test(css); },
    success: "Soft edges! Your class selector found its target and gave it a new look."
  },
  {
    title: "Choose a color", label: "CSS FOUNDATIONS",
    intro: "CSS properties are little instructions. The color property changes text, while background-color fills the space behind an element.",
    idea: "You can name a color, use a hex value like #557b39, or try rgb(). CSS is wonderfully forgiving: change a value and see what happens.",
    exampleHtml: '<h1>A bright idea</h1>\n<p>Color gives a page its mood.</p>',
    startHtml: '<main>\n  <h1>Grow something good</h1>\n  <p>A little color goes a long way.</p>\n</main>',
    startCss: 'h1 {\n  font-family: Georgia, serif;\n}',
    task: "Give the h1 a color. Try #557b39, or pick one of your own.",
    hint: "Add color: #557b39; between the h1 braces.",
    test: (html, css) => { const doc = new DOMParser().parseFromString(html, "text/html"); return !!doc.querySelector("h1") && /h1\s*\{[^}]*color\s*:\s*[^;\s}]+/is.test(css); },
    success: "A fresh new hue. You can swap that value any time to change the whole mood."
  },
  {
    title: "Line things up", label: "CSS LAYOUT",
    intro: "Flexbox helps arrange elements in a row or a column. Turn it on at the parent, then let the browser handle the spacing.",
    idea: "display: flex; makes the children line up. Add gap to control the space between them without extra margins.",
    exampleHtml: '<div class="row">\n  <span>One</span>\n  <span>Two</span>\n  <span>Three</span>\n</div>',
    startHtml: '<main>\n  <h1>A little collection</h1>\n  <div class="row">\n    <span>✿ Daisy</span>\n    <span>✿ Poppy</span>\n  </div>\n</main>',
    startCss: '.row {\n  gap: 10px;\n}\n\n.row span {\n  padding: 12px;\n  background: #f1f5e9;\n  border-radius: 8px;\n}',
    task: "Add display: flex; to .row and watch the flowers fall into a row.",
    hint: "Inside .row's braces, add display: flex;",
    test: (html, css) => { const doc = new DOMParser().parseFromString(html, "text/html"); return !!doc.querySelector(".row") && /\.row\s*\{[^}]*display\s*:\s*flex\b/is.test(css) && doc.querySelector(".row").children.length >= 2; },
    success: "Nicely aligned. Flexbox is doing the arranging for you. Keep building!"
  }
];

const exampleStyles = [
  "main {\n  max-width: 40rem;\n  margin: auto;\n}",
  "a {\n  color: #557b39;\n  text-decoration-thickness: 2px;\n}",
  ".card {\n  padding: 1.25rem;\n  border-radius: 12px;\n  background: #f1f5e9;\n}",
  "h1 {\n  color: #557b39;\n  font-family: Georgia, serif;\n}",
  ".row {\n  display: flex;\n  gap: 1rem;\n}"
];

const list = document.querySelector("#lesson-list");
const content = document.querySelector("#lesson-content");
const editor = document.querySelector("#code-editor");
const preview = document.querySelector("#live-preview");
const taskCopy = document.querySelector("#task-copy");
const fileName = document.querySelector("#file-name");
const feedback = document.querySelector("#feedback");
const completed = new Set(JSON.parse(localStorage.getItem("markup-club-done") || "[]"));
let current = 0;
let activeTab = "html";
let htmlCode = "";
let cssCode = "";
let debounceId;

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

function renderLesson() {
  const lesson = lessons[current];
  list.innerHTML = lessons.map((item, index) =>
    '<button class="lesson-link ' + (index === current ? "active " : "") + (completed.has(index) ? "done" : "") + '" type="button" data-lesson="' + index + '" aria-current="' + (index === current ? "step" : "false") + '"><span class="lesson-number"><span class="number-text">' + String(index + 1).padStart(2, "0") + '</span></span><span>' + item.title + '</span></button>'
  ).join("");
  document.querySelector("#progress-count").textContent = completed.size + " / " + lessons.length;
  document.querySelector("#progress-fill").style.width = (completed.size / lessons.length * 100) + "%";
  content.innerHTML = '<div class="lesson-meta"><span>' + lesson.label + '</span><i class="meta-dot"></i><span>LESSON ' + String(current + 1).padStart(2, "0") + ' / ' + String(lessons.length).padStart(2, "0") + '</span></div>' +
    '<h1>' + lesson.title + '</h1><p class="lesson-intro">' + lesson.intro + '</p>' +
    '<section class="idea-card"><span class="idea-label">THE IDEA</span><p>' + lesson.idea + '</p></section>' +
    '<section class="example-section"><div class="section-heading"><span class="example-label">A SMALL EXAMPLE</span><button class="copy-button" type="button" id="copy-example">COPY HTML ↗</button></div><div class="example-files"><div class="example-file"><span>index.html</span><pre class="code-example"><code>' + escapeHtml(lesson.exampleHtml) + '</code></pre></div><div class="example-file"><span>style.css</span><pre class="code-example"><code>' + escapeHtml(exampleStyles[current]) + '</code></pre></div></div></section>' +
    '<hr class="practice-divider"><section><div class="practice-heading"><h2>Your turn</h2><span>NO WRONG TURNS</span></div><p class="practice-lead">Try the little challenge in the playground. Changes show up as you type.</p></section>';
  htmlCode = lesson.startHtml;
  cssCode = lesson.startCss;
  activeTab = "html";
  taskCopy.textContent = lesson.task;
  feedback.textContent = "";
  feedback.classList.remove("error");
  updateEditor();
  updatePreview();
}

function updateEditor() {
  editor.value = activeTab === "html" ? htmlCode : cssCode;
  fileName.textContent = activeTab === "html" ? "index.html" : "style.css";
  document.querySelectorAll(".editor-tab").forEach(tab => {
    const selected = tab.dataset.tab === activeTab;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
}

function updatePreview() {
  preview.srcdoc = '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:24px;font:15px/1.55 system-ui,sans-serif;color:#253229}main{max-width:560px;margin:0 auto}h1{font-size:26px;line-height:1.2;margin:0 0 12px}h2{margin:0 0 8px}p{margin:0 0 12px}.row span{display:inline-block}a{color:#557b39}article.card{padding:1.25rem}' + cssCode + '</style></head><body>' + htmlCode + '</body></html>';
}

function saveProgress() {
  localStorage.setItem("markup-club-done", JSON.stringify([...completed]));
  document.querySelector("#progress-count").textContent = completed.size + " / " + lessons.length;
  document.querySelector("#progress-fill").style.width = (completed.size / lessons.length * 100) + "%";
}

list.addEventListener("click", event => {
  const button = event.target.closest("[data-lesson]");
  if (!button) return;
  current = Number(button.dataset.lesson);
  renderLesson();
});

document.querySelectorAll(".editor-tab").forEach(tab => tab.addEventListener("click", () => {
  activeTab = tab.dataset.tab;
  updateEditor();
}));

editor.addEventListener("input", () => {
  if (activeTab === "html") htmlCode = editor.value;
  else cssCode = editor.value;
  clearTimeout(debounceId);
  debounceId = setTimeout(updatePreview, 120);
});

document.querySelector("#reset-button").addEventListener("click", () => {
  htmlCode = lessons[current].startHtml;
  cssCode = lessons[current].startCss;
  feedback.textContent = "Back to the starting point. Give it another go!";
  feedback.classList.remove("error");
  updateEditor();
  updatePreview();
});

document.querySelector("#check-button").addEventListener("click", () => {
  const lesson = lessons[current];
  if (lesson.test(htmlCode, cssCode)) {
    completed.add(current);
    saveProgress();
    const button = list.querySelector('[data-lesson="' + current + '"]');
    button?.classList.add("done");
    feedback.textContent = lesson.success;
    feedback.classList.remove("error");
  } else {
    feedback.textContent = lesson.hint;
    feedback.classList.add("error");
  }
});

content.addEventListener("click", async event => {
  if (event.target.id !== "copy-example") return;
  try {
    await navigator.clipboard.writeText(lessons[current].exampleHtml);
    event.target.textContent = "COPIED ✓";
    setTimeout(() => { if (event.target) event.target.textContent = "COPY HTML ↗"; }, 1300);
  } catch {
    event.target.textContent = "SELECT TO COPY";
  }
});

renderLesson();

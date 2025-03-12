const log = console.log;

let fileName = "markdown-writer";
const input = document.querySelector("#md");
const output = document.querySelector("#html");
const pdf = document.querySelector("#export-pdf");
const themeBtn = document.querySelector("#theme-toggle");

const converter = new showdown.Converter();
converter.setOption("tables", true);
converter.setOption("tasklists", true);
converter.setOption("strikethrough", true);

const setFileName = (content) => {
  fileName = "markdown-writer";

  const firstLine = content.split("\n")[0];
  if (!firstLine) {
    log("No lines in content");
    return;
  }

  let allowed = firstLine.replace("#", "").trim().substr(0, 20).toLowerCase();
  if (!allowed) {
    log("No usable characters found for first line of content");
    return;
  }

  fileName = allowed.replace(/ /g, "-");
};

const processMarkdown = (content) => {
  const html = converter.makeHtml(content);
  output.innerHTML = html;
};

const doIt = (el) => {
  const md = el.value;
  processMarkdown(md);
  setFileName(md);
};

const setColorTheme = (theme) => {
  let enableDarkTheme = false; // default light
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    enableDarkTheme = true;
  }

  // now see if the function was explicitly asked to set a theme
  if (theme === "dark") {
    enableDarkTheme = true;
  } else if (theme === "light") {
    enableDarkTheme = false;
  }

  // remove old class application
  document.body.classList.remove("dark");

  // set new
  if (enableDarkTheme) {
    document.body.classList.add("dark");
    themeBtn.innerHTML = "&#9728;"; // sun
  } else {
    themeBtn.innerHTML = "&#9899;"; // moon
  }
};

input.addEventListener("keyup", (e) => {
  doIt(e.target);
});

pdf.addEventListener("click", () => {
  if (input.value.trim() === "") {
    alert("No markdown content to export");
    return;
  }

  html2pdf()
    .set({
      pagebreak: { mode: ["avoid-all", "css"] },
      margin: [5, 2],
    })
    .from(output)
    .toContainer()
    .save(fileName + ".pdf");
});

themeBtn.addEventListener("click", () => {
  const currentIsDark = document.body.classList.contains("dark");
  if (currentIsDark) {
    setColorTheme("light");
  } else {
    setColorTheme("dark");
  }
});

const start = () => {
  // enable theme switcher
  themeBtn.classList.remove("hidden");
  setColorTheme();

  // on startup see if theres already something
  // in the textarea.
  doIt(input);
};

start();

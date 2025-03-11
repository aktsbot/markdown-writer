const log = console.log;

let fileName = "markdown-writer";
const input = document.querySelector("#md");
const output = document.querySelector("#html");
const pdf = document.querySelector("#export-pdf");

const converter = new showdown.Converter();

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

input.addEventListener("keyup", (e) => {
  doIt(e.target);
});

pdf.addEventListener("click", () => {
  if (input.value.trim() === "") {
    alert("No markdown content to export");
    return;
  }

  html2pdf()
    .from(output)
    .save(fileName + ".pdf");
});

// on startup see if theres already something
// in the textarea.
doIt(input);

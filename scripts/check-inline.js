const fs = require("fs");
const vm = require("vm");
const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
if (!scripts.length) throw new Error("No inline scripts found in index.html");
scripts.forEach((match, index) => {
  const source = match[1].trim();
  if (source) new vm.Script(source, { filename: "index.inline." + (index + 1) + ".js" });
});
console.log("Validated " + scripts.length + " inline script blocks.");

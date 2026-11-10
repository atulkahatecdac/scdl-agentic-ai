// Builds the decks into the parent folder: node build-all.js [1 2 3 4 5]
const path = require("path");
const FILES = {
  1: "CAAI-Course-2-Module-1-AI-Assisted-Code-Generation-and-Prompt-Engineering.pptx",
  2: "CAAI-Course-2-Module-2-AI-Assisted-Debugging-Refactoring-Code-Optimization.pptx",
  3: "CAAI-Course-2-Module-3-Automated-Testing-with-Generative-AI.pptx",
  4: "CAAI-Course-2-Module-4-AI-Assisted-Documentation-and-Project-Management.pptx",
  5: "CAAI-Course-2-Module-5-AI-Assisted-Code-Review-and-Security-Enhancement.pptx",
};
const which = process.argv.slice(2).length ? process.argv.slice(2) : ["1", "2", "3", "4", "5"];
(async () => {
  for (const n of which) {
    await require(`./deck${n}.js`)(path.join(__dirname, "..", FILES[n]));
  }
})().catch((e) => { console.error(e); process.exit(1); });

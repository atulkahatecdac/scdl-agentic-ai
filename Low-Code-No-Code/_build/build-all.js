// Builds the decks into the parent folder: node build-all.js [1 2 3 4 5]
const path = require("path");
const which = process.argv.slice(2).length ? process.argv.slice(2) : ["1", "2", "3", "4", "5"];
(async () => {
  for (const n of which) {
    await require(`./deck${n}.js`)(path.join(__dirname, "..", `no-code-low-code-${n}.pptx`));
  }
})().catch((e) => { console.error(e); process.exit(1); });

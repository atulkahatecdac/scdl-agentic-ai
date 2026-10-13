// Shared slide templates for the No-Code Low-Code decks.
// Plain white background, navy text, one coral accent, icons in circles as the motif.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const AUTHOR = "Atul Kahate";
const COURSE = "Certificate in Generative AI and Automation";

const C = {
  navy: "1F2A44",
  coral: "EA4B71",
  teal: "1A7F8E",
  purple: "6B4FBB",
  gray: "5B6475",
  muted: "8A93A3",
  light: "F4F6FA",
  line: "D5DAE3",
  white: "FFFFFF",
  codeComment: "9FB0CC",
};
const HEAD = "Calibri";
const BODY = "Calibri";
const MONO = "Courier New";

// ---------- icons ----------
const iconCache = new Map();
function I(name) {
  const comp = fa[name];
  if (!comp) throw new Error("Unknown icon: " + name);
  return comp;
}
async function iconData(name, color, size = 256) {
  const key = name + color;
  if (!iconCache.has(key)) {
    const svg = ReactDOMServer.renderToStaticMarkup(
      React.createElement(I(name), { color: "#" + color, size: String(size) })
    );
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    iconCache.set(key, "image/png;base64," + buf.toString("base64"));
  }
  return iconCache.get(key);
}
async function iconCircle(s, name, x, y, d, fill, fg = C.white) {
  s.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  const pad = d * 0.26;
  s.addImage({ data: await iconData(name, fg), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
}

// n8n node types -> icon + colour family (trigger coral, logic navy, app teal, AI purple).
const NODE = {
  form: ["FaWpforms", C.coral], schedule: ["FaClock", C.coral], webhook: ["FaPlug", C.coral],
  gmailTrigger: ["FaInbox", C.coral], sheetsTrigger: ["FaBolt", C.coral], errorTrigger: ["FaExclamationTriangle", C.coral],
  manual: ["FaPlay", C.coral],
  edit: ["FaPen", C.navy], if: ["FaCodeBranch", C.navy], switch: ["FaRandom", C.navy], merge: ["FaCompressAlt", C.navy],
  aggregate: ["FaLayerGroup", C.navy], filter: ["FaFilter", C.navy], respond: ["FaReply", C.navy],
  formEnd: ["FaCheckCircle", C.navy], wait: ["FaHourglassHalf", C.navy],
  sheets: ["FaTable", C.teal], gmail: ["FaEnvelope", C.teal], mysql: ["FaDatabase", C.teal], http: ["FaGlobe", C.teal],
  docs: ["FaFileAlt", C.teal], file: ["FaFilePdf", C.teal],
  ai: ["FaBrain", C.purple], classifier: ["FaTags", C.purple], extractor: ["FaMagic", C.purple],
};

// ---------- text helpers ----------
// Inline markup: `code` -> mono coral, **bold** -> bold.
function runs(str, base = {}) {
  const out = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ text: str.slice(last, m.index), options: { ...base } });
    const tok = m[0];
    if (tok.startsWith("`")) out.push({ text: tok.slice(1, -1), options: { ...base, fontFace: MONO, color: C.coral, bold: true } });
    else out.push({ text: tok.slice(2, -2), options: { ...base, bold: true } });
    last = m.index + tok.length;
  }
  if (last < str.length) out.push({ text: str.slice(last), options: { ...base } });
  return out;
}
// Several paragraphs -> one text array with line breaks between them.
function paras(list, base = {}, bullet = false) {
  const out = [];
  list.forEach((p, i) => {
    const r = typeof p === "string" ? runs(p, base) : p;
    if (bullet && r.length) r[0].options.bullet = { indent: 14 };
    if (i < list.length - 1) r[r.length - 1].options.breakLine = true;
    out.push(...r);
  });
  return out;
}
function tb(s, text, o) {
  s.addText(text, { fontFace: BODY, color: C.navy, margin: 0, valign: "top", isTextBox: true, ...o });
}

// ---------- deck ----------
class Deck {
  constructor(n, title) {
    this.n = n;
    this.title = title;
    this.pres = new pptxgen();
    this.pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
    this.pres.title = `Module ${n}: ${title}`;
    this.pres.author = AUTHOR;
    this.page = 0;
  }
  slide(notes) {
    const s = this.pres.addSlide();
    s.background = { color: C.white };
    this.page++;
    if (this.page > 1) {
      tb(s, `No-Code Low-Code · Module ${this.n}  |  ${this.page}`, {
        x: 0.5, y: 5.25, w: 9, h: 0.25, fontSize: 9, color: C.muted, align: "right",
      });
    }
    if (notes) s.addNotes(notes);
    return s;
  }
  heading(s, title, sub) {
    tb(s, title, { x: 0.5, y: 0.3, w: 9, h: 0.6, fontFace: HEAD, fontSize: 28, bold: true, valign: "middle" });
    if (sub) tb(s, sub, { x: 0.5, y: 0.88, w: 9, h: 0.35, fontSize: 14, color: C.gray });
  }
  async save(file) {
    await this.pres.writeFile({ fileName: file });
    console.log("wrote", file, `(${this.page} slides)`);
  }

  // ---- 1. Title ----
  async titleSlide({ title, subtitle, flow, notes }) {
    const s = this.slide(notes);
    tb(s, `MODULE ${this.n}`, { x: 0.6, y: 0.8, w: 5, h: 0.35, fontSize: 14, bold: true, color: C.coral, charSpacing: 4 });
    tb(s, title, { x: 0.6, y: 1.2, w: 5.5, h: 1.5, fontFace: HEAD, fontSize: 32, bold: true });
    tb(s, subtitle, { x: 0.6, y: 2.75, w: 5.0, h: 0.8, fontSize: 15, color: C.gray });
    tb(s, "AUTHOR", { x: 0.6, y: 3.75, w: 3, h: 0.25, fontSize: 10, bold: true, color: C.coral, charSpacing: 3 });
    tb(s, AUTHOR, { x: 0.6, y: 4.0, w: 4, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true });
    tb(s, `${COURSE}  ·  No-Code Low-Code`, { x: 0.6, y: 4.8, w: 6, h: 0.3, fontSize: 11, color: C.muted });
    const x0 = 6.35, gap = 4.2 / flow.length, d = 0.62;
    const y0 = 0.6 + (gap - d) / 2;
    for (let i = 0; i < flow.length; i++) {
      const [icon, name, desc, col] = flow[i];
      const y = y0 + i * gap;
      await iconCircle(s, icon, x0, y, d, col);
      tb(s, [
        { text: name, options: { bold: true, fontSize: 14, breakLine: true } },
        { text: desc, options: { color: C.gray, fontSize: 11 } },
      ], { x: x0 + 0.8, y: y - 0.02, w: 2.6, h: 0.66, valign: "middle" });
      if (i < flow.length - 1) {
        s.addShape("line", { x: x0 + d / 2, y: y + d + 0.04, w: 0, h: gap - d - 0.08, line: { color: C.line, width: 1.5, endArrowType: "triangle" } });
      }
    }
  }

  // ---- 2. Goals & agenda (no timings) ----
  async goalsAgenda({ sub, goals, agenda, notes }) {
    const s = this.slide(notes);
    this.heading(s, "Today's Goals & Agenda", sub);
    for (let i = 0; i < goals.length; i++) {
      const y = 1.5 + i * 0.85;
      await iconCircle(s, goals[i][0], 0.5, y, 0.5, C.navy);
      tb(s, runs(goals[i][1]), { x: 1.15, y, w: 3.4, h: 0.5, fontSize: 14, valign: "middle" });
    }
    s.addShape("roundRect", { x: 5.0, y: 1.4, w: 4.5, h: 3.65, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    tb(s, "AGENDA", { x: 5.25, y: 1.55, w: 2, h: 0.25, fontSize: 10, bold: true, color: C.gray, charSpacing: 3 });
    agenda.forEach((item, i) => {
      const y = 1.9 + i * 0.44;
      const wf = /^WF\d/.test(item);
      if (wf) {
        const [tag, ...rest] = item.split("  ");
        s.addShape("roundRect", { x: 5.25, y: y + 0.04, w: 0.55, h: 0.27, fill: { color: C.coral }, line: { color: C.coral }, rectRadius: 0.05 });
        tb(s, tag, { x: 5.25, y: y + 0.04, w: 0.55, h: 0.27, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle" });
        tb(s, rest.join("  "), { x: 5.95, y, w: 3.4, h: 0.35, fontSize: 13, bold: true, valign: "middle" });
      } else {
        s.addShape("ellipse", { x: 5.46, y: y + 0.12, w: 0.11, h: 0.11, fill: { color: C.muted }, line: { color: C.muted } });
        tb(s, item, { x: 5.95, y, w: 3.4, h: 0.35, fontSize: 13, valign: "middle" });
      }
    });
  }

  // ---- 3 cards side by side, optional lines below ----
  async cards3({ title, sub, cards, below, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const w = 2.8, gap = 0.3, y = 1.45, h = below ? 2.45 : 3.4;
    for (let i = 0; i < cards.length; i++) {
      const { icon, color, head, body } = cards[i];
      const x = 0.5 + i * (w + gap);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
      await iconCircle(s, icon, x + 0.25, y + 0.25, 0.55, color);
      tb(s, head, { x: x + 0.95, y: y + 0.25, w: w - 1.1, h: 0.55, fontFace: HEAD, fontSize: 16, bold: true, valign: "middle" });
      tb(s, paras(body), { x: x + 0.25, y: y + 0.95, w: w - 0.45, h: h - 1.1, fontSize: 12, paraSpaceAfter: 6 });
    }
    if (below) tb(s, paras(below), { x: 0.5, y: 4.05, w: 9, h: 1.05, fontSize: 12, paraSpaceAfter: 5 });
    return s;
  }

  // ---- 4 or 5 blocks in a flow, each with a two-part card ----
  async flowBlocks({ title, sub, blocks, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const n = blocks.length, gap = 0.2, w = (9 - gap * (n - 1)) / n, y = 1.5;
    for (let i = 0; i < n; i++) {
      const b = blocks[i];
      const x = 0.5 + i * (w + gap);
      const col = b.color || (i % 2 === 0 ? C.navy : C.coral);
      await iconCircle(s, b.icon, x + (w - 0.7) / 2, y, 0.7, col);
      tb(s, b.name, { x, y: y + 0.8, w, h: 0.35, fontFace: HEAD, fontSize: 16, bold: true, align: "center" });
      tb(s, b.what, { x, y: y + 1.13, w, h: 0.3, fontSize: 11, color: C.gray, align: "center" });
      if (i < n - 1) {
        s.addShape("line", { x: x + w / 2 + 0.42, y: y + 0.35, w: w + gap - 0.84, h: 0, line: { color: C.line, width: 1.5, endArrowType: "triangle" } });
      }
      s.addShape("roundRect", { x, y: y + 1.6, w, h: 1.45, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.08 });
      tb(s, [
        { text: b.k1, options: { fontSize: 9, bold: true, color: C.teal, charSpacing: 2, breakLine: true } },
        { text: b.v1, options: { fontSize: 12, bold: true, breakLine: true } },
        { text: b.k2, options: { fontSize: 9, bold: true, color: C.coral, charSpacing: 2, breakLine: true } },
        { text: b.v2, options: { fontSize: 11 } },
      ], { x: x + 0.12, y: y + 1.7, w: w - 0.24, h: 1.3, paraSpaceAfter: 3 });
    }
    return s;
  }

  // ---- icon rows, optional code panel on the right ----
  async iconRows({ title, sub, rows, panel, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const w = panel ? 4.9 : 9;
    const step = Math.min(0.78, 3.6 / rows.length);
    for (let i = 0; i < rows.length; i++) {
      const { icon, color, head, text } = rows[i];
      const y = 1.45 + i * step;
      await iconCircle(s, icon, 0.5, y + 0.02, 0.48, color || C.navy);
      tb(s, [
        ...runs(head, { bold: true, fontSize: 14, breakLine: true }),
        ...runs(text, { fontSize: 12, color: C.gray }),
      ], { x: 1.15, y, w: w - 0.65, h: step - 0.05 });
    }
    if (panel) this.codePanel(s, panel, 5.75, 1.45, 3.75);
    return s;
  }

  // Dark code panel. Lines starting with # are comments.
  codePanel(s, { caption, lines, fontSize = 10.5 }, x, y, w) {
    let top = y;
    if (caption) {
      tb(s, caption, { x, y, w, h: 0.3, fontSize: 12, bold: true, color: C.gray });
      top += 0.35;
    }
    const lh = fontSize / 72 * 1.22;
    const h = lines.length * lh + 0.3;
    s.addShape("roundRect", { x, y: top, w, h, fill: { color: C.navy }, line: { color: C.navy }, rectRadius: 0.06 });
    tb(s, lines.map((l, i) => ({
      text: l === "" ? " " : l,
      options: { color: l.trim().startsWith("#") || l.trim().startsWith("--") ? C.codeComment : C.white, breakLine: i < lines.length - 1 },
    })), { x: x + 0.15, y: top + 0.15, w: w - 0.3, h: h - 0.3, fontFace: MONO, fontSize });
    return top + h;
  }

  // ---- 2 x 2 grid ----
  async grid4({ title, sub, cells, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const w = 4.4, h = 1.7;
    for (let i = 0; i < cells.length; i++) {
      const { icon, color, head, text } = cells[i];
      const x = 0.5 + (i % 2) * (w + 0.2), y = 1.45 + Math.floor(i / 2) * (h + 0.2);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.08 });
      await iconCircle(s, icon, x + 0.22, y + 0.22, 0.5, color || C.navy);
      tb(s, runs(head), { x: x + 0.9, y: y + 0.22, w: w - 1.1, h: 0.5, fontFace: HEAD, fontSize: 15, bold: true, valign: "middle" });
      tb(s, paras(Array.isArray(text) ? text : [text], { fontSize: 12 }), { x: x + 0.22, y: y + 0.82, w: w - 0.44, h: h - 0.9, paraSpaceAfter: 3 });
    }
    return s;
  }

  // ---- table ----
  table(s, head, rows, { x = 0.5, y = 1.45, w = 9, colW, fontSize = 11, firstBold = true } = {}) {
    const hdr = head.map((t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.navy } } }));
    const body = rows.map((r, ri) => r.map((cell, ci) => ({
      text: runs(cell, { bold: firstBold && ci === 0 }),
      options: { fill: { color: ri % 2 ? C.light : C.white } },
    })));
    s.addTable([hdr, ...body], {
      x, y, w, colW, fontFace: BODY, fontSize, color: C.navy, valign: "middle",
      border: { type: "solid", pt: 0.75, color: C.line }, margin: [4, 6, 4, 6],
    });
  }
  async tableSlide({ title, sub, head, rows, colW, below, belowY = 4.55, fontSize, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    this.table(s, head, rows, { colW, fontSize });
    if (below) tb(s, paras(below), { x: 0.5, y: belowY, w: 9, h: 0.55, fontSize: 12, paraSpaceAfter: 4 });
    return s;
  }

  // ---- numbered steps + code panel ----
  async stepsCode({ title, sub, steps, panel, notes }) {
    const s = this.slide(notes);
    this.heading(s, title, sub);
    const step = Math.min(0.72, 3.6 / steps.length);
    for (let i = 0; i < steps.length; i++) {
      const y = 1.45 + i * step;
      s.addShape("ellipse", { x: 0.5, y: y + 0.02, w: 0.38, h: 0.38, fill: { color: C.coral }, line: { color: C.coral } });
      tb(s, String(i + 1), { x: 0.5, y: y + 0.02, w: 0.38, h: 0.38, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, runs(steps[i]), { x: 1.05, y, w: 3.7, h: step - 0.04, fontSize: 12.5, valign: "middle" });
    }
    this.codePanel(s, panel, 5.05, 1.45, 4.45);
    return s;
  }

  // ---- workflow: overview ----
  async wfOverview({ wf, name, goal, nodes, learn, notes }) {
    const s = this.slide(notes);
    this.wfHeading(s, wf, name, "Overview");
    s.addShape("roundRect", { x: 0.5, y: 1.35, w: 9, h: 1.7, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    const n = nodes.length, gap = 0.34;
    const bw = Math.min(1.25, (8.6 - gap * (n - 1)) / n);
    const total = n * bw + (n - 1) * gap;
    const x0 = 0.5 + (9 - total) / 2;
    for (let i = 0; i < n; i++) {
      const [type, label, detail] = nodes[i];
      const [icon, col] = NODE[type] || (() => { throw new Error("node type " + type); })();
      const x = x0 + i * (bw + gap);
      s.addShape("roundRect", { x, y: 1.5, w: bw, h: 0.6, fill: { color: C.white }, line: { color: C.line, width: 1 }, rectRadius: 0.08 });
      s.addImage({ data: await iconData(icon, col), x: x + bw / 2 - 0.17, y: 1.63, w: 0.34, h: 0.34 });
      tb(s, [
        { text: label, options: { bold: true, fontSize: 10.5, breakLine: !!detail } },
        ...(detail ? [{ text: detail, options: { fontSize: 9, color: C.gray } }] : []),
      ], { x: x - gap / 2 + 0.02, y: 2.17, w: bw + gap - 0.04, h: 0.8, align: "center" });
      if (i < n - 1) {
        s.addShape("line", { x: x + bw + 0.03, y: 1.8, w: gap - 0.06, h: 0, line: { color: C.gray, width: 1.25, endArrowType: "triangle" } });
      }
    }
    tb(s, "GOAL", { x: 0.5, y: 3.25, w: 4, h: 0.25, fontSize: 10, bold: true, color: C.coral, charSpacing: 3 });
    tb(s, runs(goal), { x: 0.5, y: 3.52, w: 4.2, h: 1.55, fontSize: 13 });
    tb(s, "YOU WILL LEARN", { x: 5.2, y: 3.25, w: 4, h: 0.25, fontSize: 10, bold: true, color: C.teal, charSpacing: 3 });
    tb(s, paras(learn, { fontSize: 12.5 }, true), { x: 5.2, y: 3.52, w: 4.3, h: 1.55, paraSpaceAfter: 4 });
  }
  wfHeading(s, wf, name, part) {
    s.addShape("roundRect", { x: 0.5, y: 0.42, w: 0.62, h: 0.34, fill: { color: C.coral }, line: { color: C.coral }, rectRadius: 0.05 });
    tb(s, wf, { x: 0.5, y: 0.42, w: 0.62, h: 0.34, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle" });
    tb(s, [
      { text: name, options: { bold: true, color: C.navy } },
      { text: `  ·  ${part}`, options: { color: C.muted } },
    ], { x: 1.25, y: 0.3, w: 8.25, h: 0.6, fontFace: HEAD, fontSize: 24, valign: "middle" });
  }

  // ---- workflow: build table ----
  async wfBuild({ wf, name, part = "Build it", rows, tip, fontSize = 12, colW = [2.1, 6.9], notes }) {
    const s = this.slide(notes);
    this.wfHeading(s, wf, name, part);
    this.table(s, ["Node", "Key settings"], rows, { y: 1.1, colW, fontSize });
    if (tip) {
      s.addShape("roundRect", { x: 0.5, y: 4.55, w: 9, h: 0.55, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.06 });
      tb(s, [{ text: "Tip  ", options: { bold: true, color: C.teal } }, ...runs(tip)], { x: 0.7, y: 4.55, w: 8.6, h: 0.55, fontSize: 12, valign: "middle" });
    }
    return s;
  }

  // ---- workflow: run & verify ----
  async wfTest({ wf, name, steps, panel, check, notes }) {
    const s = this.slide(notes);
    this.wfHeading(s, wf, name, "Run & verify");
    const step = Math.min(0.66, 3.0 / steps.length);
    for (let i = 0; i < steps.length; i++) {
      const y = 1.25 + i * step;
      s.addShape("ellipse", { x: 0.5, y: y + 0.03, w: 0.34, h: 0.34, fill: { color: C.navy }, line: { color: C.navy } });
      tb(s, String(i + 1), { x: 0.5, y: y + 0.03, w: 0.34, h: 0.34, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, runs(steps[i]), { x: 1.0, y, w: 3.75, h: step - 0.04, fontSize: 12, valign: "middle" });
    }
    this.codePanel(s, panel, 5.05, 1.2, 4.45);
    if (check) {
      s.addShape("roundRect", { x: 0.5, y: 4.5, w: 9, h: 0.6, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.06 });
      s.addImage({ data: await iconData("FaCheckCircle", C.teal), x: 0.68, y: 4.64, w: 0.32, h: 0.32 });
      tb(s, runs(check), { x: 1.15, y: 4.5, w: 8.2, h: 0.6, fontSize: 12, valign: "middle" });
    }
    return s;
  }

  // ---- troubleshooting grid (problem -> fix) ----
  async troubleshoot({ items, notes }) {
    const s = this.slide(notes);
    this.heading(s, "Troubleshooting", "The errors students hit most often, and how to fix them");
    const w = 4.4, h = 1.1;
    for (let i = 0; i < items.length; i++) {
      const [problem, fix] = items[i];
      const x = 0.5 + (i % 2) * (w + 0.2), y = 1.4 + Math.floor(i / 2) * (h + 0.14);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.06 });
      s.addImage({ data: await iconData("FaExclamationTriangle", C.coral), x: x + 0.18, y: y + 0.16, w: 0.26, h: 0.26 });
      tb(s, runs(problem, { bold: true }), { x: x + 0.55, y: y + 0.1, w: w - 0.7, h: 0.38, fontSize: 12, valign: "middle" });
      tb(s, runs(fix), { x: x + 0.55, y: y + 0.48, w: w - 0.7, h: 0.58, fontSize: 11, color: C.gray });
    }
  }

  // ---- challenge ----
  async challenge({ items, notes }) {
    const s = this.slide(notes);
    this.heading(s, "Challenge", "Finished early? Extend what you built");
    const w = 2.8, gap = 0.3, y = 1.45, h = 3.6;
    const cols = [C.teal, C.navy, C.coral];
    for (let i = 0; i < items.length; i++) {
      const { level, head, text, hint } = items[i];
      const x = 0.5 + i * (w + gap);
      s.addShape("roundRect", { x, y, w, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
      s.addShape("roundRect", { x: x + 0.25, y: y + 0.25, w: 0.95, h: 0.3, fill: { color: cols[i] }, line: { color: cols[i] }, rectRadius: 0.05 });
      tb(s, level, { x: x + 0.25, y: y + 0.25, w: 0.95, h: 0.3, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, head, { x: x + 0.25, y: y + 0.7, w: w - 0.5, h: 0.65, fontFace: HEAD, fontSize: 15, bold: true });
      tb(s, runs(text), { x: x + 0.25, y: y + 1.4, w: w - 0.5, h: 1.3, fontSize: 12 });
      tb(s, [{ text: "Hint: ", options: { bold: true, color: C.teal } }, ...runs(hint, { color: C.gray })],
        { x: x + 0.25, y: y + 2.7, w: w - 0.5, h: 0.8, fontSize: 11 });
    }
  }

  // ---- summary ----
  async summary({ built, takeaways, next, nextLabel = "NEXT", notes }) {
    const s = this.slide(notes);
    this.heading(s, `Module ${this.n} Summary`, "What you built today");
    for (let i = 0; i < built.length; i++) {
      const [wf, name, desc] = built[i];
      const y = 1.45 + i * 0.95;
      s.addShape("roundRect", { x: 0.5, y, w: 0.62, h: 0.34, fill: { color: C.coral }, line: { color: C.coral }, rectRadius: 0.05 });
      tb(s, wf, { x: 0.5, y, w: 0.62, h: 0.34, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, [
        { text: name, options: { bold: true, fontSize: 14, breakLine: true } },
        ...runs(desc, { fontSize: 12, color: C.gray }),
      ], { x: 1.3, y: y - 0.05, w: 3.6, h: 0.85 });
    }
    s.addShape("roundRect", { x: 5.2, y: 1.4, w: 4.3, h: next ? 2.35 : 3.6, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    tb(s, "KEY TAKEAWAYS", { x: 5.45, y: 1.55, w: 3, h: 0.25, fontSize: 10, bold: true, color: C.teal, charSpacing: 3 });
    tb(s, paras(takeaways, { fontSize: 12.5 }, true), { x: 5.45, y: 1.9, w: 3.85, h: next ? 1.8 : 3.0, paraSpaceAfter: 5 });
    if (next) {
      s.addShape("roundRect", { x: 5.2, y: 3.95, w: 4.3, h: 1.1, fill: { color: C.navy }, line: { color: C.navy }, rectRadius: 0.1 });
      tb(s, [
        { text: nextLabel, options: { fontSize: 10, bold: true, color: C.coral, charSpacing: 3, breakLine: true } },
        ...runs(next, { fontSize: 13, color: C.white, bold: true }),
      ], { x: 5.45, y: 4.07, w: 3.85, h: 0.9 });
    }
    return s;
  }
}

module.exports = { Deck, C, HEAD, BODY, MONO, runs, paras, tb, iconCircle, iconData, NODE };

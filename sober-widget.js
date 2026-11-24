// ============================================================
//  SOBER — home screen widget
//  Scriptable (iOS). Medium size.
//
//  SET THIS ONE LINE: the date of your LAST DRINK, as YYYY-MM-DD.
//  Day one is the day AFTER this date.
// ============================================================

const LAST_DRINK = "2026-11-23";

// ------------------------------------------------------------
const BG     = new Color("#0b0f14");
const CARD   = new Color("#121922");
const INK    = new Color("#e8eef5");
const DIM    = new Color("#7f8fa1");
const ACC    = new Color("#4fd1a5");
const DARK   = new Color("#07130f");

// --- the milestone ladder (same one the app uses) -----------
const MILESTONES = (function () {
  const out = [];
  [[1,"Day one"],[3,"3 days"],[7,"One week"],[14,"Two weeks"],[30,"One month"],
   [60,"Two months"],[90,"Three months"]].forEach(m => out.push(m));

  for (let half = 1; half <= 20; half++) {
    const months = half * 6;
    const days = Math.round(months * 30.4375);
    const yrs = Math.floor(months / 12), mos = months % 12;
    let name = yrs ? yrs + (yrs === 1 ? " year" : " years") : "";
    if (mos) name += name ? " 6 months" : "Six months";
    out.push([days, name]);
  }
  for (let k = 500; k <= 3650; k += 500) out.push([k, k.toLocaleString() + " days"]);

  out.sort((a, b) => a[0] - b[0]);
  return out.filter((m, i) => i === 0 || m[0] !== out[i - 1][0]);
})();

// --- the maths ----------------------------------------------
function daysSober() {
  const p = LAST_DRINK.split("-");
  const start = new Date(+p[0], +p[1] - 1, +p[2]);
  const n = new Date();
  const today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  return Math.max(0, Math.round((today - start) / 86400000));
}

function milestoneFor(days) {
  const hit = MILESTONES.find(m => m[0] === days);
  return hit ? hit[1] : null;
}

// --- the widget ---------------------------------------------
function build(days, milestone) {
  const w = new ListWidget();
  w.setPadding(18, 20, 18, 20);

  if (milestone) {
    const g = new LinearGradient();
    g.colors = [new Color("#4fd1a5"), new Color("#2fae87")];
    g.locations = [0, 1];
    w.backgroundGradient = g;
  } else {
    w.backgroundColor = BG;
  }

  const ink = milestone ? DARK : INK;
  const sub = milestone ? DARK : DIM;

  if (milestone) {
    const sparkle = w.addText("✦   ✦   ✦");
    sparkle.font = Font.systemFont(13);
    sparkle.textColor = DARK;
    sparkle.centerAlignText();
    w.addSpacer(2);
  }

  w.addSpacer();

  const n = w.addText(String(days));
  n.font = Font.boldSystemFont(milestone ? 56 : 64);
  n.textColor = ink;
  n.centerAlignText();
  n.minimumScaleFactor = 0.5;

  const label = w.addText("days sober");
  label.font = Font.mediumSystemFont(14);
  label.textColor = sub;
  label.centerAlignText();

  if (milestone) {
    w.addSpacer(6);
    const m = w.addText(milestone.toUpperCase());
    m.font = Font.boldSystemFont(12);
    m.textColor = DARK;
    m.centerAlignText();
  }

  w.addSpacer();
  w.refreshAfterDate = nextMidnight();
  return w;
}

function nextMidnight() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 1);
}

// --- run ------------------------------------------------------
const days = daysSober();
const milestone = milestoneFor(days);
const widget = build(days, milestone);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();

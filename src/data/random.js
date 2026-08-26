// Deterministic pseudo-random generator (mulberry32) shared by every mock
// data module, stable across renders/reviewers, no Math.random.
export function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A smooth-ish upward (or downward) trending series: `days` points, starting
// near `start`, ending at `end`, with small day-to-day noise so it doesn't
// look like a straight ramp.
export function buildTrendSeries({ days, start, end, seed, noise = 0.04 }) {
  const random = mulberry32(seed);
  const points = [];
  for (let i = 0; i < days; i++) {
    const t = days === 1 ? 1 : i / (days - 1);
    const base = start + (end - start) * t;
    const wobble = base * noise * (random() * 2 - 1);
    points.push(Math.max(0, Math.round(base + wobble)));
  }
  points[points.length - 1] = end;
  return points;
}

const TODAY = new Date(2026, 7, 21); // fixed reference date, keeps demo data stable

export function dayLabel(offsetFromStart, totalDays) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - (totalDays - 1 - offsetFromStart));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function monthLabel(offsetFromStart, totalMonths) {
  const d = new Date(TODAY);
  d.setMonth(d.getMonth() - (totalMonths - 1 - offsetFromStart));
  return d.toLocaleDateString("en-US", { month: "short" });
}

export function daysAgo(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d;
}

export function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

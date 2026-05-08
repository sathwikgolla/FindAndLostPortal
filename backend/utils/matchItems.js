function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length > 2);
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter += 1;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function normalizeLocation(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function scorePair(lostItem, foundItem) {
  let score = 0;
  if (!lostItem || !foundItem) return 0;

  if (String(lostItem.category).toLowerCase() === String(foundItem.category).toLowerCase()) score += 40;

  const locA = normalizeLocation(lostItem.location);
  const locB = normalizeLocation(foundItem.location);
  if (locA && locB) {
    if (locA === locB) score += 25;
    else if (locA.includes(locB) || locB.includes(locA)) score += 15;
  }

  const titleScore = jaccard(tokenize(lostItem.title), tokenize(foundItem.title));
  score += Math.round(titleScore * 20);

  const descScore = jaccard(tokenize(lostItem.description), tokenize(foundItem.description));
  score += Math.round(descScore * 15);

  return Math.max(0, Math.min(100, score));
}

function findMatchesForItem(item, candidates) {
  const isLost = item.type === "lost";
  const wantType = isLost ? "found" : "lost";
  const scored = candidates
    .filter((c) => c.type === wantType)
    .map((c) => {
      const score = isLost ? scorePair(item, c) : scorePair(c, item);
      return { itemId: c._id || c.id, score };
    })
    .filter((x) => x.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return scored;
}

module.exports = { scorePair, findMatchesForItem };


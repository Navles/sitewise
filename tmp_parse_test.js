const patterns = [
  /(?:rename|change)\s+building\s+["']?([^"']+?)["']?\s+to\s+["']?([^"']+?)["']?/i,
  /(?:rename|change)\s+["']?([^"']+?)["']?\s+building\s+to\s+["']?([^"']+?)["']?/i,
  /(?:rename|change)\s+building\s+to\s+["']?([^"']+?)["']?/i,
  /(?:rename|change)\s+["']?([^"']+?)["']?\s+to\s+["']?([^"']+?)["']?/i,
];

function parseBuildingRename(message) {
  if (!message) return null;
  const normalized = message.replace(/\s+/g, ' ').trim();
  const lower = normalized.toLowerCase();
  if (!/(?:rename|change)/i.test(lower) || lower.indexOf(' to ') === -1) return null;
  const splitIndex = lower.lastIndexOf(' to ');
  if (splitIndex === -1) return null;
  const before = normalized.slice(0, splitIndex).trim();
  const after = normalized.slice(splitIndex + 4).trim();
  const stripQuotes = (s) => s.replace(/^['"]|['"]$/g, '').trim();
  const newName = stripQuotes(after);
  let targetPart = before.replace(/^(?:rename|change)\s*/i, '').trim();
  targetPart = targetPart.replace(/^building\s*/i, '').trim();
  if (!targetPart) return { newName };
  return { targetBuilding: stripQuotes(targetPart), newName };
}

const inputs = [
  "rename building TOWER 2 to TECH TOWER",
  "rename building to TECH TOWER",
  "rename TOWER 2 to TECH TOWER",
  "rename building T to Tech Tower",
  "rename building Tower 2 to T",
  "rename building TOWER 2 to T",
  "rename building 'TOWER 2' to 'TECH TOWER'",
  "rename 'TOWER 2' to 'TECH TOWER'",
];

for (const input of inputs) {
  console.log('\nINPUT:', input);
  console.log('PARSED:', parseBuildingRename(input));
}

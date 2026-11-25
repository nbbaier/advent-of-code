function mergeRanges(ranges: number[][]): [number, number][] {
  if (ranges.length === 0) {
    return [];
  }

  // Sort ranges by start point
  const sorted = ranges.sort((a, b) => a[0] - b[0]);

  // Merge overlapping ranges
  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    if (merged.length && start <= merged.at(-1)[1] + 1) {
      // Overlapping or adjacent - merge
      merged.at(-1)[1] = Math.max(merged.at(-1)[1], end);
    } else {
      // Non-overlapping - add new range
      merged.push([start, end]);
    }
  }

  return merged;
}

const ranges: number[][] = [[21_286_600_651_630, 24_648_609_504_166]];

const merged = mergeRanges(ranges);
console.log(merged);
// Output: [[21286600651630, 24648609504166]]

// Get total count of unique numbers
const totalUnique = merged.reduce<bigint>(
  (sum, [start, end]) => sum + (BigInt(end) - BigInt(start) + 1n),
  0n
);
console.log(totalUnique); // 3362008852537

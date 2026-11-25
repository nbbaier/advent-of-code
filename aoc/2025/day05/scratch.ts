function mergeRanges(ranges: number[][]): [number, number][] {
  if (ranges.length === 0) {
    return [];
  }

  // Sort ranges by start point
  const sorted = ranges.sort((a, b) => a[0] - b[0]);

  // Merge overlapping ranges
  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    const last = merged.at(-1);
    if (last && start <= last[1] + 1) {
      // Overlapping or adjacent - merge
      last[1] = Math.max(last[1], end);
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

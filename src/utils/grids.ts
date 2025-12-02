import type { Point } from "@/types";

/**
 * Checks if the given coordinates (x, y) are out of the bounds of a grid.
 *
 * @param x - The x-coordinate to check.
 * @param y - The y-coordinate to check.
 * @param rows - The number of rows in the grid.
 * @param cols - The number of columns in the grid.
 * @returns `true` if the coordinates are out of bounds, `false` otherwise.
 */
export function checkOutOfBounds(
	x: number,
	y: number,
	rows: number,
	cols: number,
): boolean {
	return x < 0 || x >= cols || y < 0 || y >= rows;
}

export function getNeighbors(current: Point): Point[] {
	return [
		[0, -1], //
		[0, 1],
		[1, 0],
		[-1, 0],
	].map(([dx, dy]) => ({ x: current.x + dx, y: current.y + dy }));
}

export function createGrid(
	input: string,
	fn: (cell: string) => boolean = (_cell) => true,
) {
	const data: string[][] = input
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	const grid = new Map<string, string>();

	for (let y = 0; y < data.length; y++) {
		for (let x = 0; x < data[0].length; x++) {
			const key = JSON.stringify({ x, y }); //`${x},${y}`;
			const value = data[y][x];

			if (fn(value)) {
				if (!grid.get(key)) {
					grid.set(key, value);
				}
			}
		}
	}

	return grid;
}

export function extractPoint(key: string): Point {
	return { x: Number(key.split(",")[0]), y: Number(key.split(",")[1]) };
}

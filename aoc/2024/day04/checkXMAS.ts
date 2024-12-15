import type { Point, Direction } from "@/types";
import { checkOutOfBounds } from "@/utils/grids";

export function checkXMAS(
	grid: string[][],
	start: Point,
	dir: Direction,
	rows: number,
	cols: number,
): boolean {
	const target = "XMAS";

	const endX = start.x + dir.dx;
	const endY = start.y + dir.dy;

	if (checkOutOfBounds(endX, endY, rows, cols)) {
		// console.log(`[${endX}, ${endY}]\tout`);
		return false;
	}
	// console.log(`[${endX}, ${endY}]\tin`);
	for (let i = 0; i < target.length; i++) {
		const currentX = start.x + dir.dx * i;
		const currentY = start.y + dir.dy * i;
		if (checkOutOfBounds(currentX, currentY, rows, cols)) {
			// console.log(`[${currentX}, ${currentY}]\tout`);
			return false;
		}
		if (grid[currentY][currentX] !== target[i]) {
			return false;
		}
	}

	return true;
}
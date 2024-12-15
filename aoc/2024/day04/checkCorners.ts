import type { Point } from "@/types";
import { checkOutOfBounds } from "@/utils/grids";
import { directions } from ".";

export function checkCorners(
	grid: string[][],
	start: Point,
	rows: number,
	cols: number,
): boolean {
	const region: string[][] = [];
	const corners = Object.fromEntries(
		Object.entries(directions).filter(([k, v]) => k.length === 2),
	);

	for (const corner of Object.entries(corners)) {
		const endX = start.x + corner[1].dx;
		const endY = start.y + corner[1].dy;
		if (checkOutOfBounds(endX, endY, rows, cols)) {
			return false;
		}
	}

	const lrDiag = `${grid[start.y + corners.ur.dy][start.x + corners.ur.dx]}${grid[start.y + corners.dl.dy][start.x + corners.dl.dx]}`;
	const rlDiag = `${grid[start.y + corners.ul.dy][start.x + corners.ul.dx]}${grid[start.y + corners.dr.dy][start.x + corners.dr.dx]}`;

	// return the check of the diagonals
	return ["MS", "SM"].includes(lrDiag) && ["MS", "SM"].includes(rlDiag);
}

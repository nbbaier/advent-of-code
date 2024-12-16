import type { Board, Point } from "@/types";

export function sortQudrants(board: Board, points: Point[]) {
	const middleRow = Math.floor(board.rows / 2);
	const middleCol = Math.floor(board.cols / 2);

	const isTopBottom = (y: number) => {
		if (y >= 0 && y < middleRow) {
			return "top";
		}
		if (y > middleRow && y < board.rows) {
			return "bottom";
		}
		return "middle";
	};

	const isLeftRight = (x: number) => {
		if (x >= 0 && x < middleCol) {
			return "left";
		}
		if (x > middleCol && x < board.cols) {
			return "right";
		}
		return "middle";
	};

	const sorted = new Map<string, string[]>();

	for (const { x, y } of points) {
		const point = `(${x},${y})`;
		const q = `${isTopBottom(y)}-${isLeftRight(x)}`;
		if (!sorted.get(q) && !q.includes("middle")) {
			sorted.set(q, []);
			sorted.get(q)?.push(point);
		} else sorted.get(q)?.push(point);
	}

	return sorted;
}

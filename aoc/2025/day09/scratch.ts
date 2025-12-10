import type { Point } from "@/types";
import { createPairs, pairwise } from "@/utils";

const input = await Bun.file("./input.txt").text();

const intersects = (c1: Point, c2: Point, line: [Point, Point]) => {
	const rectLeft = Math.min(c1.x, c2.x);
	const rectRight = Math.max(c1.x, c2.x);
	const rectTop = Math.min(c1.y, c2.y);
	const rectBottom = Math.max(c1.y, c2.y);

	const [l1, l2] = line;

	const lineRight = Math.max(l1.x, l2.x);
	const lineLeft = Math.min(l1.x, l2.x);
	const lineBottom = Math.max(l1.y, l2.y);
	const lineTop = Math.min(l1.y, l2.y);

	if (lineRight === lineLeft) {
		const verticalLineIsInside = rectRight > lineRight && lineRight > rectLeft;
		const isWithinBoxHorizontally =
			lineBottom > rectTop && rectBottom > lineTop;
		return verticalLineIsInside && isWithinBoxHorizontally;
	} else {
		const horizontalLineIsInside = rectBottom > lineTop && lineTop > rectTop;
		const isWithinBoxVertically = rectRight > lineLeft && lineRight > rectLeft;
		return horizontalLineIsInside && isWithinBoxVertically;
	}
};

function main() {
	const tiles: Point[] = input
		.trim()
		.split("\n")
		.map((p) => p.split(",").map(Number))
		.map(([x, y]) => ({ x, y }));

	const corners = Array.from(createPairs(tiles));

	const areas = corners
		.map((c) => ({
			corners: c,
			area: (Math.abs(c[1].x - c[0].x) + 1) * (Math.abs(c[1].y - c[0].y) + 1),
		}))
		.sort((a, b) => b.area - a.area);

	const lines = Array.from(pairwise([...tiles, tiles[0]]));

	for (const r of areas.slice()) {
		const [c1, c2] = r.corners;
		const { area } = r;
		const outside = lines.map((l) => intersects(c1, c2, l)).some((t) => t);
		if (outside) continue;
		return area;
	}
}
console.log(main());

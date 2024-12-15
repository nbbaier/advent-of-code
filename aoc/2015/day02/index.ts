function calcArea(box: { l: number; w: number; h: number }) {
	return box.l * box.w + box.w * box.h + box.h * box.l;
}

function calcSlack(box: { l: number; w: number; h: number }) {
	return [box.l * box.w, box.w * box.h, box.h * box.l].sort((a, b) => a - b)[0];
}

function calcPerim(box: { l: number; w: number; h: number }): number {
	return Object.values(box)
		.sort((a, b) => a - b)
		.slice(0, 2)
		.reduce((a, c) => {
			return a + 2 * c;
		}, 0);
}

function calcBow(box: { l: number; w: number; h: number }) {
	return Object.values(box).reduce((a, c) => {
		return a * c;
	}, 1);
}

function part1(input: string): number | string {
	const boxes = input
		.trim()
		.split("\n")
		.map((line) => {
			const [l, w, h] = line.split("x").map(Number);
			return { l, w, h };
		});

	const sqft = boxes.map((box) => 2 * calcArea(box) + calcSlack(box));

	return sqft.reduce((a, c) => a + c, 0);
}

function part2(input: string): number | string {
	const boxes = input
		.trim()
		.split("\n")
		.map((line) => {
			const [l, w, h] = line.split("x").map(Number);
			return { l, w, h };
		});

	return boxes.map((box) => calcBow(box) + calcPerim(box)).reduce((a, c) => a + c);
}

export default { p1: part1, p2: part2 };

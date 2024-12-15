function createLists(data: string): {
	left: number[];
	right: number[];
} {
	const pairs = data.trim().split("\n");

	const left: number[] = [];
	const right: number[] = [];

	for (const pair of pairs) {
		const splitPair = pair.split(/\s+/);
		left.push(Number.parseInt(splitPair[0]));
		right.push(Number.parseInt(splitPair[1]));
	}

	return { left, right };
}

function part1(input: string): number | string {
	const { left, right } = createLists(input);

	const leftSorted = left.sort();
	const rightSorted = right.sort();
	const absoluteDifferences = leftSorted.map((num, index) => {
		return Math.abs(num - rightSorted[index]);
	});

	const totalDifference = absoluteDifferences.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);

	return totalDifference;
}

function part2(input: string): number | string {
	const { left, right } = createLists(input);

	const total = left
		.map((n) => {
			return n * right.filter((el) => el === n).length;
		})
		.reduce((a, c) => a + c);

	return total;
}

export default { p1: part1, p2: part2 };

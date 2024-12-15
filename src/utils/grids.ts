export function checkOutOfBounds(x: number, y: number, rows: number, cols: number): boolean {
	return x < 0 || x >= cols || y < 0 || y >= rows;
}

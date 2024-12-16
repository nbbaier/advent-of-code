/**
 * Checks if the given coordinates (x, y) are out of the bounds of a grid.
 *
 * @param x - The x-coordinate to check.
 * @param y - The y-coordinate to check.
 * @param rows - The number of rows in the grid.
 * @param cols - The number of columns in the grid.
 * @returns `true` if the coordinates are out of bounds, `false` otherwise.
 */
export function checkOutOfBounds(x: number, y: number, rows: number, cols: number): boolean {
	return x < 0 || x >= cols || y < 0 || y >= rows;
}

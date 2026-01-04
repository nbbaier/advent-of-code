export class Queue<T> {
	private storage: T[];
	private capacity: number;

	constructor(options: { capacity?: number; initialState?: T[] }) {
		this.capacity = options.capacity ?? Infinity;
		this.storage = options.initialState ?? [];
	}

	enqueue(item: T): void {
		if (this.size() === this.capacity) {
			throw Error("Queue has reached max capacity, you cannot add more items");
		}
		this.storage.push(item);
	}

	dequeue(): T | undefined {
		return this.storage.shift();
	}

	size(): number {
		return this.storage.length;
	}

	getState(): { size: number; storage: T[] } {
		return { size: this.storage.length, storage: this.storage };
	}
}

export function mapsAreEqual<K, V>(map1: Map<K, V>, map2: Map<K, V>): boolean {
	if (map1.size !== map2.size) {
		return false;
	}
	for (const [key, value] of map1) {
		if (!map2.has(key) || map2.get(key) !== value) {
			return false;
		}
	}
	return true;
}

export function addMaps(
	base: Map<number, number>,
	additions: Map<number, number>,
): Map<number, number> {
	const result = new Map(base);

	additions.forEach((value, key) => {
		result.set(key, (result.get(key) || 0) + value);
	});

	return result;
}

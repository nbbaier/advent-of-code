import { getRunMode } from "@/utils";
import { boolean, re } from "mathjs";
import { match, P } from "ts-pattern";

const runMode = getRunMode();

type Program = number[];
type Registers = Map<"A" | "B" | "C", number>;

type Instruction = (
	r: Registers,
	o: number,
	p: number,
) => { out?: number; nextPointer: number };

function combos(registers: Registers, operand: number): number | string {
	const result = match(operand)
		.with(
			P.when((op) => op <= 3),
			() => operand,
		)
		.with(4, () => getRegister(registers, "A"))
		.with(5, () => getRegister(registers, "B"))
		.with(6, () => getRegister(registers, "C"))
		.otherwise(() => "error");

	return result;
}

const binary = (n: number, l: number) => Number(`0b${(n >>> 0).toString(2).padStart(l, "0")}`);

function getRegister(registers: Registers, r: "A" | "B" | "C"): number {
	const value = registers.get(r);
	return value !== undefined ? value : 0;
}

const adv: Instruction = (r, o, p) => {
	const A = getRegister(r, "A");
	const power = combos(r, o);
	if (typeof power === "string") {
		throw new Error("Combo operand 7");
	}
	r.set("A", Math.trunc(A / 2 ** power));
	return { nextPointer: p + 2 };
};

const bxl: Instruction = (r, o, p) => {
	const B = getRegister(r, "B");
	r.set("B", B ^ o);
	return { nextPointer: p + 2 };
};

const bst: Instruction = (r, o, p) => {
	const value = combos(r, o);
	if (typeof value === "string") {
		throw new Error("Combo operand 7");
	}
	r.set("B", value % 8);
	return { nextPointer: p + 2 };
};

const jnz: Instruction = (r, o, p) => {
	const A = getRegister(r, "A");
	if (A === 0) {
		return { nextPointer: p + 2 };
	}
	return { nextPointer: o };
};

const bxc: Instruction = (r, _, p) => {
	const B = getRegister(r, "B");
	const C = getRegister(r, "C");
	r.set("C", B ^ C);
	return { nextPointer: p + 2 };
};

const out: Instruction = (r, o, p) => {
	const value = combos(r, o);
	if (typeof value === "string") {
		throw new Error("Combo operand 7");
	}

	return { out: value % 8, nextPointer: p + 2 };
};

const bdv: Instruction = (r, o, p) => {
	const A = getRegister(r, "A");
	const power = combos(r, o);
	if (typeof power === "string") {
		throw new Error("Combo operand 7");
	}
	r.set("B", Math.trunc(A / 2 ** power));
	return { nextPointer: p + 2 };
};

const cdv: Instruction = (r, o, p) => {
	const A = getRegister(r, "A");
	const power = combos(r, o);
	if (typeof power === "string") {
		throw new Error("Combo operand 7");
	}
	r.set("C", Math.trunc(A / 2 ** power));
	return { nextPointer: p + 2 };
};

function parse(input: string): [Registers, Program] {
	const [A, B, C, _, raw] = input.trim().split("\n");
	const program: Program = raw.split(":")[1].trim().split(",").map(Number);
	const registers: Registers = new Map();
	registers.set("A", Number(A.split(":")[1].trim()));
	registers.set("B", Number(B.split(":")[1].trim()));
	registers.set("C", Number(C.split(":")[1].trim()));

	return [registers, program];
}

const instructions: Map<number, Instruction> = new Map([
	[0, adv],
	[1, bxl],
	[2, bst],
	[3, jnz],
	[4, bxc],
	[5, out],
	[6, bdv],
	[7, cdv],
]);

function part1(input: string): number | string {
	const [registers, program] = parse(input);

	return readProgram(program, registers, instructions).join("");
}

function part2(input: string): number | string {
	return 0;
}

export default { p1: part1, p2: part2 };

function readProgram(
	program: Program,
	registers: Registers,
	instructions: Map<number, Instruction>,
) {
	let pointer = 0;
	let halt = false;
	const output: number[] = [];

	console.log("\nStarting program execution:");
	console.log("Initial registers:", {
		A: registers.get("A"),
		B: registers.get("B"),
		C: registers.get("C"),
	});

	while (!halt) {
		const opcode = program[pointer];
		const operand = program[pointer + 1];
		const instructionName =
			[...instructions.entries()].find(([k]) => k === opcode)?.[1].name || "unknown";

		console.log(`\nStep ${pointer / 2}:`);
		console.log(`Executing ${instructionName}(${operand})`);
		console.log("Before:", {
			A: registers.get("A"),
			B: registers.get("B"),
			C: registers.get("C"),
		});

		const fn = instructions.get(opcode) as Instruction;
		const { out, nextPointer } = fn(registers, operand, pointer);

		if (out !== undefined) {
			console.log(`Output: ${out}`);
			output.push(out);
		}

		console.log("After:", {
			A: registers.get("A"),
			B: registers.get("B"),
			C: registers.get("C"),
		});
		console.log("Next pointer:", nextPointer);

		pointer = nextPointer;

		if (pointer >= program.length) {
			halt = true;
		}
	}

	return output;
}

// Add a test function
function test() {
	// First run the example to verify
	console.log("\nRunning example test:");
	const testRegisters: Registers = new Map();
	testRegisters.set("A", 2024);
	testRegisters.set("B", 0);
	testRegisters.set("C", 0);
	const testProgram = [0, 1, 5, 4, 3, 0];
	console.log("Test output:", readProgram(testProgram, testRegisters, instructions).join(","));

	// Then run the actual input
	console.log("\nRunning actual input:");
	const actualRegisters: Registers = new Map();
	actualRegisters.set("A", 59590048);
	actualRegisters.set("B", 0);
	actualRegisters.set("C", 0);
	const actualProgram = [2, 4, 1, 5, 7, 5, 0, 3, 1, 6, 4, 3, 5, 5, 3, 0];
	console.log(
		"Actual output:",
		readProgram(actualProgram, actualRegisters, instructions).join(","),
	);
}

// Call it before running the real input
test();

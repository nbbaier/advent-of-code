# Advent of Code

This repository contains solutions and a runner for Advent of Code, built with Bun and TypeScript.

## Prerequisites

-  [Bun](https://bun.sh/) (latest version recommended)

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```

## Setup

Create a `.env` file in the root directory to store your session cookie. This is required for downloading inputs and puzzle descriptions.

```env
AOC_SESSION=your_session_cookie_here
```

## Usage

The project includes several scripts to help manage and run your solutions. The CLI defaults to the current day and year if arguments are omitted.

### Scaffolding a New Day

Sets up the directory structure for a new day, creates solution files from templates, and downloads the input and puzzle description.

```bash
bun run scaffold [day] [year]
```

Example:

```bash
bun run scaffold 1 2024
```

### Running Solutions

**Test against sample input:**
Runs the solution using `sample.txt`.

```bash
bun run try [day] [year]
```

**Run against real input:**
Runs the solution using `input.txt` and displays execution time.

```bash
bun run attempt [day] [year]
```

### Reading the Puzzle

Downloads the puzzle description to `puzzle.md` if it doesn't already exist.

```bash
bun run read [day] [year]
```

### Testing

Run all tests using Vitest:

```bash
bun run check
```

Run tests in watch mode:

```bash
bun run watch
```

## Project Structure

-  `src/`: Source code for the CLI and utilities.
-  `aoc/templates/`: Templates for generating new solution runners and tests.
-  `aoc/[year]/[day]/`: Generated solution files (runner, tests, input, etc.).

## License

MIT

import { readInputStr, lines, format, bench } from "../util.ts";

function parseInput(input: string): string[][] {
  return lines(input.trim()).map((l) => l.trim().split(""));
}

function step(grid: string[][]): { grid: string[][]; moved: boolean } {
  let moved = false;
  const step1 = structuredClone(grid);

  // eastward movement
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] !== ">") continue;
      if (grid[r][(c + 1) % grid[0].length] !== ".") continue;

      step1[r][(c + 1) % grid[0].length] = ">";
      step1[r][c] = ".";
      moved = true;
    }
  }

  // southward movement
  const step2 = structuredClone(step1);
  for (let r = 0; r < step1.length; r++) {
    for (let c = 0; c < step1[0].length; c++) {
      if (step1[r][c] !== "v") continue;
      if (step1[(r + 1) % step1.length][c] !== ".") continue;

      step2[(r + 1) % step1.length][c] = "v";
      step2[r][c] = ".";
      moved = true;
    }
  }

  return { grid: step2, moved };
}

function part1(grid: string[][]): number {
  let result = { moved: true, grid };
  let steps = 0;

  while (result.moved) {
    result = step(result.grid);
    steps++;
  }

  return steps;
}

Deno.test("Day 25, Part 1:", async () => {
  const input = await readInputStr(25).then(parseInput);
  const [result, time] = bench(() => part1(input));
  console.log(format(result), `(${time} ms)`);
});

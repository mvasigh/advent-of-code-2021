import * as util from "../util.ts";

async function readInput(): Promise<number[]> {
  const txt = await Deno.readTextFile("src/day_01/input.txt");
  return txt
    .trim()
    .split("\n")
    .map((v) => parseInt(v));
}

async function part1(): Promise<number> {
  const input = await readInput();
  let prev = Number.MAX_VALUE;
  let increases = 0;

  for (const val of input) {
    if (val > prev) {
      increases += 1;
    }

    prev = val;
  }

  return increases;
}

async function part2(): Promise<number> {
  const input = await readInput();
  let window: number[] = [];
  let increases = 0;

  for (const [i, val] of Object.entries(input)) {
    if (Number(i) < 3) {
      window.push(val);
      continue;
    }

    const newWindow: number[] = [...window.slice(1), val];
    const sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr);

    if (sum(newWindow) > sum(window)) {
      increases += 1;
    }

    window = newWindow;
  }

  return increases;
}

Deno.test("Day 1, Part 1:", async () => {
  const answer = await part1();
  console.log(util.format(answer));
});

Deno.test("Day 1, Part 2:", async () => {
  const answer = await part2();
  console.log(util.format(answer));
});

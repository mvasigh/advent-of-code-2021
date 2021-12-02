import * as util from "../util.ts";

async function readInput(): Promise<{ command: string; val: number }[]> {
  const txt = await Deno.readTextFile("src/day_02/input.txt");
  return txt
    .trim()
    .split("\n")
    .map((l) => {
      const [command, val] = l.split(" ");
      return { command, val: Number(val) };
    });
}

async function part1(): Promise<number> {
  const input = await readInput();
  let depth = 0;
  let pos = 0;

  for (const { command, val } of input) {
    if (command === "forward") {
      pos += val;
    } else if (command === "up") {
      depth -= val;
    } else if (command === "down") {
      depth += val;
    }
  }

  return depth * pos;
}

async function part2(): Promise<number> {
  const input = await readInput();
  let depth = 0;
  let pos = 0;
  let aim = 0;

  for (const { command, val } of input) {
    if (command === "forward") {
      pos += val;
      depth += aim * val;
    } else if (command === "up") {
      aim -= val;
    } else if (command === "down") {
      aim += val;
    }
  }

  return depth * pos;
}

Deno.test("Day 2, Part 1:", async () => {
  const answer = await part1();
  console.log(util.format(answer));
});

Deno.test("Day 2, Part 2:", async () => {
  const answer = await part2();
  console.log(util.format(answer));
});

import * as util from "../util.ts";

type Instruction = {
  command: string;
  val: number;
};

async function readInput(): Promise<Instruction[]> {
  const txt = await Deno.readTextFile("src/day_02/input.txt");
  return txt
    .trim()
    .split("\n")
    .map((l) => {
      const [command, val] = l.split(" ");
      return { command, val: Number(val) };
    });
}

function part1(input: Instruction[]): number {
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

function part2(input: Instruction[]): number {
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
  const input = await readInput();
  console.log(util.format(part1(input)));
});

Deno.test("Day 2, Part 2:", async () => {
  const input = await readInput();
  console.log(util.format(part2(input)));
});

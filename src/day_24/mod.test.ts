import { readInputStr, lines, format, bench, exists, range } from "../util.ts";

type Instruction = {
  command: string;
  a: string | number;
  b?: string | number;
};

function parseInput(input: string): Instruction[] {
  return lines(input.trim()).map((line) => {
    const [command, _a, _b] = line.trim().split(" ");

    const wordRe = /^([a-zA-Z])+$/;

    return {
      command,
      a: wordRe.test(_a) ? _a : Number(_a),
      b: exists(_b) ? (wordRe.test(_b) ? _b : Number(_b)) : undefined,
    };
  });
}

function solve(program: Instruction[], largest = true): number {
  const stack: [number, number][] = [];
  const final = Array(14).fill(0);

  for (const i of range(14)) {
    const xAdd = program[i * 18 + 5].b as number;

    if (xAdd > 0) {
      stack.push([program[i * 18 + 15].b as number, i]);
    } else {
      const [yAdd, yIndex] = stack.pop() as [number, number];

      let candidate;
      if (largest) {
        candidate = 9;
        while (candidate + yAdd + xAdd > 9) {
          candidate--;
        }
      } else {
        candidate = 1;
        while (candidate + yAdd + xAdd < 1) {
          candidate++;
        }
      }

      final[yIndex] = candidate;
      final[i] = candidate + yAdd + xAdd;
    }
  }

  return Number(final.join(""));
}

function part1(program: Instruction[]): number {
  return solve(program);
}

function part2(program: Instruction[]): number {
  return solve(program, false);
}

Deno.test("Day 24, Part 1:", async () => {
  const input = await readInputStr(24).then(parseInput);
  const [result, time] = bench(() => part1(input));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 24, Part 2:", async () => {
  const input = await readInputStr(24).then(parseInput);
  const [result, time] = bench(() => part2(input));
  console.log(format(result), `(${time} ms)`);
});

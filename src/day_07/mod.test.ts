import { format, readInputStr, extractNums, range } from "../util.ts";

function bestPos(crabs: number[], greedy = false): number {
  const [min, max] = crabs.reduce(
    ([sm, lg], v) => [Math.min(sm, v), Math.max(lg, v)],
    [Number.MAX_VALUE, Number.MIN_VALUE]
  );

  const pos = Array(max - min).fill(0);

  for (const crab of crabs) {
    for (const i of range(max - min)) {
      const diff = Math.abs(crab - (min + i));
      pos[i] += greedy ? ((diff + 1) * diff) / 2 : diff;
    }
  }

  return Math.min(...pos);
}

const part1 = (crabs: number[]): number => bestPos(crabs);
const part2 = (crabs: number[]): number => bestPos(crabs, true);

Deno.test("Day 7, Part 1:", async () => {
  const input = await readInputStr(7);
  console.log(format(part1(extractNums(input))));
});

Deno.test("Day 7, Part 2:", async () => {
  const input = await readInputStr(7);
  console.log(format(part2(extractNums(input))));
});

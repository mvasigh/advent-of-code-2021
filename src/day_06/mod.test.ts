import { format, readInputStr, extractNums } from "../util.ts";

const cache: {[key: string]: number} = {}

function modelFish(fish: number, days: number): number {
  const key = `${fish},${days}`;
  let sum = 1;
  if (days <= 0) return sum;
  if (cache[key]) return cache[key];

  while (days > fish) {
    days -= fish + 1;
    fish = 6;
    sum += modelFish(8, days);
  }

  cache[key] = sum;
  return sum;
}

function modelFishList(fish: number[], days = 80): number {
  return fish.reduce((sum, f) => sum + modelFish(f, days), 0);
}

function part1(fish: number[]): number {
  return modelFishList(fish, 80);
}

function part2(fish: number[]): number {
  return modelFishList(fish, 256);
}

Deno.test("Day 6, Part 1:", async () => {
  const input = await readInputStr(6);
  console.log(format(part1(extractNums(input))));
});

Deno.test("Day 6, Part 2:", async () => {
  const input = await readInputStr(6);
  console.log(format(part2(extractNums(input))));
});

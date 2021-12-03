import * as util from "../util.ts";

async function readInput(): Promise<number[]> {
  const txt = await Deno.readTextFile("src/day_03/input.txt");
  return txt
    .trim()
    .split("\n")
    .map((v) => parseInt(v, 2));
}

enum CommonBit {
  Eq,
  On,
  Off,
}

const isBitSet = (num: number, i: number): boolean => !!(num & (1 << i));

function getBitCounts(values: number[], bits: number): number[] {
  const counts: number[] = new Array(bits).fill(null).map(() => 0);

  for (const val of values) {
    for (let i = 0; i < counts.length; i++) {
      if (isBitSet(val, i)) counts[i] += 1;
    }
  }

  return counts;
}

function bitCountsToInt(
  counts: number[],
  predicate: (v: number) => boolean
): number {
  return counts.reduce(
    (sum, val, i) => (predicate(val) ? sum + Math.pow(2, i) : sum),
    0
  );
}

function locateNum(
  _values: number[],
  bits: number,
  predicate: (val: number, bit: number, common: CommonBit) => boolean
): number {
  let bit = bits - 1;
  let values = _values.slice();

  while (values.length > 1) {
    const count = getBitCounts(values, bits)[bit];
    const half = values.length / 2;

    let common: CommonBit;
    if (count === half) {
      common = CommonBit.Eq;
    } else if (count > half) {
      common = CommonBit.On;
    } else {
      common = CommonBit.Off;
    }

    values = values.filter((val) => predicate(val, bit, common));
    bit -= 1;
  }

  return values[0];
}

function part1(input: number[], bits = 12): number {
  const half = input.length / 2;
  const counts = getBitCounts(input, bits);

  return (
    bitCountsToInt(counts, (ct) => ct >= half) *
    bitCountsToInt(counts, (ct) => ct < half)
  );
}

function part2(input: number[], bits = 12): number {
  const oxygen = locateNum(input, bits, (val, bit, common) => {
    switch (common) {
      case CommonBit.Eq:
        return isBitSet(val, bit);
      case CommonBit.On:
        return isBitSet(val, bit);
      case CommonBit.Off:
        return !isBitSet(val, bit);
      default:
        return false;
    }
  });

  const co2 = locateNum(input, bits, (val, bit, common) => {
    switch (common) {
      case CommonBit.Eq:
        return !isBitSet(val, bit);
      case CommonBit.On:
        return !isBitSet(val, bit);
      case CommonBit.Off:
        return isBitSet(val, bit);
      default:
        return false;
    }
  });

  return oxygen * co2;
}

Deno.test("Day 3, Part 1:", async () => {
  const input = await readInput();
  console.log(util.format(part1(input)));
});

Deno.test("Day 3, Part 2:", async () => {
  const input = await readInput();
  console.log(util.format(part2(input)));
});

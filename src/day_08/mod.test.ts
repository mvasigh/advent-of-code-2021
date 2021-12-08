import { format, readInputStr } from "../util.ts";

function diff(a: string, b: string): string {
  if (!a || !b) return "aaaaaaaa"; // lol

  const smaller = a.length < b.length ? a : b;
  let larger = a === smaller ? b : a;

  for (const char of smaller) {
    larger = larger.replace(char, "");
  }

  return larger;
}

function findDigits(signals: string[]): { [key: string]: number } {
  const sigs: { [key: string]: number } = {};
  const digs: { [key: string]: string } = {};

  const set = (sig: string, dig: number, del: number) => {
    sigs[sig] = dig;
    digs[dig] = sig;
    signals.splice(del, 1);
  };

  while (signals.length) {
    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];

      if (signal.length === 2) {
        set(signal, 1, i);
      } else if (signal.length === 3) {
        set(signal, 7, i);
      } else if (signal.length === 4) {
        set(signal, 4, i);
      } else if (signal.length === 7) {
        set(signal, 8, i);
      } else if (signal.length === 6) {
        if (diff(signal, digs[1]).length === 4 && digs[9]) {
          set(signal, 0, i);
        } else if (diff(signal, digs[4]).length === 2) {
          set(signal, 9, i);
        } else if (digs[9] && digs[0]) {
          set(signal, 6, i);
        }
      } else if (signal.length === 5) {
        if (diff(signal, digs[1]).length === 3) {
          set(signal, 3, i);
        } else if (diff(signal, digs[6]).length === 1) {
          set(signal, 5, i);
        } else if (digs[3] && digs[5]) {
          set(signal, 2, i);
        }
      }
    }
  }

  return sigs;
}

function part1(lines: string[]): number {
  const uniques = new Set([2, 3, 4, 7]);
  return [
    ...lines
      .map((l) => l.split("|")[1].trim())
      .join(" ")
      .matchAll(/\w+/g),
  ].filter((m) => uniques.has(m[0].length)).length;
}

function part2(lines: string[]): number {
  let sum = 0;

  for (const line of lines) {
    const [input, output] = line.split("|").map((s) => {
      return [...s.matchAll(/\w+/g)].map((m) => m[0].split("").sort().join(""));
    });
    const digitsMap = findDigits(input);
    sum += Number(output.map((o) => digitsMap[o].toString()).join(""));
  }

  return sum;
}

Deno.test("Day 8, Part 1:", async () => {
  const input = await readInputStr(8);
  console.log(format(part1(input.split("\n"))));
});

Deno.test("Day 8, Part 2:", async () => {
  const input = await readInputStr(8);
  console.log(format(part2(input.split("\n"))));
});

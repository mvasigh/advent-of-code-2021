import * as Colors from "https://deno.land/std@0.116.0/fmt/colors.ts";

export const format = (val: string | number): string =>
  Colors.bgGreen(Colors.black(" " + val.toString() + " "));

export const range = (length: number): number[] =>
  Array.from({ length }, (_, i) => i);

export const readInputStr = async (day: number): Promise<string> => {
  const txt = await Deno.readTextFile(
    `src/day_${day.toString().padStart(2, "0")}/input.txt`
  );
  return txt.trim();
};

export const extractNums = (txt: string) =>
  [...txt.matchAll(/(-)?\d+/g)].map((m) => parseInt(m[0], 10));

export const lines = (txt: string) => txt.trim().split("\n");

export const chunk = (arr: unknown[], chunkSize = 10): unknown[][] => {
  const chunks: unknown[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

export const exists = (val: unknown) => val != null;

// deno-lint-ignore ban-types
export const bench = (fn: Function) => {
  const now = performance.now();
  const result = fn();
  return [result, (performance.now() - now).toFixed(2)];
};

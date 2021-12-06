import * as Colors from "https://deno.land/std@0.116.0/fmt/colors.ts";

export const format = (val: number): string =>
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
  [...txt.matchAll(/\d+/g)].map((m) => parseInt(m[0], 10));

export const chunk = (arr: unknown[], chunkSize = 10): unknown[][] => {
  const chunks: unknown[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

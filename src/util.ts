import * as Colors from "https://deno.land/std@0.116.0/fmt/colors.ts";

export const format = (val: number): string =>
  Colors.bgGreen(Colors.black(" " + val.toString() + " "));

export const range = (length: number): number[] =>
  Array.from({ length }, (_, i) => i);

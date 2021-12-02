import * as Colors from "https://deno.land/std@0.116.0/fmt/colors.ts";

export const format = (val: number): string =>
  Colors.bgGreen(Colors.black(" " + val.toString() + " "));

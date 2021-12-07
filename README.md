# 🎄 AoC '21

My solutions for [Advent of Code 2021](https://adventofcode.com/2021) :)

## Running the tests

Some days will be in [Rust](https://rust-lang.org), some in [TypeScript](https://typescriptlang.org), and some in both.

To run everything:
```sh
sh ./test.sh
```

To run tests for a specific day using the shell script, you can pass the day as an argument:
```sh
sh ./test.sh 7 # Runs Day 7 tests
```

To run the Rust solutions, make sure you have Rust and Cargo installed and run:

```sh
cargo test part -- --nocapture --test-threads=1
```

To run the TypeScript solutions, make sure you have [Deno](https://deno.land) installed and run:

```sh
deno test -A --filter="/Day \d+, Part \d+/"
```
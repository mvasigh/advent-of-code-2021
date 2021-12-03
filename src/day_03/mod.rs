use crate::util;
use std::fs::File;
use std::io::{self, BufRead};

fn read_input() -> io::Result<Vec<i32>> {
    let file = File::open("./src/day_03/input.txt")?;
    let reader = io::BufReader::new(file);
    let vec = reader
        .lines()
        .map(|l| i32::from_str_radix(l.unwrap().as_str(), 2).unwrap())
        .collect();

    Ok(vec)
}

fn is_bit_set(num: i32, index: usize) -> bool {
    num & (1 << index) != 0
}

fn bitcounts_to_int<F>(bit_vec: &Vec<i32>, eval_fn: F) -> i32
where
    F: Fn(i32) -> bool,
{
    bit_vec
        .to_owned()
        .iter()
        .enumerate()
        .fold(0, |sum, (i, val)| {
            if eval_fn(*val) {
                sum + i32::pow(2, i as u32)
            } else {
                sum
            }
        })
}

fn part_1(input: Vec<i32>, bits: usize) -> i32 {
    let half = (input.len() / 2) as i32;
    let mut counts = vec![0; bits];

    for val in input.iter() {
        for i in 0..bits {
            counts[i] += if is_bit_set(*val, i) { 1 } else { 0 };
        }
    }

    bitcounts_to_int(&counts, |val| val >= half) * bitcounts_to_int(&counts, |val| val < half)
}

fn part_2(input: Vec<i32>) -> i32 {
    123
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    let input = read_input()?;
    println!("Day 3, Part 1: {}", util::format(part_1(input, 12)));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    let input = read_input()?;
    println!("Day 3, Part 2: {}", util::format(part_2(input)));
    Ok(())
}

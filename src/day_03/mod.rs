use crate::util;
use std::fmt;
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

#[derive(Clone, Copy, Debug)]
enum CommonBit {
    On,
    Off,
    Eq,
}

fn is_bit_set(num: i32, index: usize) -> bool {
    num & (1 << index) != 0
}

fn get_bitcounts(values: &Vec<i32>, bits: usize) -> Vec<i32> {
    let mut counts = vec![0; bits];

    for val in values.iter() {
        for i in 0..bits {
            counts[i] += if is_bit_set(*val, i) { 1 } else { 0 };
        }
    }

    counts
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

fn locate_num<F>(values_vec: &Vec<i32>, bits: usize, eval_fn: F) -> i32
where
    F: Fn(i32, usize, CommonBit) -> bool,
{
    let mut values = values_vec.to_owned();
    let mut bit = bits as isize - 1;

    while values.len() > 1 {
        let count = get_bitcounts(&values, bits)[bit as usize] as f32;
        let half = values.len() as f32 / 2.0;
        let common_bit = if count == half {
            CommonBit::Eq
        } else if count > half {
            CommonBit::On
        } else {
            CommonBit::Off
        };

        values = values
            .iter()
            .filter(|val| eval_fn(**val, bit as usize, common_bit))
            .map(|v| v.to_owned())
            .collect();

        bit -= 1;
    }

    values[0]
}

fn part_1(input: Vec<i32>, bits: usize) -> i32 {
    let half = (input.len() / 2) as i32;
    let counts = get_bitcounts(&input, bits);

    bitcounts_to_int(&counts, |ct| ct >= half) * bitcounts_to_int(&counts, |ct| ct < half)
}

fn part_2(input: Vec<i32>, bits: usize) -> i32 {
    let oxygen = locate_num(&input, bits, |val, bit, most_common| match most_common {
        CommonBit::Eq => is_bit_set(val, bit),
        CommonBit::On => is_bit_set(val, bit),
        CommonBit::Off => !is_bit_set(val, bit),
    });

    let co2 = locate_num(&input, bits, |val, bit, most_common| match most_common {
        CommonBit::Eq => !is_bit_set(val, bit),
        CommonBit::On => !is_bit_set(val, bit),
        CommonBit::Off => is_bit_set(val, bit),
    });

    oxygen * co2
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    let input = read_input()?;
    println!("{}", util::format(part_1(input, 12)));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    let input = read_input()?;
    println!("{}", util::format(part_2(input, 12)));
    Ok(())
}

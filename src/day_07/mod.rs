use crate::util::{self, extract_nums, format};
use std::collections::HashMap;
use std::fs::File;
use std::io::{self, BufRead};

fn min_max(nums: &Vec<i64>) -> (i64, i64) {
    nums.iter().fold((i64::MAX, i64::MIN), |mut s, val| {
        s.0 = s.0.min(*val);
        s.1 = s.1.max(*val);
        s
    })
}

fn best_pos(crabs: Vec<i64>, greedy: bool) -> i64 {
    let (min, max) = min_max(&crabs);
    let size = (max - min) as usize;
    let mut pos = vec![0; size];

    for crab in crabs {
        for i in 0..size {
            let loc = min + i as i64;
            let diff = (crab - loc).abs();
            pos[i] += if greedy { ((diff + 1) * (diff)) / 2 } else { diff };
        }
    }

    pos.iter().fold(i64::MAX, |best, val| best.min(*val)) 
}

fn part_1(crabs: Vec<i64>) -> i64 {
    best_pos(crabs, false)
}

fn part_2(crabs: Vec<i64>) -> i64 {
    best_pos(crabs, true)
}

#[test]
fn example_part_1() {
    let input = "16,1,2,0,4,2,7,1,2,14";
    let crabs = util::extract_nums::<i64>(&input);
    assert_eq!(part_1(crabs), 37);
}

#[test]
fn example_part_2() {
    let input = "16,1,2,0,4,2,7,1,2,14";
    let crabs = util::extract_nums::<i64>(&input);
    assert_eq!(part_2(crabs), 168);
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    let input = util::read_input_str(7)?;
    let crabs = util::extract_nums::<i64>(&input);
    println!("{}", util::format(part_1(crabs)));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    let input = util::read_input_str(7)?;
    let crabs = util::extract_nums::<i64>(&input);
    println!("{}", util::format(part_2(crabs)));
    Ok(())
}

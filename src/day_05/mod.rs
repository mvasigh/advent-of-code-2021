use crate::util::{self, format};
use std::collections::HashMap;
use std::fs::File;
use std::io::{self, BufRead};

fn parse_input(input: String) -> Vec<[f32; 4]> {
    input
        .split("\n")
        .map(|v| {
            let nums = util::extract_nums::<f32>(v);
            [nums[0], nums[1], nums[2], nums[3]]
        })
        .collect()
}

fn overlaps(lines: Vec<[f32; 4]>, diagonal: bool) -> i32 {
    let mut pts = HashMap::new();

    for line in lines {
        let [x1, y1, x2, y2] = line;

        if !diagonal && y2 != y1 && x2 != x1 {
            continue;
        }

        let dx = x2 - x1;
        let dy = y2 - y1;
        let end = f32::max(dx.abs(), dy.abs());
        let mut i = 0.0;
        
        while i < end + 1.0 {
            let x = x1 + ((i / end) * dx).round();
            let y = y1 + ((i / end) * dy).round();
            *pts.entry(format!("{},{}", x, y)).or_insert(0) += 1;
            i += 1.0;
        }
    }

    pts.into_iter()
        .filter(|(_, v)| *v > 1)
        .fold(0, |sum, _| sum + 1) as i32
}

fn part_1(lines: Vec<[f32; 4]>) -> i32 {
    overlaps(lines, false)
}

fn part_2(lines: Vec<[f32; 4]>) -> i32 {
    overlaps(lines, true)
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    let input = util::read_input_str(5)?;
    let lines = parse_input(input);
    println!("{}", util::format(part_1(lines)));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    let input = util::read_input_str(5)?;
    let lines = parse_input(input);
    println!("{}", util::format(part_2(lines)));
    Ok(())
}

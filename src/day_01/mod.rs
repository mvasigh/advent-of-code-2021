extern crate colorful;

use colorful::core::color_string::CString;
use colorful::Color;
use colorful::Colorful;
use std::fs::File;
use std::io::{self, BufRead};

fn format(val: i32) -> CString {
    format!(" {} ", val).color(Color::Black).bg_green()
}

fn read_input() -> io::Result<io::BufReader<File>> {
    let file = File::open("./src/day_01/input.txt")?;
    let reader = io::BufReader::new(file);

    Ok(reader)
}

fn part_1() -> io::Result<i32> {
    let reader = read_input()?;
    let mut prev = i32::MAX;
    let mut increases = 0;

    for line in reader.lines() {
        let val = line?.parse::<i32>().unwrap();

        if val > prev {
            increases += 1;
        }

        prev = val;
    }

    Ok(increases)
}

fn part_2() -> io::Result<i32> {
    let reader = read_input()?;
    let mut window = Vec::new();
    let mut increases = 0;

    for (i, line) in reader.lines().enumerate() {
        let val = line?.parse::<i32>().unwrap();

        if i < 3 {
            window.push(val);
            continue;
        }

        let mut new_window = window[1..].to_vec();
        new_window.push(val);

        if new_window.iter().sum::<i32>() > window.iter().sum::<i32>() {
            increases += 1;
        }

        window = new_window;
    }

    Ok(increases)
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    println!("Day 1, Part 1: {}", format(part_1()?));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    println!("Day 1, Part 2: {}", format(part_2()?));
    Ok(())
}

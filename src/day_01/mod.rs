use crate::util;
use std::fs::File;
use std::io::{self, BufRead};

fn read_input() -> io::Result<io::BufReader<File>> {
    let file = File::open("./src/day_01/input.txt")?;
    let reader = io::BufReader::new(file);

    Ok(reader)
}

fn part_1(reader: io::BufReader<File>) -> io::Result<i32> {
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

fn part_2(reader: io::BufReader<File>) -> io::Result<i32> {
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
    let input = read_input()?;
    println!("Day 1, Part 1: {}", util::format(part_1(input)?));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    let input = read_input()?;
    println!("Day 1, Part 2: {}", util::format(part_2(input)?));
    Ok(())
}

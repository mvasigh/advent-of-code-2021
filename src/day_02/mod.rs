use crate::util;
use regex::Regex;
use std::fs::File;
use std::io::{self, BufRead};

struct Instruction {
    command: String,
    val: i32,
}

fn read_input() -> io::Result<Vec<Instruction>> {
    let command_re = Regex::new(r"(?P<command>\w+) (?P<val>\d+)").unwrap();
    let file = File::open("./src/day_02/input.txt")?;
    let lines = io::BufReader::new(file)
        .lines()
        .map(|l| {
            let line = l.unwrap();
            let caps = command_re.captures(&line).unwrap();
            Instruction {
                command: caps.name("command").unwrap().as_str().to_string(),
                val: caps.name("val").unwrap().as_str().parse::<i32>().unwrap(),
            }
        })
        .collect();

    Ok(lines)
}

fn part_1() -> io::Result<i32> {
    let input = read_input()?;
    let mut pos = 0;
    let mut depth = 0;

    for ins in input {
        match ins.command.as_str() {
            "forward" => pos += ins.val,
            "up" => depth -= ins.val,
            "down" => depth += ins.val,
            _ => {}
        }
    }

    Ok(pos * depth)
}

fn part_2() -> io::Result<i32> {
    let input = read_input()?;
    let mut pos = 0;
    let mut depth = 0;
    let mut aim = 0;

    for ins in input {
        match ins.command.as_str() {
            "forward" => {
                pos += ins.val;
                depth += aim * ins.val;
            }
            "up" => aim -= ins.val,
            "down" => aim += ins.val,
            _ => {}
        }
    }

    Ok(pos * depth)
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    println!("Day 2, Part 1: {}", util::format(part_1()?));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    println!("Day 2, Part 2: {}", util::format(part_2()?));
    Ok(())
}

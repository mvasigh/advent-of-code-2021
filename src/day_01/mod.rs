use std::fs::File;
use std::io::{self, BufRead};

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
        let val = line?
            .parse::<i32>()
            .expect("Could not parse line as string");

        if val > prev {
            increases += 1;
        }

        prev = val;
    }

    Ok(increases)
}

// fn part_2() {
//     panic!();
// }

#[test]
fn test_part_1() -> std::io::Result<()> {
    println!("Day 1, Part 1: {}", part_1()?);
    Ok(())
}

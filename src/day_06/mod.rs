use crate::util::{self, format, extract_nums};
use std::collections::HashMap;
use std::fs::File;
use std::io::{self, BufRead};

fn model_fish(mut fish: i64, mut days: i64, cache: &mut HashMap<String, i64>) -> i64 {
    let mut sum = 1;
    let key = format!("{},{}", fish, days);
    if days <= 0 { return sum; }
    if cache.contains_key(&key) { return *cache.get(&key).unwrap(); }

    while days > fish {
        days -= fish + 1;
        fish = 6;
        sum += model_fish(8, days.to_owned(), cache);
    }

    cache.insert(key, sum);

    sum
}

fn model_fish_list(fish: Vec<i64>, days: i64) -> i64 {
    let mut cache = HashMap::new();
    fish.iter().fold(0, |sum, f| sum + model_fish(*f, days, &mut cache))
}

fn part_1(fish: Vec<i64>) -> i64 {
    model_fish_list(fish, 80)
}

fn part_2(fish: Vec<i64>) -> i64 {
    model_fish_list(fish, 256)
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    let input = util::read_input_str(6)?;
    let fish = util::extract_nums::<i64>(&input);
    println!("{}", util::format(part_1(fish)));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    let input = util::read_input_str(6)?;
    let fish = util::extract_nums::<i64>(&input);
    println!("{}", util::format(part_2(fish)));
    Ok(())
}

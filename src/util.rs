extern crate colorful;

use colorful::core::color_string::CString;
use colorful::Color;
use colorful::Colorful;
use regex::Regex;
use std::fs;
use std::io;

pub fn read_input(day: i32) -> io::Result<io::BufReader<fs::File>> {
    let file = fs::File::open(format!("./src/day_{:02}/input.txt", day))?;
    let reader = io::BufReader::new(file);

    Ok(reader)
}

pub fn read_input_str(day: i32) -> io::Result<String> {
    let string = fs::read_to_string(format!("./src/day_{:02}/input.txt", day))?;

    Ok(string)
}

pub fn extract_nums<T>(text: &str) -> Vec<T>
where
    T: std::str::FromStr,
{
    lazy_static! {
        static ref NUMBERS_RE: Regex = Regex::new(r"\d+").unwrap();
    }

    NUMBERS_RE
        .find_iter(text)
        .filter_map(|m| m.as_str().parse().ok())
        .collect()
}

pub fn format<T>(val: T) -> CString
where
    T: std::fmt::Display,
{
    format!(" {} ", val).color(Color::Black).bg_green()
}

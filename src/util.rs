extern crate colorful;

use colorful::core::color_string::CString;
use colorful::Color;
use colorful::Colorful;
use regex::Regex;

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

pub fn format(val: i32) -> CString {
    format!(" {} ", val).color(Color::Black).bg_green()
}

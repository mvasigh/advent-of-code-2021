extern crate colorful;

use colorful::core::color_string::CString;
use colorful::Color;
use colorful::Colorful;

pub fn format(val: i32) -> CString {
    format!(" {} ", val).color(Color::Black).bg_green()
}

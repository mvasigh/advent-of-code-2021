use regex::Regex;

use crate::util;
use std::collections::HashMap;
use std::collections::VecDeque;
use std::fs::read_to_string;
use std::fs::File;
use std::io::{self, BufRead};

#[derive(Debug, Clone)]
struct Board {
    squares: Vec<Square>,
    indices: HashMap<i32, usize>,
    winner: bool,
}

impl Board {
    pub fn from_squares(squares: Vec<Square>) -> Board {
        let mut indices = HashMap::new();

        for (i, sq) in squares.iter().enumerate() {
            indices.insert(sq.val, i);
        }

        Board {
            squares,
            indices,
            winner: false,
        }
    }

    pub fn square_at(&self, r: usize, c: usize) -> Option<&Square> {
        let i = (r * 5) + c;
        if i > 24 {
            return None;
        };
        Some(&self.squares[i])
    }

    pub fn put(&mut self, num: i32) {
        let index = self.indices.get(&num);

        if index.is_some() {
            let sq = &mut self.squares[*index.unwrap()];
            sq.mark();
        }
    }

    pub fn unmarked_sum(&self) -> i32 {
        self.squares
            .iter()
            .fold(0, |sum, sq| if !sq.marked { sum + sq.val } else { sum })
    }

    pub fn is_winner(&mut self) -> bool {
        'rows: for r in 0..5 {
            if self.winner {
                break;
            }
            for c in 0..5 {
                let sq = self.square_at(r, c).unwrap();
                if !sq.marked {
                    continue 'rows;
                }
            }
            self.winner = true;
        }

        'cols: for c in 0..5 {
            if self.winner {
                break;
            }
            for r in 0..5 {
                let sq = self.square_at(r, c).unwrap();
                if !sq.marked {
                    continue 'cols;
                }
            }
            self.winner = true;
        }

        self.winner
    }
}

#[derive(Debug, Clone)]
struct Square {
    val: i32,
    marked: bool,
}

impl Square {
    pub fn mark(&mut self) {
        self.marked = true;
    }
}

fn read_input() -> io::Result<String> {
    let str = read_to_string("./src/day_04/input.txt")?;
    Ok(str)
}

fn parse_input(input: String) -> (VecDeque<i32>, Vec<Board>) {
    lazy_static! {
        static ref NUMBERS_RE: Regex = Regex::new(r"(\d+,)+\d+\n").unwrap();
        static ref BOARDS_RE: Regex = Regex::new(r"([\d ]+\n?){5}").unwrap();
    }

    let numbers = util::extract_nums::<i32>(NUMBERS_RE.find(&input).unwrap().as_str())
        .into_iter()
        .collect::<VecDeque<i32>>();
    let boards = BOARDS_RE
        .find_iter(&input)
        .map(|c| {
            Board::from_squares(
                util::extract_nums::<i32>(c.as_str())
                    .into_iter()
                    .map(|val| Square { val, marked: false })
                    .collect(),
            )
        })
        .collect();

    (numbers, boards)
}

fn part_1(mut numbers: VecDeque<i32>, mut boards: Vec<Board>) -> i32 {
    while numbers.len() > 0 {
        let number = numbers.pop_front().unwrap();

        for board in boards.iter_mut() {
            board.put(number);

            if board.is_winner() {
                return number * board.unmarked_sum();
            }
        }
    }

    -1
}

fn part_2(mut numbers: VecDeque<i32>, mut boards: Vec<Board>) -> i32 {
    let mut last_winner: Board = Board {
        squares: Vec::new(),
        winner: false,
        indices: HashMap::new(),
    };
    let mut last_num = 0;

    while numbers.len() > 0 {
        let num = numbers.pop_front().unwrap();
        for board in boards.iter_mut() {
            if board.winner {
                continue;
            }
            board.put(num);
            if board.is_winner() {
                last_num = num;
                last_winner = board.to_owned();
            }
        }
    }

    last_winner.unmarked_sum() * last_num
}

#[test]
fn example_1() {
    let input = "7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

    22 13 17 11  0
     8  2 23  4 24
    21  9 14 16  7
     6 10  3 18  5
     1 12 20 15 19

     3 15  0  2 22
     9 18 13 17  5
    19  8  7 25 23
    20 11 10 24  4
    14 21 16 12  6

    14 21 17 24  4
    10 16 15  9 19
    18  8 23 26 20
    22 11 13  6  5
     2  0 12  3  7";

    let (numbers, boards) = parse_input(input.to_string());
    assert_eq!(part_1(numbers, boards), 4512);
}

#[test]
fn example_2() {
    let input = "7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

    22 13 17 11  0
     8  2 23  4 24
    21  9 14 16  7
     6 10  3 18  5
     1 12 20 15 19

     3 15  0  2 22
     9 18 13 17  5
    19  8  7 25 23
    20 11 10 24  4
    14 21 16 12  6

    14 21 17 24  4
    10 16 15  9 19
    18  8 23 26 20
    22 11 13  6  5
     2  0 12  3  7";

    let (numbers, boards) = parse_input(input.to_string());
    assert_eq!(part_2(numbers, boards), 1924);
}

#[test]
fn test_part_1() -> std::io::Result<()> {
    let input_str = read_input()?;
    let (numbers, boards) = parse_input(input_str);
    println!("Day 4, Part 1: {}", util::format(part_1(numbers, boards)));
    Ok(())
}

#[test]
fn test_part_2() -> std::io::Result<()> {
    let input_str = read_input()?;
    let (numbers, boards) = parse_input(input_str);
    println!("Day 4, Part 2: {}", util::format(part_2(numbers, boards)));
    Ok(())
}

#!/bin/sh
BLACK=`tput setaf 0`
RED=`tput setaf 1`
BLUE=`tput setaf 5`
WHITE_BG=`tput setab 7`
RED_BG=`tput setab 1`
BLUE_BG=`tput setab 4`
BOLD=`tput bold`
NC=`tput sgr0`
SEPARATOR="+++++++++++++++++++++++++++++++"

day=$1
while ((${#day} < 2)); do 
  day="0$day"
done

echo "\n"

echo "${WHITE}${RED_BG}${BOLD} Rust 🦀 ${NC}"
echo "${SEPARATOR}"

if [ -z "$1" ]; 
then
  cargo test part -- --nocapture --test-threads=1
else
  filter="day_$day::test_part"
  cargo test "$filter" -- --nocapture --test-threads=1
fi

echo "${BLACK}${BLUE_BG}${BOLD} TypeScript 💻 ${NC}"
echo "${SEPARATOR}"

if [ -z "$1" ]; 
then
  deno test -A --filter "/Day \d+, Part \d+/"
else
  dir="./src/day_$day"
  deno test "$dir" -A --filter "/Day $1, Part \d+/"
fi



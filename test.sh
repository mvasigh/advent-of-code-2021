#!/bin/sh
BLACK=`tput setaf 0`
RED=`tput setaf 1`
BLUE=`tput setaf 5`
WHITE_BG=`tput setab 7`
RED_BG=`tput setab 1`
BLUE_BG=`tput setab 4`
BOLD=`tput bold`
NC=`tput sgr0`
SEPARATOR="++++++++++++++++"

echo "\n"

echo "${WHITE}${RED_BG}${BOLD} Rust solutions 🦀 ${NC}"
echo "${SEPARATOR}"
cargo test part -- --nocapture --test-threads=1

echo "\n"

echo "${BLACK}${BLUE_BG}${BOLD} TypeScript solutions 🤓 ${NC}"
echo "${SEPARATOR}"
deno test -A --filter "/Day \d+, Part \d+/"



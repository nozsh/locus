#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-https://nzsh.cc}"; SITE_URL="${SITE_URL%/}"

git submodule update --init --recursive
bash ./cleanup.sh

hugo -b "$SITE_URL/"
(cd blog && hugo -b "$SITE_URL/blog/")

cp __service/404.html public/404.html
cp __service/404.html public/blog/404.html

hugo version

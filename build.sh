#!/usr/bin/env bash
set -euo pipefail

git submodule update --init --recursive

bash ./cleanup.sh

hugo
(cd blog && hugo)

cp __service/404.html public/404.html
cp __service/404.html public/blog/404.html

hugo version

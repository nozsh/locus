#!/usr/bin/env bash
set -euo pipefail

git submodule update --init --recursive

hugo
(cd blog && hugo)

hugo version

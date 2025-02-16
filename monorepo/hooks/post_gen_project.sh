#!/usr/bin/env bash

set -e

go mod init "{{ cookiecutter.repo }}"
go work init
go work use .
git init -b main
git add .
git commit -m "chore: initial commit"

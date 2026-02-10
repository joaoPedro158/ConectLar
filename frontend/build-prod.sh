#!/usr/bin/env bash
set -e

# Caminho base
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONT_DIR="$ROOT_DIR/frontend"
STATIC_DIR="$ROOT_DIR/src/main/resources/static"

cd "$FRONT_DIR"

npm install
npm run build

mkdir -p "$STATIC_DIR"
rm -rf "$STATIC_DIR"/*
cp -r dist/* "$STATIC_DIR"/

echo "Build do React copiado para $STATIC_DIR"
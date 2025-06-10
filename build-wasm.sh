#!/bin/bash
set -e

cd cpp
rm -rf build
mkdir -p build
cd build

build_wasm() {
    mkdir -p ../../public/wasm
    emcmake cmake ..
    make
    echo "Build complete"
}

echo "Building C++ files..."
build_wasm

while true; do
    inotifywait -r -e modify,create,delete . --exclude 'build'
    echo "Rebuilding C++ files..."
    build_wasm
done


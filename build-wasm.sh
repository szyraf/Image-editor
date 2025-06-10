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
    sync
}

echo "Building C++ files..."
build_wasm

while true; do
    while [ ! -f /app/cpp/test.txt ]; do
        sleep 1
    done
    rm /app/cpp/test.txt

    echo "Rebuilding C++ files..."
    build_wasm
done


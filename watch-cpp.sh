#!/bin/bash

source /emsdk/emsdk_env.sh

build_wasm() {
    
    emcc cpp/*.cpp \
        -s WASM=1 \
        --bind \
        -o public/wasm/main.js
    if [ $? -eq 0 ]; then
        echo "Build complete"
        touch public/wasm/main.js
    else
        echo "Build failed!"
    fi
}

echo "Building C++ files..."
build_wasm

while true; do
    inotifywait -r -e modify,create,delete cpp/
    echo "Rebuilding C++ files..."
    build_wasm
done 
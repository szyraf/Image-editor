#!/bin/bash

if ! command -v inotifywait &> /dev/null; then
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y inotify-tools
    elif command -v yum &> /dev/null; then
        sudo yum install -y inotify-tools
    elif command -v pacman &> /dev/null; then
        sudo pacman -S inotify-tools
    elif command -v brew &> /dev/null; then
        brew install inotify-tools
    else
        echo "Could not install inotify-tools. Please install it manually."
        exit 1
    fi
fi


CONTAINER_NAME="image-editor-wasm-1"

while true; do
    echo "Waiting for changes in cpp directory..."
    inotifywait -r -e modify,create,delete cpp/
    echo "Changes detected, copying files to container..."
    docker cp cpp/. $CONTAINER_NAME:/app/cpp
    echo "Files copied successfully"
done 
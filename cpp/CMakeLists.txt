cmake_minimum_required(VERSION 3.10)
project(HelloWasm)

add_executable(hello hello.cpp)

target_link_options(hello PRIVATE
    -sWASM=1
    --bind
    -sMODULARIZE=1
    -sEXPORT_NAME="createHelloModule"
    -sNO_FILESYSTEM=1
    -sINITIAL_MEMORY=16MB
    -sALLOW_MEMORY_GROWTH=1
    -sENVIRONMENT=web
    -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap']
    -sSTRICT=1
    -sEXPORT_ES6=1
    -sSINGLE_FILE=1
    --no-entry
)

set_target_properties(hello PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../public/wasm"
    OUTPUT_NAME "hello"
)
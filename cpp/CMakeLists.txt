cmake_minimum_required(VERSION 3.10)
project(ImageEditorWasm)

add_executable(main main.cpp filters.cpp js.cpp)

target_link_options(main PRIVATE
    -sWASM=1
    --bind
    -sMODULARIZE=1
    -sEXPORT_NAME="createMainModule"
    -sNO_FILESYSTEM=1
    -sINITIAL_MEMORY=32MB
    -sALLOW_MEMORY_GROWTH=1
    -sENVIRONMENT=web
    -sEXPORTED_RUNTIME_METHODS=['ccall','cwrap']
    -sSTRICT=1
    -sEXPORT_ES6=1
    -sSINGLE_FILE=1
    --no-entry
    -O3
)

set_target_properties(main PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../public/wasm"
    OUTPUT_NAME "main"
)
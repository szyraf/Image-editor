#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <string>

std::string greet()
{
    return "Hello from WebAssembly!";
}

// js.cpp
extern std::string processImageWithAllFilters(emscripten::val canvas, float brightness, float contrast, float saturation, bool monochrome, float blur, float sharpen, int pixelate, float gamma);

EMSCRIPTEN_BINDINGS(main_module)
{
    // main.cpp
    emscripten::function("greet", &greet);

    // js.cpp
    emscripten::function("processImageWithAllFilters", &processImageWithAllFilters);
}

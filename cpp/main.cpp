#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <string>

std::string greet()
{
    return "Hello from WebAssembly!";
}

extern emscripten::val adjustBrightness(emscripten::val imageData, int width, int height, float brightnessValue);
extern emscripten::val autoBrightness(emscripten::val imageData, int width, int height);
extern emscripten::val adjustGamma(emscripten::val imageData, int width, int height, float gamma);
extern std::string greet2();

EMSCRIPTEN_BINDINGS(main_module)
{
    emscripten::function("greet", &greet);

    // brightness.cpp
    emscripten::function("adjustBrightness", &adjustBrightness);
    emscripten::function("autoBrightness", &autoBrightness);
    emscripten::function("adjustGamma", &adjustGamma);
    emscripten::function("greet2", &greet2);
}

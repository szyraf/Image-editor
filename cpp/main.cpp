#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <string>

std::string greet()
{
    return "Hello from WebAssembly!";
}

// filters.cpp
extern emscripten::val adjustBrightness(emscripten::val imageData, int width, int height, float brightnessValue);
extern emscripten::val adjustContrast(emscripten::val imageData, int width, int height, float contrastValue);
extern emscripten::val adjustSaturation(emscripten::val imageData, int width, int height, float saturationValue);
extern emscripten::val convertToMonochrome(emscripten::val imageData, int width, int height);
extern emscripten::val applyBlur(emscripten::val imageData, int width, int height, float blurRadius);
extern emscripten::val applySharpen(emscripten::val imageData, int width, int height, float sharpenAmount);
extern emscripten::val applyPixelate(emscripten::val imageData, int width, int height, int pixelSize);
extern emscripten::val autoBrightness(emscripten::val imageData, int width, int height);
extern emscripten::val adjustGamma(emscripten::val imageData, int width, int height, float gamma);

// js.cpp
extern emscripten::val processImageData(emscripten::val imageData, float brightnessValue);
extern std::string processImageWithAllFilters(emscripten::val canvas, float brightness, float contrast, float saturation, bool monochrome, float blur, float sharpen, int pixelate);
extern std::string processCanvasImage(emscripten::val canvas, float brightnessValue);

EMSCRIPTEN_BINDINGS(main_module)
{
    // main.cpp
    emscripten::function("greet", &greet);

    // filters.cpp
    emscripten::function("adjustBrightness", &adjustBrightness);
    emscripten::function("adjustContrast", &adjustContrast);
    emscripten::function("adjustSaturation", &adjustSaturation);
    emscripten::function("convertToMonochrome", &convertToMonochrome);
    emscripten::function("applyBlur", &applyBlur);
    emscripten::function("applySharpen", &applySharpen);
    emscripten::function("applyPixelate", &applyPixelate);
    emscripten::function("autoBrightness", &autoBrightness);
    emscripten::function("adjustGamma", &adjustGamma);

    // js.cpp
    emscripten::function("processImageData", &processImageData);
    emscripten::function("processImageWithAllFilters", &processImageWithAllFilters);
    emscripten::function("processCanvasImage", &processCanvasImage);
}

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <string>

std::string greet()
{
    return "Hello from WebAssembly!";
}

// js.cpp
extern std::string processImageWithAllFilters(emscripten::val canvas, float brightness, float contrast, float saturation, bool monochrome, float blur, float sharpen, int pixelate, float gamma);
extern std::string downloadAsPNG(emscripten::val canvas, const std::string &filename);
extern std::string downloadAsJPEG(emscripten::val canvas, const std::string &filename, int quality);
extern std::string downloadAsWebP(emscripten::val canvas, const std::string &filename, int quality);
extern std::string getPreviewDataUrl(emscripten::val canvas, const std::string &format, int quality);

EMSCRIPTEN_BINDINGS(main_module)
{
    // main.cpp
    emscripten::function("greet", &greet);

    // js.cpp
    emscripten::function("processImageWithAllFilters", &processImageWithAllFilters);
    emscripten::function("downloadAsPNG", &downloadAsPNG);
    emscripten::function("downloadAsJPEG", &downloadAsJPEG);
    emscripten::function("downloadAsWebP", &downloadAsWebP);
    emscripten::function("getPreviewDataUrl", &getPreviewDataUrl);
}

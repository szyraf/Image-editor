#include <emscripten/bind.h>
#include <string>

std::string greet()
{
    return "Hello from WebAssembly!";
}

EMSCRIPTEN_BINDINGS(my_module)
{
    emscripten::function("greet", &greet);
}
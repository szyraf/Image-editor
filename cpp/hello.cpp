#include <string>
#include <emscripten/bind.h>

using namespace emscripten;

std::string hello()
{
    return "hello world";
}

EMSCRIPTEN_BINDINGS(hello_module)
{
    function("hello", &hello);
}

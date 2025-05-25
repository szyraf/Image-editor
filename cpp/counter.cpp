#include <emscripten/bind.h>

using namespace emscripten;

int counter = 0;

int increment_counter()
{
    counter++;
    return counter;
}

EMSCRIPTEN_BINDINGS(counter_module)
{
    function("increment_counter", &increment_counter);
}
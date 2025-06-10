#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <algorithm>
#include <cmath>

/**
 * @brief Adjusts the brightness of an image by modifying RGB values
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param brightnessValue Brightness adjustment value (-100 to 100)
 * @return Modified imageData with adjusted brightness
 */
emscripten::val adjustBrightness(emscripten::val imageData, int width, int height, float brightnessValue)
{
    float brightnessAdjustment = (brightnessValue / 100.0f) * 255.0f;

    int length = width * height * 4;

    std::vector<uint8_t> modifiedData(length);

    for (int i = 0; i < length; i += 4)
    {
        float r = imageData[i].as<float>();
        float g = imageData[i + 1].as<float>();
        float b = imageData[i + 2].as<float>();
        float a = imageData[i + 3].as<float>();

        r += brightnessAdjustment;
        g += brightnessAdjustment;
        b += brightnessAdjustment;

        modifiedData[i] = static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, r)));
        modifiedData[i + 1] = static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, g)));
        modifiedData[i + 2] = static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, b)));
        modifiedData[i + 3] = static_cast<uint8_t>(a);
    }

    emscripten::val result = emscripten::val::array();
    for (int i = 0; i < length; ++i)
    {
        result.call<void>("push", modifiedData[i]);
    }

    return result;
}

/**
 * @brief Applies auto-brightness correction based on histogram analysis
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @return Modified imageData with auto-corrected brightness
 */
emscripten::val autoBrightness(emscripten::val imageData, int width, int height)
{
    int length = width * height * 4;
    std::vector<int> histogram(256, 0);

    for (int i = 0; i < length; i += 4)
    {
        float r = imageData[i].as<float>();
        float g = imageData[i + 1].as<float>();
        float b = imageData[i + 2].as<float>();

        int luminance = static_cast<int>(0.299f * r + 0.587f * g + 0.114f * b);
        histogram[luminance]++;
    }

    int totalPixels = width * height;
    int medianTarget = totalPixels / 2;
    int currentSum = 0;
    int medianBrightness = 128;

    for (int i = 0; i < 256; ++i)
    {
        currentSum += histogram[i];
        if (currentSum >= medianTarget)
        {
            medianBrightness = i;
            break;
        }
    }

    float adjustment = 128.0f - medianBrightness;

    return adjustBrightness(imageData, width, height, (adjustment / 255.0f) * 100.0f);
}

/**
 * @brief Applies gamma correction to adjust mid-tone brightness
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param gamma Gamma value (0.1 to 3.0, where 1.0 is no change)
 * @return Modified imageData with gamma correction applied
 */
emscripten::val adjustGamma(emscripten::val imageData, int width, int height, float gamma)
{
    int length = width * height * 4;
    std::vector<uint8_t> modifiedData(length);

    std::vector<uint8_t> gammaTable(256);
    for (int i = 0; i < 256; ++i)
    {
        float normalized = i / 255.0f;
        float corrected = std::pow(normalized, 1.0f / gamma);
        gammaTable[i] = static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, corrected * 255.0f)));
    }

    for (int i = 0; i < length; i += 4)
    {
        uint8_t r = static_cast<uint8_t>(imageData[i].as<int>());
        uint8_t g = static_cast<uint8_t>(imageData[i + 1].as<int>());
        uint8_t b = static_cast<uint8_t>(imageData[i + 2].as<int>());
        uint8_t a = static_cast<uint8_t>(imageData[i + 3].as<int>());

        modifiedData[i] = gammaTable[r];
        modifiedData[i + 1] = gammaTable[g];
        modifiedData[i + 2] = gammaTable[b];
        modifiedData[i + 3] = a;
    }

    emscripten::val result = emscripten::val::array();
    for (int i = 0; i < length; ++i)
    {
        result.call<void>("push", modifiedData[i]);
    }

    return result;
}

std::string greet2()
{
    return "Hello from WebAssembly 2!";
}

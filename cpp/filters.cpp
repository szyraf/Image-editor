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
 * @brief Adjusts the contrast of an image
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param contrastValue Contrast adjustment value (0 to 200, where 100 is normal)
 * @return Modified imageData with adjusted contrast
 */
emscripten::val adjustContrast(emscripten::val imageData, int width, int height, float contrastValue)
{
  float contrast = contrastValue / 100.0f;
  float factor = (259.0f * (contrast * 255.0f + 255.0f)) / (255.0f * (259.0f - contrast * 255.0f));

  int length = width * height * 4;
  std::vector<uint8_t> modifiedData(length);

  for (int i = 0; i < length; i += 4)
  {
    float r = imageData[i].as<float>();
    float g = imageData[i + 1].as<float>();
    float b = imageData[i + 2].as<float>();
    float a = imageData[i + 3].as<float>();

    r = factor * (r - 128.0f) + 128.0f;
    g = factor * (g - 128.0f) + 128.0f;
    b = factor * (b - 128.0f) + 128.0f;

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
 * @brief Adjusts the saturation of an image
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param saturationValue Saturation adjustment value (0 to 200, where 100 is normal)
 * @return Modified imageData with adjusted saturation
 */
emscripten::val adjustSaturation(emscripten::val imageData, int width, int height, float saturationValue)
{
  float saturation = saturationValue / 100.0f;

  int length = width * height * 4;
  std::vector<uint8_t> modifiedData(length);

  for (int i = 0; i < length; i += 4)
  {
    float r = imageData[i].as<float>();
    float g = imageData[i + 1].as<float>();
    float b = imageData[i + 2].as<float>();
    float a = imageData[i + 3].as<float>();

    float gray = 0.299f * r + 0.587f * g + 0.114f * b;

    r = gray + saturation * (r - gray);
    g = gray + saturation * (g - gray);
    b = gray + saturation * (b - gray);

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
 * @brief Converts an image to monochrome
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @return Modified imageData converted to monochrome
 */
emscripten::val convertToMonochrome(emscripten::val imageData, int width, int height)
{
  int length = width * height * 4;
  std::vector<uint8_t> modifiedData(length);

  for (int i = 0; i < length; i += 4)
  {
    float r = imageData[i].as<float>();
    float g = imageData[i + 1].as<float>();
    float b = imageData[i + 2].as<float>();
    float a = imageData[i + 3].as<float>();

    uint8_t gray = static_cast<uint8_t>(0.299f * r + 0.587f * g + 0.114f * b);

    modifiedData[i] = gray;
    modifiedData[i + 1] = gray;
    modifiedData[i + 2] = gray;
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
 * @brief Applies blur effect to an image
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param blurRadius Blur radius in pixels
 * @return Modified imageData with blur applied
 */
emscripten::val applyBlur(emscripten::val imageData, int width, int height, float blurRadius)
{
  if (blurRadius <= 0)
  {
    return imageData;
  }

  int length = width * height * 4;
  std::vector<uint8_t> modifiedData(length);

  int radius = static_cast<int>(std::ceil(blurRadius));

  for (int y = 0; y < height; ++y)
  {
    for (int x = 0; x < width; ++x)
    {
      float totalR = 0, totalG = 0, totalB = 0, totalA = 0;
      int count = 0;

      for (int dy = -radius; dy <= radius; ++dy)
      {
        for (int dx = -radius; dx <= radius; ++dx)
        {
          int nx = x + dx;
          int ny = y + dy;

          if (nx >= 0 && nx < width && ny >= 0 && ny < height)
          {
            int index = (ny * width + nx) * 4;
            totalR += imageData[index].as<float>();
            totalG += imageData[index + 1].as<float>();
            totalB += imageData[index + 2].as<float>();
            totalA += imageData[index + 3].as<float>();
            count++;
          }
        }
      }

      int index = (y * width + x) * 4;
      modifiedData[index] = static_cast<uint8_t>(totalR / count);
      modifiedData[index + 1] = static_cast<uint8_t>(totalG / count);
      modifiedData[index + 2] = static_cast<uint8_t>(totalB / count);
      modifiedData[index + 3] = static_cast<uint8_t>(totalA / count);
    }
  }

  emscripten::val result = emscripten::val::array();
  for (int i = 0; i < length; ++i)
  {
    result.call<void>("push", modifiedData[i]);
  }

  return result;
}

/**
 * @brief Applies sharpen effect to an image
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param sharpenAmount Sharpen amount (0 to 5)
 * @return Modified imageData with sharpen applied
 */
emscripten::val applySharpen(emscripten::val imageData, int width, int height, float sharpenAmount)
{
  if (sharpenAmount <= 0)
  {
    return imageData;
  }

  int length = width * height * 4;
  std::vector<uint8_t> modifiedData(length);

  float kernel[9] = {
      0, -sharpenAmount, 0,
      -sharpenAmount, 1 + 4 * sharpenAmount, -sharpenAmount,
      0, -sharpenAmount, 0};

  for (int y = 1; y < height - 1; ++y)
  {
    for (int x = 1; x < width - 1; ++x)
    {
      float r = 0, g = 0, b = 0;

      for (int ky = -1; ky <= 1; ++ky)
      {
        for (int kx = -1; kx <= 1; ++kx)
        {
          int index = ((y + ky) * width + (x + kx)) * 4;
          int kernelIndex = (ky + 1) * 3 + (kx + 1);

          r += imageData[index].as<float>() * kernel[kernelIndex];
          g += imageData[index + 1].as<float>() * kernel[kernelIndex];
          b += imageData[index + 2].as<float>() * kernel[kernelIndex];
        }
      }

      int index = (y * width + x) * 4;
      modifiedData[index] = static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, r)));
      modifiedData[index + 1] = static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, g)));
      modifiedData[index + 2] = static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, b)));
      modifiedData[index + 3] = imageData[index + 3].as<uint8_t>();
    }
  }

  for (int i = 0; i < length; i += 4)
  {
    if (modifiedData[i] == 0 && modifiedData[i + 1] == 0 && modifiedData[i + 2] == 0)
    {
      modifiedData[i] = imageData[i].as<uint8_t>();
      modifiedData[i + 1] = imageData[i + 1].as<uint8_t>();
      modifiedData[i + 2] = imageData[i + 2].as<uint8_t>();
    }
  }

  emscripten::val result = emscripten::val::array();
  for (int i = 0; i < length; ++i)
  {
    result.call<void>("push", modifiedData[i]);
  }

  return result;
}

/**
 * @brief Applies pixelate effect to an image
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param pixelSize Size of each pixel block
 * @return Modified imageData with pixelate applied
 */
emscripten::val applyPixelate(emscripten::val imageData, int width, int height, int pixelSize)
{
  if (pixelSize <= 1)
  {
    return imageData;
  }

  int length = width * height * 4;
  std::vector<uint8_t> modifiedData(length);

  for (int y = 0; y < height; y += pixelSize)
  {
    for (int x = 0; x < width; x += pixelSize)
    {
      float avgR = 0, avgG = 0, avgB = 0, avgA = 0;
      int count = 0;

      for (int py = y; py < std::min(y + pixelSize, height); ++py)
      {
        for (int px = x; px < std::min(x + pixelSize, width); ++px)
        {
          int index = (py * width + px) * 4;
          avgR += imageData[index].as<float>();
          avgG += imageData[index + 1].as<float>();
          avgB += imageData[index + 2].as<float>();
          avgA += imageData[index + 3].as<float>();
          count++;
        }
      }

      avgR /= count;
      avgG /= count;
      avgB /= count;
      avgA /= count;

      for (int py = y; py < std::min(y + pixelSize, height); ++py)
      {
        for (int px = x; px < std::min(x + pixelSize, width); ++px)
        {
          int index = (py * width + px) * 4;
          modifiedData[index] = static_cast<uint8_t>(avgR);
          modifiedData[index + 1] = static_cast<uint8_t>(avgG);
          modifiedData[index + 2] = static_cast<uint8_t>(avgB);
          modifiedData[index + 3] = static_cast<uint8_t>(avgA);
        }
      }
    }
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

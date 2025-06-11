#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <algorithm>
#include <cmath>

/**
 * @brief Applies Gaussian blur using separable 2-pass convolution
 *
 * Uses separable Gaussian kernel: horizontal pass then vertical pass.
 * Gaussian weight: w(x) = e^(-x²/2σ²) where σ = blurRadius/3
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param blurRadius Blur radius in pixels (0-50 typical, ≤0 returns original)
 * @return Modified imageData with Gaussian blur applied
 */
emscripten::val applyBlur(emscripten::val imageData, int width, int height, float blurRadius)
{
  if (blurRadius <= 0)
  {
    return imageData;
  }

  int length = width * height * 4;
  int radius = static_cast<int>(std::ceil(blurRadius));
  float sigma = blurRadius / 3.0f;

  std::vector<uint8_t> inputData(length);
  for (int i = 0; i < length; ++i)
  {
    inputData[i] = imageData[i].as<uint8_t>();
  }

  std::vector<float> gaussianKernel(2 * radius + 1);
  float kernelSum = 0.0f;

  for (int i = -radius; i <= radius; ++i)
  {
    float weight = std::exp(-(i * i) / (2.0f * sigma * sigma));
    gaussianKernel[i + radius] = weight;
    kernelSum += weight;
  }

  for (int i = 0; i < gaussianKernel.size(); ++i)
  {
    gaussianKernel[i] /= kernelSum;
  }

  std::vector<uint8_t> tempData(length);
  std::vector<uint8_t> outputData(length);

  for (int y = 0; y < height; ++y)
  {
    for (int x = 0; x < width; ++x)
    {
      float totalR = 0.0f, totalG = 0.0f, totalB = 0.0f, totalA = 0.0f;

      for (int i = -radius; i <= radius; ++i)
      {
        int sx = std::max(0, std::min(width - 1, x + i));
        int index = (y * width + sx) * 4;
        float weight = gaussianKernel[i + radius];

        totalR += inputData[index] * weight;
        totalG += inputData[index + 1] * weight;
        totalB += inputData[index + 2] * weight;
        totalA += inputData[index + 3] * weight;
      }

      int index = (y * width + x) * 4;
      tempData[index] = static_cast<uint8_t>(std::round(totalR));
      tempData[index + 1] = static_cast<uint8_t>(std::round(totalG));
      tempData[index + 2] = static_cast<uint8_t>(std::round(totalB));
      tempData[index + 3] = static_cast<uint8_t>(std::round(totalA));
    }
  }

  for (int x = 0; x < width; ++x)
  {
    for (int y = 0; y < height; ++y)
    {
      float totalR = 0.0f, totalG = 0.0f, totalB = 0.0f, totalA = 0.0f;

      for (int i = -radius; i <= radius; ++i)
      {
        int sy = std::max(0, std::min(height - 1, y + i));
        int index = (sy * width + x) * 4;
        float weight = gaussianKernel[i + radius];

        totalR += tempData[index] * weight;
        totalG += tempData[index + 1] * weight;
        totalB += tempData[index + 2] * weight;
        totalA += tempData[index + 3] * weight;
      }

      int index = (y * width + x) * 4;
      outputData[index] = static_cast<uint8_t>(std::round(totalR));
      outputData[index + 1] = static_cast<uint8_t>(std::round(totalG));
      outputData[index + 2] = static_cast<uint8_t>(std::round(totalB));
      outputData[index + 3] = static_cast<uint8_t>(std::round(totalA));
    }
  }

  emscripten::val result = emscripten::val::array();
  for (int i = 0; i < length; ++i)
  {
    result.call<void>("push", outputData[i]);
  }

  return result;
}

/**
 * @brief Applies unsharp masking using 3x3 convolution kernel
 *
 * Kernel: [0 -k 0; -k 1+4k -k; 0 -k 0] where k = sharpenAmount
 * Only processes interior pixels, edge pixels retain original values.
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param sharpenAmount Sharpening intensity (0-5 range, ≤0 returns original)
 * @return Modified imageData with sharpening applied
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
 * @brief Creates blocky pixelated effect by averaging pixel blocks
 *
 * Divides image into pixelSize×pixelSize blocks, replaces each block
 * with average color of all pixels in that block.
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param pixelSize Size of each square block (1-200 range, ≤1 returns original)
 * @return Modified imageData with pixelate effect applied
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
 * @brief Converts image to grayscale using luminance weighting
 *
 * Uses ITU-R BT.601 formula: Y = 0.299×R + 0.587×G + 0.114×B
 * Weights account for human eye sensitivity to different colors.
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @return Modified imageData converted to monochrome, alpha preserved
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
 * @brief Adjusts brightness by adding constant value to RGB channels
 *
 * Linear adjustment: new_channel = clamp(original + adjustment, 0, 255)
 * where adjustment = (brightnessValue / 100) × 255
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param brightnessValue Brightness percentage (-100 to +100, 0 = no change)
 * @return Modified imageData with adjusted brightness, alpha preserved
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
 * @brief Adjusts contrast using midpoint-anchored scaling around gray 128
 *
 * factor = (259 × (contrast×255 + 255)) / (255 × (259 - contrast×255))
 * new_channel = clamp(factor × (original - 128) + 128, 0, 255)
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param contrastValue Contrast percentage (0-200 range, 100 = no change)
 * @return Modified imageData with adjusted contrast, alpha preserved
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
 * @brief Adjusts saturation by interpolating between original and grayscale
 *
 * grayscale = 0.299×R + 0.587×G + 0.114×B
 * new_channel = clamp(grayscale + saturation × (original - grayscale), 0, 255)
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param saturationValue Saturation percentage (0-200 range, 100 = no change)
 * @return Modified imageData with adjusted saturation, alpha preserved
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
 * @brief Applies gamma correction using power-law transformation with lookup table
 *
 * Pre-computes lookup table: output = 255 × (input/255)^(1/gamma)
 * Gamma < 1.0 brightens mid-tones, gamma > 1.0 darkens mid-tones.
 *
 * @param imageData Uint8ClampedArray containing RGBA pixel data
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param gamma Gamma value (0.1-3.0 range, 1.0 = no change)
 * @return Modified imageData with gamma correction applied, alpha preserved
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

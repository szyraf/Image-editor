#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <string>

extern emscripten::val adjustBrightness(emscripten::val imageData, int width, int height, float brightnessValue);
extern emscripten::val adjustContrast(emscripten::val imageData, int width, int height, float contrastValue);
extern emscripten::val adjustSaturation(emscripten::val imageData, int width, int height, float saturationValue);
extern emscripten::val convertToMonochrome(emscripten::val imageData, int width, int height);
extern emscripten::val applyBlur(emscripten::val imageData, int width, int height, float blurRadius);
extern emscripten::val applySharpen(emscripten::val imageData, int width, int height, float sharpenAmount);
extern emscripten::val applyPixelate(emscripten::val imageData, int width, int height, int pixelSize);
extern emscripten::val adjustGamma(emscripten::val imageData, int width, int height, float gamma);

/**
 * @brief Processes image with all filters and adjustments from canvas
 * @param canvas HTML Canvas element
 * @param brightness Brightness adjustment (-100 to 100)
 * @param contrast Contrast adjustment (0 to 200)
 * @param saturation Saturation adjustment (0 to 200)
 * @param monochrome Whether to convert to monochrome
 * @param blur Gaussian blur radius (0 to 100)
 * @param sharpen Sharpen amount (0 to 5)
 * @param pixelate Pixelate size (0 to 100)
 * @param gamma Gamma correction value (50 to 200, where 100 is no change)
 * @return Processed image as data URL string
 */
std::string processImageWithAllFilters(emscripten::val canvas, float brightness, float contrast, float saturation, bool monochrome, float blur, float sharpen, int pixelate, float gamma)
{
  bool hasChanges = (brightness != 100.0f || contrast != 100.0f || saturation != 100.0f || monochrome || blur > 0 || sharpen > 0 || pixelate > 0 || gamma != 100.0f);

  if (!hasChanges)
  {
    return canvas.call<std::string>("toDataURL", std::string("image/png"));
  }

  emscripten::val ctx = canvas.call<emscripten::val>("getContext", std::string("2d"));
  int width = canvas["width"].as<int>();
  int height = canvas["height"].as<int>();

  emscripten::val imageData = ctx.call<emscripten::val>("getImageData", 0, 0, width, height);
  emscripten::val currentData = imageData["data"];

  if (blur > 0)
  {
    currentData = applyBlur(currentData, width, height, blur);
  }

  if (sharpen > 0)
  {
    currentData = applySharpen(currentData, width, height, sharpen);
  }

  if (pixelate > 0)
  {
    currentData = applyPixelate(currentData, width, height, pixelate);
  }

  if (monochrome)
  {
    currentData = convertToMonochrome(currentData, width, height);
  }

  if (brightness != 100.0f)
  {
    currentData = adjustBrightness(currentData, width, height, brightness - 100.0f);
  }

  if (contrast != 100.0f)
  {
    currentData = adjustContrast(currentData, width, height, contrast);
  }

  if (saturation != 100.0f)
  {
    currentData = adjustSaturation(currentData, width, height, saturation);
  }

  if (gamma != 100.0f)
  {
    float gammaValue = gamma / 100.0f;
    currentData = adjustGamma(currentData, width, height, gammaValue);
  }

  emscripten::val ImageDataConstructor = emscripten::val::global("ImageData");
  emscripten::val uint8Array = emscripten::val::global("Uint8ClampedArray").new_(currentData);
  emscripten::val processedImageData = ImageDataConstructor.new_(uint8Array, width, height);

  ctx.call<void>("putImageData", processedImageData, 0, 0);

  return canvas.call<std::string>("toDataURL", std::string("image/png"));
}

/**
 * @brief Downloads processed image as PNG with maximum quality (lossless)
 * @param canvas HTML Canvas element containing processed image
 * @param filename Filename for the download
 * @return PNG image as data URL string
 */
std::string downloadAsPNG(emscripten::val canvas, const std::string &filename)
{
  std::string dataUrl = canvas.call<std::string>("toDataURL", std::string("image/png"));

  emscripten::val document = emscripten::val::global("document");
  emscripten::val link = document.call<emscripten::val>("createElement", std::string("a"));

  link.set("download", filename + ".png");
  link.set("href", dataUrl);

  emscripten::val body = document["body"];
  body.call<void>("appendChild", link);
  link.call<void>("click");
  body.call<void>("removeChild", link);

  return dataUrl;
}

/**
 * @brief Downloads processed image as JPEG with specified quality
 * @param canvas HTML Canvas element containing processed image
 * @param filename Filename for the download
 * @param quality JPEG quality (10-100, where 100 is highest quality)
 * @return JPEG image as data URL string
 */
std::string downloadAsJPEG(emscripten::val canvas, const std::string &filename, int quality)
{
  float qualityFloat = std::max(0.1f, std::min(1.0f, quality / 100.0f));
  std::string dataUrl = canvas.call<std::string>("toDataURL", std::string("image/jpeg"), qualityFloat);

  emscripten::val document = emscripten::val::global("document");
  emscripten::val link = document.call<emscripten::val>("createElement", std::string("a"));

  link.set("download", filename + ".jpg");
  link.set("href", dataUrl);

  emscripten::val body = document["body"];
  body.call<void>("appendChild", link);
  link.call<void>("click");
  body.call<void>("removeChild", link);

  return dataUrl;
}

/**
 * @brief Downloads processed image as WebP with specified quality
 * @param canvas HTML Canvas element containing processed image
 * @param filename Filename for the download
 * @param quality WebP quality (10-100, where 100 is highest quality)
 * @return WebP image as data URL string
 */
std::string downloadAsWebP(emscripten::val canvas, const std::string &filename, int quality)
{
  float qualityFloat = std::max(0.1f, std::min(1.0f, quality / 100.0f));
  std::string dataUrl = canvas.call<std::string>("toDataURL", std::string("image/webp"), qualityFloat);

  emscripten::val document = emscripten::val::global("document");
  emscripten::val link = document.call<emscripten::val>("createElement", std::string("a"));

  link.set("download", filename + ".webp");
  link.set("href", dataUrl);

  emscripten::val body = document["body"];
  body.call<void>("appendChild", link);
  link.call<void>("click");
  body.call<void>("removeChild", link);

  return dataUrl;
}

/**
 * @brief Generates preview of image with specific format and quality for display
 * @param canvas HTML Canvas element containing processed image
 * @param format Image format ("png", "jpeg", "webp")
 * @param quality Quality for lossy formats (10-100, ignored for PNG)
 * @return Image as data URL string for preview
 */
std::string getPreviewDataUrl(emscripten::val canvas, const std::string &format, int quality)
{
  if (format == "png")
  {
    return canvas.call<std::string>("toDataURL", std::string("image/png"));
  }
  else if (format == "jpeg")
  {
    float qualityFloat = std::max(0.1f, std::min(1.0f, quality / 100.0f));
    return canvas.call<std::string>("toDataURL", std::string("image/jpeg"), qualityFloat);
  }
  else if (format == "webp")
  {
    float qualityFloat = std::max(0.1f, std::min(1.0f, quality / 100.0f));
    return canvas.call<std::string>("toDataURL", std::string("image/webp"), qualityFloat);
  }

  return canvas.call<std::string>("toDataURL", std::string("image/png"));
}

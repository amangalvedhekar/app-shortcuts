package expo.modules.appshortcuts

import androidx.compose.ui.graphics.Color
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

internal object AppShortcutsSerialization {
  fun encodeParams(params: Map<String, String>?): String? {
    if (params.isNullOrEmpty()) {
      return null
    }

    return params.entries
      .sortedBy { it.key }
      .joinToString("&") { (key, value) ->
        "${key.urlEncode()}=${value.urlEncode()}"
      }
  }

  fun decodeParams(value: String?): Map<String, String>? {
    val encoded = value?.takeIf { it.isNotBlank() } ?: return null
    val params = mutableMapOf<String, String>()

    encoded.split("&")
      .filter { it.isNotBlank() }
      .forEach { pair ->
        val separatorIndex = pair.indexOf('=')
        if (separatorIndex <= 0) {
          return@forEach
        }

        val key = pair.substring(0, separatorIndex).urlDecode()
        val decodedValue = pair.substring(separatorIndex + 1).urlDecode()
        params[key] = decodedValue
      }

    return params.ifEmpty { null }
  }
}

internal object AppShortcutsColors {
  fun parseHexColor(value: String?): Color? {
    val hex = value?.trim()?.removePrefix("#")?.takeIf { it.isNotBlank() } ?: return null
    val normalizedHex = when (hex.length) {
      6 -> "${hex}FF"
      8 -> hex
      else -> return null
    }

    val colorLong = normalizedHex.toLongOrNull(16) ?: return null
    val red = ((colorLong shr 24) and 0xff).toInt()
    val green = ((colorLong shr 16) and 0xff).toInt()
    val blue = ((colorLong shr 8) and 0xff).toInt()
    val alpha = (colorLong and 0xff).toInt()

    return Color(
      red = red / 255f,
      green = green / 255f,
      blue = blue / 255f,
      alpha = alpha / 255f
    )
  }
}

private fun String.urlEncode(): String {
  return URLEncoder.encode(this, StandardCharsets.UTF_8)
}

private fun String.urlDecode(): String {
  return URLDecoder.decode(this, StandardCharsets.UTF_8)
}

package expo.modules.appshortcuts

import androidx.compose.ui.graphics.Color
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class AppShortcutsSerializationTest {
  @Test
  fun `encodes and decodes params`() {
    val params = mapOf("source" to "shortcut", "folder" to "primary")

    val encoded = AppShortcutsSerialization.encodeParams(params)
    val decoded = AppShortcutsSerialization.decodeParams(encoded)

    assertEquals(params, decoded)
  }

  @Test
  fun `returns null for empty params payloads`() {
    assertNull(AppShortcutsSerialization.encodeParams(emptyMap()))
    assertNull(AppShortcutsSerialization.decodeParams(null))
    assertNull(AppShortcutsSerialization.decodeParams(""))
  }

  @Test
  fun `parses valid hex color and rejects invalid input`() {
    assertEquals(Color(0xFF1D4ED8), AppShortcutsColors.parseHexColor("#1D4ED8"))
    assertNull(AppShortcutsColors.parseHexColor("invalid"))
    assertNull(AppShortcutsColors.parseHexColor(null))
  }
}

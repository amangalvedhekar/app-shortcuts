import Foundation
import Testing
@testable import AppShortcutsAppleShared

@Test
func payloadOmitsNilFields() {
  let descriptor = AppShortcutDescriptor(
    id: "compose",
    title: "Compose",
    subtitle: nil,
    icon: "square.and.pencil",
    url: nil,
    params: ["source": "shortcut"]
  )

  #expect(descriptor.payload["id"] as? String == "compose")
  #expect(descriptor.payload["title"] as? String == "Compose")
  #expect(descriptor.payload["icon"] as? String == "square.and.pencil")
  #expect(descriptor.payload["subtitle"] == nil)
  #expect(descriptor.payload["url"] == nil)
  #expect((descriptor.payload["params"] as? [String: String])?["source"] == "shortcut")
}

@Test
func userInfoRoundTripFallsBackWhenFieldsAreMissing() {
  let baseDescriptor = AppShortcutDescriptor(
    id: "inbox",
    title: "Inbox",
    subtitle: "Jump back in",
    icon: "tray.full",
    url: "appshortcuts://inbox",
    params: ["folder": "primary"]
  )

  let roundTrip = AppShortcutDescriptor.from(
    userInfo: baseDescriptor.userInfo,
    fallbackId: "fallback-id",
    fallbackTitle: "Fallback title",
    fallbackSubtitle: "Fallback subtitle"
  )

  #expect(roundTrip == baseDescriptor)

  let fallbackDescriptor = AppShortcutDescriptor.from(
    userInfo: nil,
    fallbackId: "fallback-id",
    fallbackTitle: "Fallback title",
    fallbackSubtitle: "Fallback subtitle"
  )

  #expect(fallbackDescriptor.id == "fallback-id")
  #expect(fallbackDescriptor.title == "Fallback title")
  #expect(fallbackDescriptor.subtitle == "Fallback subtitle")
}

@Test
func hexParserSupportsRgbAndRgbaInput() {
  let rgb = AppShortcutsHexColor.parse("#1D4ED8")
  let rgba = AppShortcutsHexColor.parse("1D4ED8CC")

  #expect(rgb == AppShortcutsRGBA(
    red: 29.0 / 255.0,
    green: 78.0 / 255.0,
    blue: 216.0 / 255.0,
    alpha: 1.0
  ))
  #expect(rgba == AppShortcutsRGBA(
    red: 29.0 / 255.0,
    green: 78.0 / 255.0,
    blue: 216.0 / 255.0,
    alpha: 204.0 / 255.0
  ))
  #expect(AppShortcutsHexColor.parse("not-a-color") == nil)
}

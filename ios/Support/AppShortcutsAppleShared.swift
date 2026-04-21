import Foundation

struct AppShortcutDescriptor: Equatable {
  let id: String
  let title: String
  let subtitle: String?
  let icon: String?
  let url: String?
  let params: [String: String]?

  var payload: [String: Any] {
    var payload: [String: Any] = [
      "id": id,
      "title": title
    ]

    if let subtitle {
      payload["subtitle"] = subtitle
    }
    if let icon {
      payload["icon"] = icon
    }
    if let url {
      payload["url"] = url
    }
    if let params {
      payload["params"] = params
    }

    return payload
  }

  var userInfo: [String: NSSecureCoding] {
    var userInfo: [String: NSSecureCoding] = [
      "id": id as NSString,
      "title": title as NSString
    ]

    if let subtitle {
      userInfo["subtitle"] = subtitle as NSString
    }
    if let icon {
      userInfo["icon"] = icon as NSString
    }
    if let url {
      userInfo["url"] = url as NSString
    }
    if let params {
      userInfo["params"] = params as NSDictionary
    }

    return userInfo
  }

  static func from(
    userInfo: [String: Any]?,
    fallbackId: String,
    fallbackTitle: String,
    fallbackSubtitle: String?
  ) -> AppShortcutDescriptor {
    AppShortcutDescriptor(
      id: (userInfo?["id"] as? String) ?? fallbackId,
      title: (userInfo?["title"] as? String) ?? fallbackTitle,
      subtitle: (userInfo?["subtitle"] as? String) ?? fallbackSubtitle,
      icon: userInfo?["icon"] as? String,
      url: userInfo?["url"] as? String,
      params: userInfo?["params"] as? [String: String]
    )
  }
}

struct AppShortcutsRGBA: Equatable {
  let red: Double
  let green: Double
  let blue: Double
  let alpha: Double
}

enum AppShortcutsHexColor {
  static func parse(_ hex: String?) -> AppShortcutsRGBA? {
    guard let hex else {
      return nil
    }

    let cleanedHex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    guard cleanedHex.count == 6 || cleanedHex.count == 8,
          let value = UInt64(cleanedHex, radix: 16) else {
      return nil
    }

    let red: UInt64
    let green: UInt64
    let blue: UInt64
    let alpha: UInt64

    if cleanedHex.count == 8 {
      red = (value >> 24) & 0xff
      green = (value >> 16) & 0xff
      blue = (value >> 8) & 0xff
      alpha = value & 0xff
    } else {
      red = (value >> 16) & 0xff
      green = (value >> 8) & 0xff
      blue = value & 0xff
      alpha = 0xff
    }

    return AppShortcutsRGBA(
      red: Double(red) / 255,
      green: Double(green) / 255,
      blue: Double(blue) / 255,
      alpha: Double(alpha) / 255
    )
  }
}

import ExpoModulesCore
import SwiftUI
import UIKit

final class AppShortcutsViewProps: ExpoSwiftUI.ViewProps {
  @Field
  var title: String = "Shortcut"

  @Field
  var subtitle: String?

  @Field
  var icon: String?

  @Field
  var accentColor: String?
}

struct AppShortcutsView: ExpoSwiftUI.View, ExpoSwiftUI.WithHostingView {
  @ObservedObject var props: AppShortcutsViewProps

  init(props: AppShortcutsViewProps) {
    self.props = props
  }

  var body: some SwiftUI.View {
    VStack(alignment: .leading, spacing: 16) {
      Text(props.icon ?? "Shortcut")
        .font(.caption.weight(.bold))
        .textCase(.uppercase)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(.white.opacity(0.18), in: Capsule())

      Spacer(minLength: 0)

      VStack(alignment: .leading, spacing: 8) {
        Text(props.title)
          .font(.system(size: 24, weight: .bold, design: .rounded))
          .foregroundStyle(.white)

        if let subtitle = props.subtitle, !subtitle.isEmpty {
          Text(subtitle)
            .font(.system(size: 14, weight: .medium, design: .rounded))
            .foregroundStyle(.white.opacity(0.82))
        }
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .padding(20)
    .background(
      LinearGradient(
        colors: [resolvedAccentColor, Color(uiColor: .secondarySystemBackground).opacity(0.14)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )
    )
    .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
    .overlay(
      RoundedRectangle(cornerRadius: 24, style: .continuous)
        .strokeBorder(.white.opacity(0.12), lineWidth: 1)
    )
  }

  private var resolvedAccentColor: Color {
    Color(uiColor: UIColor(appShortcutsHex: props.accentColor) ?? UIColor.systemBlue)
  }
}

private extension UIColor {
  convenience init?(appShortcutsHex hex: String?) {
    guard let rgba = AppShortcutsHexColor.parse(hex) else {
      return nil
    }

    self.init(
      red: rgba.red,
      green: rgba.green,
      blue: rgba.blue,
      alpha: rgba.alpha
    )
  }
}

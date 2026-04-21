import ExpoModulesCore
#if os(iOS)
import UIKit
#endif

public class AppShortcutsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AppShortcuts")

    Events("onShortcut")

    OnCreate {
      #if os(iOS)
      AppShortcutsRegistry.shared.attach(module: self)
      #endif
    }

    OnDestroy {
      #if os(iOS)
      AppShortcutsRegistry.shared.detach(module: self)
      #endif
    }

    OnStartObserving("onShortcut") {
      #if os(iOS)
      AppShortcutsRegistry.shared.setHasListeners(true)
      #endif
    }

    OnStopObserving("onShortcut") {
      #if os(iOS)
      AppShortcutsRegistry.shared.setHasListeners(false)
      #endif
    }

    AsyncFunction("setShortcuts") { (items: [ShortcutItemRecord]) in
      #if os(iOS)
      UIApplication.shared.shortcutItems = items.map { $0.toShortcutItem() }
      #endif
    }
    .runOnQueue(.main)

    AsyncFunction("clearShortcuts") {
      #if os(iOS)
      UIApplication.shared.shortcutItems = []
      AppShortcutsRegistry.shared.clearPendingShortcut()
      #endif
    }
    .runOnQueue(.main)

    AsyncFunction("getInitialShortcut") { () -> ShortcutItemRecord? in
      #if os(iOS)
      return AppShortcutsRegistry.shared.pendingShortcut
      #else
      return nil
      #endif
    }

    View(AppShortcutsView.self)
  }
}

struct ShortcutItemRecord: Record {
  @Field
  var id: String = ""

  @Field
  var title: String = ""

  @Field
  var subtitle: String?

  @Field
  var icon: String?

  @Field
  var url: String?

  @Field
  var params: [String: String]?

  func toPayload() -> [String: Any] {
    descriptor.payload
  }

  var descriptor: AppShortcutDescriptor {
    AppShortcutDescriptor(
      id: id,
      title: title,
      subtitle: subtitle,
      icon: icon,
      url: url,
      params: params
    )
  }
}

#if os(iOS)
extension ShortcutItemRecord {
  func toShortcutItem() -> UIApplicationShortcutItem {
    UIApplicationShortcutItem(
      type: id,
      localizedTitle: title,
      localizedSubtitle: subtitle,
      icon: AppShortcutsIconResolver.icon(from: icon),
      userInfo: descriptor.userInfo
    )
  }

  static func from(shortcutItem: UIApplicationShortcutItem) -> ShortcutItemRecord {
    var record = ShortcutItemRecord()
    let descriptor = AppShortcutDescriptor.from(
      userInfo: shortcutItem.userInfo,
      fallbackId: shortcutItem.type,
      fallbackTitle: shortcutItem.localizedTitle,
      fallbackSubtitle: shortcutItem.localizedSubtitle
    )

    record.id = descriptor.id
    record.title = descriptor.title
    record.subtitle = descriptor.subtitle
    record.icon = descriptor.icon
    record.url = descriptor.url
    record.params = descriptor.params

    return record
  }
}

final class AppShortcutsRegistry {
  static let shared = AppShortcutsRegistry()

  private weak var module: AppShortcutsModule?
  private(set) var pendingShortcut: ShortcutItemRecord?
  private var hasListeners = false

  private init() {}

  func attach(module: AppShortcutsModule) {
    self.module = module
  }

  func detach(module: AppShortcutsModule) {
    if self.module === module {
      self.module = nil
    }
  }

  func setHasListeners(_ hasListeners: Bool) {
    self.hasListeners = hasListeners
  }

  func clearPendingShortcut() {
    pendingShortcut = nil
  }

  func storeInitialShortcut(_ shortcutItem: UIApplicationShortcutItem) {
    pendingShortcut = ShortcutItemRecord.from(shortcutItem: shortcutItem)
  }

  func handleShortcut(_ shortcutItem: UIApplicationShortcutItem) {
    let record = ShortcutItemRecord.from(shortcutItem: shortcutItem)
    pendingShortcut = record

    if hasListeners {
      module?.sendEvent("onShortcut", record.toPayload())
    }
  }
}

enum AppShortcutsIconResolver {
  static func icon(from value: String?) -> UIApplicationShortcutIcon? {
    guard let value, !value.isEmpty else {
      return nil
    }

    return UIApplicationShortcutIcon(systemImageName: value)
  }
}
#endif

package expo.modules.appshortcuts

import android.content.Intent
import android.content.pm.ShortcutInfo
import android.content.pm.ShortcutManager
import android.graphics.drawable.Icon as AndroidIcon
import android.os.Build
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppShortcutsModule : Module() {
  private var hasListeners = false
  private var pendingShortcut: ShortcutItemRecord? = null

  override fun definition() = ModuleDefinition {
    Name("AppShortcuts")

    Events("onShortcut")

    OnCreate {
      cacheInitialShortcutFromActivityIntent()
    }

    OnActivityEntersForeground {
      cacheInitialShortcutFromActivityIntent()
    }

    OnStartObserving("onShortcut") {
      hasListeners = true
    }

    OnStopObserving("onShortcut") {
      hasListeners = false
    }

    AsyncFunction("setShortcuts") { items: List<ShortcutItemRecord> ->
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N_MR1) {
        return@AsyncFunction
      }

      val context = appContext.reactContext
      if (context == null) {
        return@AsyncFunction
      }

      val shortcutManager = context.getSystemService(ShortcutManager::class.java)
      if (shortcutManager == null) {
        return@AsyncFunction
      }

      val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
      if (launchIntent == null) {
        return@AsyncFunction
      }

      val maxShortcutCount = shortcutManager.maxShortcutCountPerActivity

      shortcutManager.dynamicShortcuts = items
        .take(maxShortcutCount)
        .map { item -> item.toShortcutInfo(context, launchIntent) }
    }

    AsyncFunction("clearShortcuts") { _: Unit? ->
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N_MR1) {
        pendingShortcut = null
        return@AsyncFunction
      }

      val context = appContext.reactContext
      if (context == null) {
        return@AsyncFunction
      }

      val shortcutManager = context.getSystemService(ShortcutManager::class.java)
      if (shortcutManager == null) {
        return@AsyncFunction
      }

      shortcutManager.removeAllDynamicShortcuts()
      pendingShortcut = null
    }

    AsyncFunction("getInitialShortcut") {
      pendingShortcut
    }

    OnNewIntent { intent ->
      val shortcut = intent.toShortcutItemRecord() ?: return@OnNewIntent
      pendingShortcut = shortcut

      if (hasListeners) {
        sendEvent("onShortcut", shortcut.toPayload())
      }
    }

    View<AppShortcutsViewProps>("AppShortcuts") { props ->
      AppShortcutsCard(props)
    }
  }

  private fun cacheInitialShortcutFromActivityIntent() {
    val shortcut = appContext.currentActivity?.intent?.toShortcutItemRecord() ?: return
    pendingShortcut = shortcut
  }
}

private data class ShortcutItemRecord(
  @Field
  val id: String = "",
  @Field
  val title: String = "",
  @Field
  val subtitle: String? = null,
  @Field
  val icon: String? = null,
  @Field
  val url: String? = null,
  @Field
  val params: Map<String, String>? = null
) : Record {
  fun toShortcutInfo(context: android.content.Context, baseIntent: Intent): ShortcutInfo {
    val intent = Intent(baseIntent).apply {
      action = Intent.ACTION_VIEW
      flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
      putExtra(EXTRA_SHORTCUT_ID, id)
      putExtra(EXTRA_SHORTCUT_TITLE, title)
      putExtra(EXTRA_SHORTCUT_SUBTITLE, subtitle)
      putExtra(EXTRA_SHORTCUT_ICON, icon)
      putExtra(EXTRA_SHORTCUT_URL, url)

      val encodedParams = AppShortcutsSerialization.encodeParams(params)
      if (encodedParams != null) {
        putExtra(EXTRA_SHORTCUT_PARAMS, encodedParams)
      } else {
        removeExtra(EXTRA_SHORTCUT_PARAMS)
      }
    }

    return ShortcutInfo.Builder(context, id)
      .setShortLabel(title)
      .apply {
        if (!subtitle.isNullOrEmpty()) {
          setLongLabel(subtitle)
        }

        AppShortcutsIconResolver.icon(context, icon)?.let(::setIcon)
      }
      .setIntent(intent)
      .build()
  }

  fun toPayload(): Map<String, Any?> {
    return mapOf(
      "id" to id,
      "title" to title,
      "subtitle" to subtitle,
      "icon" to icon,
      "url" to url,
      "params" to params
    )
  }
}

private fun Intent.toShortcutItemRecord(): ShortcutItemRecord? {
  val id = getStringExtra(EXTRA_SHORTCUT_ID) ?: return null

  return ShortcutItemRecord(
    id = id,
    title = getStringExtra(EXTRA_SHORTCUT_TITLE) ?: id,
    subtitle = getStringExtra(EXTRA_SHORTCUT_SUBTITLE),
    icon = getStringExtra(EXTRA_SHORTCUT_ICON),
    url = getStringExtra(EXTRA_SHORTCUT_URL),
    params = AppShortcutsSerialization.decodeParams(getStringExtra(EXTRA_SHORTCUT_PARAMS))
  )
}

internal object AppShortcutsIconResolver {
  private val symbolResourceNames = mapOf(
    "home" to "as_material_symbol_home",
    "inbox" to "as_material_symbol_inbox",
    "edit_square" to "as_material_symbol_edit_square",
    "edit" to "as_material_symbol_edit_square",
    "compose" to "as_material_symbol_edit_square",
    "house" to "as_material_symbol_home",
    "tray.full" to "as_material_symbol_inbox",
    "square.and.pencil" to "as_material_symbol_edit_square"
  )

  fun icon(context: android.content.Context, iconName: String?): AndroidIcon? {
    val drawableId = resourceId(context, iconName)
      ?: context.applicationInfo.icon.takeIf { it != 0 }
      ?: return null

    return AndroidIcon.createWithResource(context, drawableId)
  }

  fun resourceId(context: android.content.Context, iconName: String?): Int? {
    val resources = context.resources
    val packageName = context.packageName
    val resolvedName = iconName?.trim()?.takeIf { it.isNotEmpty() }

    return resolvedName
      ?.let { name -> resourceNameCandidates(name) }
      ?.firstNotNullOfOrNull { candidate ->
        resources.getIdentifier(candidate, "drawable", packageName).takeIf { it != 0 }
          ?: resources.getIdentifier(candidate, "mipmap", packageName).takeIf { it != 0 }
      }
  }

  internal fun resourceNameCandidates(iconName: String): List<String> {
    val normalizedName = iconName
      .lowercase()
      .replace(Regex("[^a-z0-9_]"), "_")
      .trim('_')

    return listOfNotNull(
      iconName,
      normalizedName.takeIf { it.isNotEmpty() },
      normalizedName.takeIf { it.isNotEmpty() }?.let { "as_material_symbol_$it" },
      symbolResourceNames[iconName],
      symbolResourceNames[iconName.lowercase()],
      symbolResourceNames[normalizedName],
      normalizedName.takeIf { it.isNotEmpty() }?.let { "as_shortcut_$it" }
    ).distinct()
  }
}

private const val EXTRA_SHORTCUT_ID = "expo.modules.appshortcuts.extra.ID"
private const val EXTRA_SHORTCUT_TITLE = "expo.modules.appshortcuts.extra.TITLE"
private const val EXTRA_SHORTCUT_SUBTITLE = "expo.modules.appshortcuts.extra.SUBTITLE"
private const val EXTRA_SHORTCUT_ICON = "expo.modules.appshortcuts.extra.ICON"
private const val EXTRA_SHORTCUT_URL = "expo.modules.appshortcuts.extra.URL"
private const val EXTRA_SHORTCUT_PARAMS = "expo.modules.appshortcuts.extra.PARAMS"

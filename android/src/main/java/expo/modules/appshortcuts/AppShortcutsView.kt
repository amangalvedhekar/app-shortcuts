package expo.modules.appshortcuts

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import expo.modules.kotlin.views.ComposeProps

data class AppShortcutsViewProps(
  val title: String = "Shortcut",
  val subtitle: String? = null,
  val icon: String? = null,
  val accentColor: String? = null
) : ComposeProps

@Composable
fun AppShortcutsCard(props: AppShortcutsViewProps) {
  val accent = AppShortcutsColors.parseHexColor(props.accentColor) ?: Color(0xFF1D4ED8)
  val cardShape = RoundedCornerShape(24.dp)
  val context = LocalContext.current
  val iconResourceId = AppShortcutsIconResolver.resourceId(context, props.icon)

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(
        brush = Brush.linearGradient(
          colors = listOf(accent, Color(0xFF111827))
        ),
        shape = cardShape
      )
      .border(width = 1.dp, color = Color.White.copy(alpha = 0.12f), shape = cardShape)
      .padding(20.dp)
  ) {
    Column(
      modifier = Modifier.fillMaxSize(),
      verticalArrangement = Arrangement.SpaceBetween
    ) {
      Box(
        modifier = Modifier
          .background(Color.White.copy(alpha = 0.18f), shape = RoundedCornerShape(999.dp))
          .padding(horizontal = 12.dp, vertical = 8.dp)
      ) {
        if (iconResourceId != null) {
          Icon(
            painter = painterResource(iconResourceId),
            contentDescription = props.icon ?: props.title,
            modifier = Modifier.size(28.dp),
            tint = Color.White
          )
        } else {
          Text(
            text = props.icon ?: "Shortcut",
            color = Color.White,
            fontWeight = FontWeight.Bold
          )
        }
      }

      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
          text = props.title,
          color = Color.White,
          fontWeight = FontWeight.Bold
        )

        props.subtitle?.takeIf { it.isNotEmpty() }?.let { subtitle ->
          Text(
            text = subtitle,
            color = Color.White.copy(alpha = 0.82f)
          )
        }
      }
    }
  }
}

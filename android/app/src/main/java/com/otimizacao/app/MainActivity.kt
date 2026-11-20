package com.otimizacao.app

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.Display
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray
import kotlin.math.roundToInt

class MainActivity : Activity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(AndroidBridge(), "Android")
        setContentView(webView)

        webView.loadUrl("file:///android_asset/index.html")
    }

    inner class AndroidBridge {
        @JavascriptInterface
        fun getAndroidVersion(): String = "Android ${Build.VERSION.RELEASE}"

        @JavascriptInterface
        fun getSupportedRefreshRates(): String {
            val values = mutableSetOf<Int>()
            val display: Display? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                display
            } else {
                @Suppress("DEPRECATION")
                windowManager.defaultDisplay
            }
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    display?.supportedModes?.forEach { mode ->
                        val rate = mode.refreshRate.roundToInt()
                        if (rate > 0) values.add(rate)
                    }
                }
                if (values.isEmpty()) {
                    val rate = display?.refreshRate?.roundToInt() ?: 0
                    if (rate > 0) values.add(rate)
                }
            } catch (_: Exception) { }
            return JSONArray(values.sorted()).toString()
        }

        @JavascriptInterface
        fun getCurrentRefreshRate(): String {
            return try {
                val current = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    display?.refreshRate
                } else {
                    @Suppress("DEPRECATION")
                    windowManager.defaultDisplay.refreshRate
                }
                current?.roundToInt()?.toString() ?: "Indisponível"
            } catch (_: Exception) { "Indisponível" }
        }

        // Solicita uma taxa preferida apenas para a janela deste aplicativo.
        // O Android ou o fabricante pode ignorar a solicitação.
        @JavascriptInterface
        fun setRefreshRate(hz: Double): Boolean {
            if (hz <= 0.0) return false
            return try {
                runOnUiThread {
                    val params: WindowManager.LayoutParams = window.attributes
                    params.preferredRefreshRate = hz.toFloat()
                    window.attributes = params
                }
                true
            } catch (_: Exception) { false }
        }

        @JavascriptInterface
        fun openDisplaySettings() {
            runOnUiThread {
                try {
                    startActivity(Intent(Settings.ACTION_DISPLAY_SETTINGS))
                } catch (_: Exception) {
                    startActivity(Intent(Settings.ACTION_SETTINGS))
                }
            }
        }

        @JavascriptInterface
        fun openAnimationSettings() {
            runOnUiThread {
                try {
                    startActivity(Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS))
                } catch (_: Exception) {
                    startActivity(Intent(Settings.ACTION_SETTINGS))
                }
            }
        }

        @JavascriptInterface
        fun getGraphicsDriverOptions(): String {
            // Android não oferece a apps comuns uma API geral para trocar o driver.
            return JSONArray().put("Gerenciado pelo sistema").toString()
        }

        @JavascriptInterface
        fun setGraphicsDriver(driver: String): Boolean = false
    }

    override fun onDestroy() {
        webView.removeJavascriptInterface("Android")
        webView.destroy()
        super.onDestroy()
    }
}

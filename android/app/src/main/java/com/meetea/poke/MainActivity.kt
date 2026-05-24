package com.meetea.poke

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val prefs   = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val baseUrl = prefs.getString(PREF_BASE_URL, "") ?: ""
        val token   = prefs.getString(PREF_TOKEN, "") ?: ""

        if (baseUrl.isBlank() || token.isBlank()) {
            startActivity(Intent(this, ConfigActivity::class.java))
        } else {
            startService(Intent(this, PrintService::class.java))
        }

        finish()
    }
}

package com.meetea.poke

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.meetea.poke.databinding.ActivityConfigBinding

const val PREFS_NAME  = "meetea_print"
const val PREF_BASE_URL = "base_url"
const val PREF_TOKEN    = "token"

class ConfigActivity : AppCompatActivity() {

    private lateinit var binding: ActivityConfigBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConfigBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        binding.editBaseUrl.setText(prefs.getString(PREF_BASE_URL, ""))
        binding.editToken.setText(prefs.getString(PREF_TOKEN, ""))

        binding.btnSave.setOnClickListener {
            val url   = binding.editBaseUrl.text.toString().trim()
            val token = binding.editToken.text.toString().trim()

            if (url.isBlank() || token.isBlank()) {
                Toast.makeText(this, "Compila tutti i campi", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            prefs.edit()
                .putString(PREF_BASE_URL, url)
                .putString(PREF_TOKEN, token)
                .apply()

            startService(Intent(this, PrintService::class.java))

            Toast.makeText(this, "Configurazione salvata. Stampa attiva.", Toast.LENGTH_SHORT).show()
            finish()
        }
    }
}

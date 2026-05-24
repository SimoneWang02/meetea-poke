package com.meetea.poke

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.meetea.poke.databinding.ActivityConfigBinding
import com.meetea.poke.printer.DirectPrinter
import com.meetea.poke.printer.SocketPrinter
import com.meetea.poke.printer.SunmiPrinter

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

        binding.btnStop.setOnClickListener {
            stopService(Intent(this, PrintService::class.java))
            Toast.makeText(this, "Servizio stampa fermato.", Toast.LENGTH_SHORT).show()
        }

        binding.btnTest.setOnClickListener {
            val binder = SunmiPrinter.binder
            Log.d("ConfigActivity", "Test stampa — binder=$binder")
            if (binder == null) {
                Toast.makeText(this, "Servizio stampante non connesso. Avvia prima la stampa.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            val ESC = 0x1B.toByte(); val GS = 0x1D.toByte()
            val testBytes = byteArrayOf(
                ESC, 0x61, 0x01,           // center
                ESC, 0x45, 0x01,           // bold on
            ) + "MEETEA TEST\n".toByteArray(Charsets.ISO_8859_1) + byteArrayOf(
                ESC, 0x45, 0x00,           // bold off
            ) + "sendRawData OK\n".toByteArray(Charsets.ISO_8859_1) + byteArrayOf(
                ESC, 0x64, 0x04,           // feed 4 lines
                GS, 0x56, 0x41, 0x00,      // cut
            )
            val sent = DirectPrinter.sendRawData(binder, testBytes)
            Toast.makeText(this, if (sent) "Test inviato" else "Test fallito (vedi logcat)", Toast.LENGTH_SHORT).show()
        }
    }
}

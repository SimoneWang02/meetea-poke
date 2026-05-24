package com.meetea.poke

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.meetea.poke.api.ApiClient
import com.meetea.poke.printer.ReceiptPrinter
import com.meetea.poke.printer.SunmiPrinter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private const val TAG = "PrintService"
private const val CHANNEL_ID = "print_service"
private const val NOTIFICATION_ID = 1
private const val POLL_INTERVAL_MS = 3_000L

class PrintService : Service() {

    private val scope = CoroutineScope(Dispatchers.IO)
    private var pollJob: Job? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
        SunmiPrinter.connect(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val baseUrl = prefs.getString(PREF_BASE_URL, "") ?: ""
        val token   = prefs.getString(PREF_TOKEN, "") ?: ""

        if (baseUrl.isBlank() || token.isBlank()) {
            stopSelf()
            return START_NOT_STICKY
        }

        val api = ApiClient.build(baseUrl, token)

        pollJob?.cancel()
        pollJob = scope.launch {
            while (true) {
                try {
                    val orders = api.printQueue()
                    orders.forEach { order ->
                        val printed = ReceiptPrinter.print(order)
                        if (printed) {
                            try {
                                api.markStampato(order.id)
                            } catch (e: Exception) {
                                Log.e(TAG, "markStampato failed for ${order.id}", e)
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Poll failed", e)
                }
                delay(POLL_INTERVAL_MS)
            }
        }

        return START_STICKY
    }

    override fun onDestroy() {
        pollJob?.cancel()
        SunmiPrinter.disconnect(this)
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Stampa ordini",
                NotificationManager.IMPORTANCE_LOW
            )
            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("MeeTea & Poke")
            .setContentText("In ascolto ordini...")
            .setSmallIcon(R.drawable.ic_notification)
            .setOngoing(true)
            .build()
    }
}

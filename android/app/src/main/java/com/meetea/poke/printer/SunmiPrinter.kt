package com.meetea.poke.printer

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import android.util.Log
import woyou.aidl.service.ICallback
import woyou.aidl.service.IWoyouService

private const val TAG = "SunmiPrinter"
private const val PRINTER_SERVICE_PACKAGE = "com.sunmi.peripheral.printer"
private const val PRINTER_SERVICE_ACTION = "woyou.aidl.service.REMOTE_SERVICE"

object SunmiPrinter {
    var service: IWoyouService? = null
        private set

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName, binder: IBinder) {
            service = IWoyouService.Stub.asInterface(binder)
            Log.d(TAG, "Printer service connected")
        }

        override fun onServiceDisconnected(name: ComponentName) {
            service = null
            Log.w(TAG, "Printer service disconnected")
        }
    }

    fun connect(context: Context) {
        val intent = Intent(PRINTER_SERVICE_ACTION).apply {
            `package` = PRINTER_SERVICE_PACKAGE
        }
        context.bindService(intent, connection, Context.BIND_AUTO_CREATE)
    }

    fun disconnect(context: Context) {
        try {
            context.unbindService(connection)
        } catch (_: Exception) {}
        service = null
    }

    val nullCallback: ICallback = object : ICallback.Stub() {
        override fun onRunResult(isSuccess: Boolean) {}
        override fun onReturnString(result: String?) {}
        override fun onRaiseException(code: Int, msg: String?) {
            Log.e(TAG, "Printer exception $code: $msg")
        }
        override fun onPrintResult(code: Int, msg: String?) {}
    }
}

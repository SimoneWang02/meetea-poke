package com.meetea.poke.printer

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import android.util.Log
import woyou.aidlservice.jiuiv5.ICallback
import woyou.aidlservice.jiuiv5.IWoyouService

private const val TAG = "SunmiPrinter"
private const val PRINTER_SERVICE_PACKAGE = "woyou.aidlservice.jiuiv5"
// Bind directly to PrinterService via the IWoyouService action.
// sendRawData (transact code 11) works correctly at this level.
private const val PRINTER_SERVICE_ACTION = "woyou.aidlservice.jiuiv5.IWoyouService"

object SunmiPrinter {
    var service: IWoyouService? = null
        private set

    // Raw IBinder for direct transact() calls (bypasses AIDL code-order mismatches).
    var binder: IBinder? = null
        private set

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName, rawBinder: IBinder) {
            binder = rawBinder
            service = IWoyouService.Stub.asInterface(rawBinder)
            Log.d(TAG, "Printer service connected")
        }

        override fun onServiceDisconnected(name: ComponentName) {
            binder = null
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
        binder = null
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

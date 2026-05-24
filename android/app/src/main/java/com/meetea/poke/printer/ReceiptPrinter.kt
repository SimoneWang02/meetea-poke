package com.meetea.poke.printer

import android.util.Log
import com.meetea.poke.api.models.Order

private const val TAG = "ReceiptPrinter"

object ReceiptPrinter {

    fun print(order: Order): Boolean {
        val binder = SunmiPrinter.binder ?: run {
            Log.w(TAG, "print() called but binder is null")
            return false
        }
        Log.d(TAG, "Printing order ${order.numeroOrdine} via sendRawData")
        return try {
            val bytes = SocketPrinter.buildReceiptBytes(order)
            DirectPrinter.sendRawData(binder, bytes)
        } catch (t: Throwable) {
            Log.e(TAG, "print() failed for ${order.id}", t)
            false
        }
    }
}

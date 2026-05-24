package com.meetea.poke.printer

import android.os.IBinder
import android.os.Parcel
import android.util.Log

private const val TAG = "DirectPrinter"

// Descriptor confirmed from SunmiPrinterService v6.2.42 DEX analysis.
private const val DESCRIPTOR = "woyou.aidlservice.jiuiv5.IWoyouService"

// Codes ≤ 21 are NOT remapped by InPrinterInterface.onTransact's f(I)I method,
// so the incoming transact code equals the switch-case code directly.
// Code 11: sendRAWData(byte[] data, ICallback callback) → confirmed handler
//   reads createByteArray() + readStrongBinder() → calls t.f0(bytes, cb)
private const val CODE_SEND_RAW_DATA = 11

object DirectPrinter {

    fun sendRawData(binder: IBinder, bytes: ByteArray): Boolean {
        val data = Parcel.obtain()
        val reply = Parcel.obtain()
        return try {
            data.writeInterfaceToken(DESCRIPTOR)
            data.writeByteArray(bytes)
            data.writeStrongBinder(null)
            binder.transact(CODE_SEND_RAW_DATA, data, reply, 0)
            reply.readException()
            Log.d(TAG, "sendRawData ok (${bytes.size} bytes)")
            true
        } catch (e: Exception) {
            Log.e(TAG, "sendRawData failed (${bytes.size} bytes)", e)
            false
        } finally {
            data.recycle()
            reply.recycle()
        }
    }
}

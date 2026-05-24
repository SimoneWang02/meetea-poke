package com.meetea.poke.printer

import android.util.Log
import com.meetea.poke.api.models.Order
import com.meetea.poke.api.models.OrderItem
import java.io.OutputStream
import java.net.InetSocketAddress
import java.net.Socket

private const val TAG = "SocketPrinter"
private val PORTS = listOf(9100, 6101, 4000)

private val ESC = 0x1B.toByte()
private val GS  = 0x1D.toByte()

object SocketPrinter {

    fun print(order: Order): Boolean {
        for (port in PORTS) {
            try {
                val socket = Socket()
                socket.connect(InetSocketAddress("127.0.0.1", port), 1500)
                socket.soTimeout = 5000
                buildReceipt(order, socket.getOutputStream())
                socket.close()
                Log.d(TAG, "Printed via socket port $port")
                return true
            } catch (e: Exception) {
                Log.d(TAG, "Socket port $port failed: ${e.javaClass.simpleName}: ${e.message}")
            }
        }
        Log.w(TAG, "All socket ports failed")
        return false
    }

    fun buildReceiptBytes(order: Order): ByteArray {
        val baos = java.io.ByteArrayOutputStream()
        buildReceipt(order, baos)
        return baos.toByteArray()
    }

    fun testPrint(port: Int): Boolean {
        return try {
            val socket = Socket()
            socket.connect(InetSocketAddress("127.0.0.1", port), 1500)
            socket.soTimeout = 3000
            val out = socket.getOutputStream()
            out.write("MEETEA TEST SOCKET $port\n\n\n".toByteArray(Charsets.US_ASCII))
            out.write(byteArrayOf(GS, 0x56, 0x41, 0x00))
            out.flush()
            socket.close()
            true
        } catch (e: Exception) {
            false
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun buildReceipt(order: Order, out: OutputStream) {
        fun text(s: String) = out.write(s.toByteArray(Charsets.ISO_8859_1))
        fun esc(vararg b: Byte) = out.write(b)

        esc(ESC, 0x61, 0x01)          // center
        esc(ESC, 0x45, 0x01)          // bold
        esc(GS,  0x21, 0x11)          // 2x size
        text("MEETEA POKE\n")
        text("${order.numeroOrdine}\n")
        esc(GS,  0x21, 0x00)          // normal
        esc(ESC, 0x45, 0x00)          // bold off
        text("================================\n")
        esc(ESC, 0x61, 0x00)          // left
        text("Cliente: ${order.nomeCliente}\n")
        text("Ritiro:  ${order.orarioRitiro}\n")
        text("--------------------------------\n")

        order.items.forEach { item -> writeItem(out, item) }

        text("--------------------------------\n")
        if (!order.note.isNullOrBlank()) text("Note: ${order.note}\n")
        esc(ESC, 0x61, 0x01)          // center
        text("================================\n")
        esc(ESC, 0x64, 0x05)          // feed 5 lines
        esc(GS,  0x56, 0x41, 0x00)   // cut
        out.flush()
    }

    @Suppress("UNCHECKED_CAST")
    private fun writeItem(out: OutputStream, item: OrderItem) {
        fun text(s: String) = out.write(s.toByteArray(Charsets.ISO_8859_1))
        fun esc(vararg b: Byte) = out.write(b)
        val cfg = item.configurazione
        val titolo = when (item.tipo) {
            "poke" -> "Poke Bowl"; "bubbletea" -> "Bubble Tea"
            else   -> item.tipo.replaceFirstChar { it.uppercase() }
        }
        esc(ESC, 0x45, 0x01); text("${item.quantita}x $titolo\n"); esc(ESC, 0x45, 0x00)

        when (item.tipo) {
            "poke" -> {
                val dim      = cfg["dimensione"]?.toString()?.replaceFirstChar { it.uppercase() } ?: ""
                val basi     = (cfg["basi"]     as? List<*>)?.joinToString(", ") ?: ""
                val proteine = (cfg["proteine"] as? List<*>)?.joinToString(", ") ?: ""
                val green    = (cfg["green"]    as? List<*>)?.joinToString(", ") ?: ""
                val crispy   = (cfg["crispy"]   as? List<*>)?.joinToString(", ") ?: ""
                val salse    = (cfg["salse"]    as? List<*>)?.joinToString(", ") ?: ""
                if (dim.isNotBlank())      text("  Dim: $dim\n")
                if (basi.isNotBlank())     text("  Basi: $basi\n")
                if (proteine.isNotBlank()) text("  Proteine: $proteine\n")
                if (green.isNotBlank())    text("  Green: $green\n")
                if (crispy.isNotBlank())   text("  Crispy: $crispy\n")
                if (salse.isNotBlank())    text("  Salse: $salse\n")
                val extras = cfg["extras"] as? Map<String, List<*>>
                extras?.forEach { (_, items) ->
                    items.forEach { e ->
                        val nome = (e as? Map<*, *>)?.get("nome")?.toString() ?: return@forEach
                        text("  + $nome (extra)\n")
                    }
                }
            }
            "bubbletea" -> {
                val nome = cfg["nome"]?.toString() ?: ""
                val size = when (cfg["size"]?.toString()) { "M" -> "Media"; "G" -> "Grande"; else -> cfg["size"]?.toString() ?: "" }
                val temp = cfg["temperatura"]?.toString()?.replaceFirstChar { it.uppercase() } ?: ""
                if (nome.isNotBlank()) text("  $nome\n")
                if (size.isNotBlank()) text("  Dim: $size\n")
                if (temp.isNotBlank()) text("  Temp: $temp\n")
                val toppings = cfg["toppings"] as? List<*>
                toppings?.forEach { t ->
                    val tMap  = t as? Map<*, *> ?: return@forEach
                    val tNome = tMap["nome"]?.toString() ?: return@forEach
                    val gusto = tMap["gusto"]?.toString()
                    text("  + ${if (gusto != null) "$tNome ($gusto)" else tNome}\n")
                }
            }
            else -> {
                val label = listOf(cfg["nome"]?.toString(), cfg["qty"]?.toString())
                    .filterNotNull().filter { it.isNotBlank() }.joinToString(" - ")
                if (label.isNotBlank()) text("  $label\n")
            }
        }
    }
}

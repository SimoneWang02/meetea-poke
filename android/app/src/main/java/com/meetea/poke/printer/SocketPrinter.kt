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
        fun text(s: String) = out.write(s.toByteArray(java.nio.charset.Charset.forName("GBK")))
        fun esc(vararg b: Byte) = out.write(b)

        esc(ESC, 0x61, 0x01)          // center
        esc(ESC, 0x45, 0x01)          // bold
        esc(GS,  0x21, 0x11)          // 2x size
        text("MeeTea&Poke\n")
        text("#%03d\n".format(order.numeroOrdine))
        esc(GS,  0x21, 0x00)          // normal
        text("--------------------------------\n")
        esc(ESC, 0x61, 0x00)          // left
        esc(ESC, 0x45, 0x01)          // bold
        text("Cliente: ")
        text("${order.nomeCliente}\n")
        text("Tel: ")
        text("${order.telefono}\n")
        text("Ritiro: ")
        text("${order.orarioRitiro}\n")
        text("--------------------------------\n")
        if (!order.note.isNullOrBlank()) {
            text("Note: ${order.note}\n")
            esc(ESC, 0x61, 0x01)          // center
            text("--------------------------------\n")
            esc(ESC, 0x61, 0x00)          // left
        }
        esc(GS,  0x21, 0x00)          // normal
        val tipoOrdine = mapOf("poke" to 0, "bubbletea" to 1)
        order.items.sortedBy { tipoOrdine[it.tipo] ?: 2 }.forEach { item -> writeItem(out, item) }

        esc(ESC, 0x45, 0x01)          // bold
        text("--------------------------------\n")

        esc(ESC, 0x64, 0x05)          // feed 5 lines
        esc(GS,  0x56, 0x41, 0x00)   // cut
        out.flush()
    }

    @Suppress("UNCHECKED_CAST")
    private fun writeItem(out: OutputStream, item: OrderItem) {
        fun text(s: String) = out.write(s.toByteArray(java.nio.charset.Charset.forName("GBK")))
        fun esc(vararg b: Byte) = out.write(b)
        val cfg = item.configurazione
        val titolo = when (item.tipo) {
            "poke" -> cfg["dimensione"]?.toString()?.replaceFirstChar { it.uppercase() } ?: "Poke Bowl"
            "bubbletea" -> cfg["nome"]?.toString()?.ifBlank { null } ?: "Bubble Tea"
            else   -> cfg["nome"]?.toString()?.ifBlank { null } ?: item.tipo.replaceFirstChar { it.uppercase() }
        }
        esc(ESC, 0x45, 0x01)
        text("${item.quantita}x $titolo\n")

        when (item.tipo) {
            "poke" -> {
                listOf("basi", "proteine", "green", "crispy", "salse").forEach { campo ->
                    (cfg[campo] as? List<*>)?.forEach { ingr ->
                        val s = ingr?.toString() ?: return@forEach
                        text("  + $s\n")
                    }
                }
                (cfg["extras"] as? Map<*, *>)?.values?.forEach { cat ->
                    (cat as? List<*>)?.forEach { e ->
                        val nome = (e as? Map<*, *>)?.get("nome")?.toString() ?: return@forEach
                        text("  + $nome\n")
                    }
                }
                if (cfg["salsa_a_parte"] == true) text("  - Salsa a parte\n")
                val posate = cfg["posate"]?.toString()
                if (!posate.isNullOrBlank() && posate != "Senza Posate") text("  - $posate\n")
            }
            "bubbletea" -> {
                val size = when (cfg["size"]?.toString()) { "M" -> "Media"; "G" -> "Grande"; else -> cfg["size"]?.toString() ?: "" }
                val temp = cfg["temperatura"]?.toString()?.replaceFirstChar { it.uppercase() } ?: ""
                if (size.isNotBlank()) text(" - $size\n")
                if (temp.isNotBlank()) text(" - $temp\n")
                val toppings = cfg["toppings"] as? List<*>
                toppings?.forEach { t ->
                    val tMap  = t as? Map<*, *> ?: return@forEach
                    val tNome = tMap["nome"]?.toString() ?: return@forEach
                    val gusto = tMap["gusto"]?.toString()
                    text("  + ${if (gusto != null) "$tNome ($gusto)" else tNome}\n")
                }
            }
            else -> {
                val porzione = cfg["porzione"]?.toString()
                if (!porzione.isNullOrBlank()) text("  $porzione\n")
            }
        }
        esc(ESC, 0x45, 0x00)
    }
}

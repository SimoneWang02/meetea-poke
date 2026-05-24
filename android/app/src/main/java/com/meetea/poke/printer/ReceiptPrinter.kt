package com.meetea.poke.printer

import com.meetea.poke.api.models.Order
import com.meetea.poke.api.models.OrderItem

private const val LINE = "================================"
private const val SEP  = "--------------------------------"

object ReceiptPrinter {

    fun print(order: Order): Boolean {
        val svc = SunmiPrinter.service ?: return false
        val cb  = SunmiPrinter.nullCallback

        svc.initPrinter(cb)

        svc.setAlignment(1, cb) // centrato
        svc.setFontSize(28f, cb)
        svc.printText("$LINE\n", cb)
        svc.printText("MEETEA POKE\n", cb)
        svc.printText("${order.numeroOrdine}\n", cb)
        svc.printText("$LINE\n", cb)

        svc.setAlignment(0, cb) // sinistra
        svc.setFontSize(24f, cb)
        svc.printText("Cliente: ${order.nomeCliente}\n", cb)
        svc.printText("Ritiro:  ${order.orarioRitiro}\n", cb)
        svc.printText("$SEP\n", cb)

        order.items.forEach { item ->
            printItem(item)
        }

        svc.printText("$SEP\n", cb)

        if (!order.note.isNullOrBlank()) {
            svc.printText("Note: ${order.note}\n", cb)
        }

        svc.setAlignment(1, cb)
        svc.printText("$LINE\n", cb)

        svc.lineWrap(4, cb)
        svc.cutPaper(cb)
        return true
    }

    private fun printItem(item: OrderItem) {
        val svc = SunmiPrinter.service ?: return
        val cb  = SunmiPrinter.nullCallback
        val cfg = item.configurazione

        val titoloTipo = when (item.tipo) {
            "poke"       -> "Poke Bowl"
            "bubbletea"  -> "Bubble Tea"
            else         -> item.tipo.replaceFirstChar { it.uppercase() }
        }

        svc.setFontSize(26f, cb)
        svc.printText("${item.quantita}x $titoloTipo\n", cb)
        svc.setFontSize(22f, cb)

        when (item.tipo) {
            "poke"      -> printPokeDetails(cfg)
            "bubbletea" -> printBobaDetails(cfg)
            else        -> printSfizioDetails(cfg)
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun printPokeDetails(cfg: Map<String, Any?>) {
        val svc = SunmiPrinter.service ?: return
        val cb  = SunmiPrinter.nullCallback

        val dimensione = cfg["dimensione"]?.toString()?.replaceFirstChar { it.uppercase() } ?: ""
        if (dimensione.isNotBlank()) svc.printText("   Dim: $dimensione\n", cb)

        val basi = (cfg["basi"] as? List<*>)?.joinToString(", ") ?: ""
        if (basi.isNotBlank()) svc.printText("   Basi: $basi\n", cb)

        val proteine = (cfg["proteine"] as? List<*>)?.joinToString(", ") ?: ""
        if (proteine.isNotBlank()) svc.printText("   Proteine: $proteine\n", cb)

        val green = (cfg["green"] as? List<*>)?.joinToString(", ") ?: ""
        if (green.isNotBlank()) svc.printText("   Green: $green\n", cb)

        val crispy = (cfg["crispy"] as? List<*>)?.joinToString(", ") ?: ""
        if (crispy.isNotBlank()) svc.printText("   Crispy: $crispy\n", cb)

        val salse = (cfg["salse"] as? List<*>)?.joinToString(", ") ?: ""
        if (salse.isNotBlank()) svc.printText("   Salse: $salse\n", cb)

        // Extra a pagamento
        val extras = cfg["extras"] as? Map<String, List<*>>
        extras?.forEach { (cat, items) ->
            items.forEach { e ->
                val nome = (e as? Map<*, *>)?.get("nome")?.toString() ?: return@forEach
                svc.printText("   + $nome (extra)\n", cb)
            }
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun printBobaDetails(cfg: Map<String, Any?>) {
        val svc = SunmiPrinter.service ?: return
        val cb  = SunmiPrinter.nullCallback

        val nome = cfg["nome"]?.toString() ?: ""
        if (nome.isNotBlank()) svc.printText("   $nome\n", cb)

        val size = when (cfg["size"]?.toString()) {
            "M"  -> "Media"
            "G"  -> "Grande"
            else -> cfg["size"]?.toString() ?: ""
        }
        if (size.isNotBlank()) svc.printText("   Dim: $size\n", cb)

        val temp = cfg["temperatura"]?.toString()?.replaceFirstChar { it.uppercase() } ?: ""
        if (temp.isNotBlank()) svc.printText("   Temp: $temp\n", cb)

        val toppings = cfg["toppings"] as? List<*>
        toppings?.forEach { t ->
            val tMap = t as? Map<*, *> ?: return@forEach
            val tNome = tMap["nome"]?.toString() ?: return@forEach
            val gusto = tMap["gusto"]?.toString()
            val label = if (gusto != null) "$tNome ($gusto)" else tNome
            svc.printText("   + $label\n", cb)
        }
    }

    private fun printSfizioDetails(cfg: Map<String, Any?>) {
        val svc = SunmiPrinter.service ?: return
        val cb  = SunmiPrinter.nullCallback

        val nome = cfg["nome"]?.toString() ?: ""
        val qty  = cfg["qty"]?.toString() ?: ""
        val label = listOf(nome, qty).filter { it.isNotBlank() }.joinToString(" - ")
        if (label.isNotBlank()) svc.printText("   $label\n", cb)
    }
}

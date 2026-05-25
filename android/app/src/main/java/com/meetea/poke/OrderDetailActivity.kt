package com.meetea.poke

import android.graphics.Typeface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.meetea.poke.api.models.Order
import com.meetea.poke.api.models.OrderItem
import com.meetea.poke.databinding.ActivityOrderDetailBinding
import com.meetea.poke.databinding.ItemOrderDetailRowBinding

class OrderDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_ORDER_JSON = "order_json"
    }

    private lateinit var binding: ActivityOrderDetailBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOrderDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val json = intent.getStringExtra(EXTRA_ORDER_JSON) ?: run { finish(); return }
        val order = Gson().fromJson(json, Order::class.java)

        binding.txtOrderTitle.text = "Ordine #${order.numeroOrdine}"
        binding.txtCliente.text = order.nomeCliente
        binding.txtDetailRitiro.text = order.orarioRitiro
        binding.txtDetailTelefono.text = order.telefono?.takeIf { it.isNotBlank() } ?: "-"

        if (!order.note.isNullOrBlank()) {
            binding.txtDetailNote.text = "Note: ${order.note}"
            binding.txtDetailNote.visibility = View.VISIBLE
        }

        val sorted = order.items.sortedBy { mapOf("poke" to 0, "bubbletea" to 1)[it.tipo] ?: 2 }
        binding.recyclerItems.layoutManager = LinearLayoutManager(this)
        binding.recyclerItems.adapter = ItemsAdapter(sorted)

        binding.btnBack.setOnClickListener { finish() }
    }

    @Suppress("OVERRIDE_DEPRECATION")
    override fun onBackPressed() = finish()
}

private class ItemsAdapter(private val items: List<OrderItem>) :
    RecyclerView.Adapter<ItemsAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemOrderDetailRowBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) = holder.bind(items[position])
    override fun getItemCount() = items.size

    class ViewHolder(private val binding: ItemOrderDetailRowBinding) : RecyclerView.ViewHolder(binding.root) {

        @Suppress("UNCHECKED_CAST")
        fun bind(item: OrderItem) {
            val cfg = item.configurazione

            val titolo = when (item.tipo) {
                "poke"      -> cfg["dimensione"]?.toString()?.replaceFirstChar { it.uppercase() } ?: "Poke Bowl"
                "bubbletea" -> cfg["nome"]?.toString()?.ifBlank { null } ?: "Bubble Tea"
                else        -> cfg["nome"]?.toString()?.ifBlank { null } ?: item.tipo.replaceFirstChar { it.uppercase() }
            }

            val prezzoBase = (cfg["prezzo_base"] as? Number)?.toDouble()
            val prezzoStr = if (prezzoBase != null) "  €%.2f".format(prezzoBase * item.quantita) else ""
            binding.txtTipo.text = "${item.quantita}x $titolo"
            binding.txtQuantita.text = prezzoStr

            binding.llConfigurazione.removeAllViews()

            when (item.tipo) {
                "poke" -> {
                    listOf("basi", "proteine", "green", "crispy", "salse").forEach { campo ->
                        (cfg[campo] as? List<*>)?.forEach { ingr ->
                            val s = ingr?.toString() ?: return@forEach
                            addRow("  + $s", prefix = true)
                        }
                    }
                    (cfg["extras"] as? Map<*, *>)?.values?.forEach { cat ->
                        (cat as? List<*>)?.forEach { e ->
                            val nome = (e as? Map<*, *>)?.get("nome")?.toString() ?: return@forEach
                            addRow("  ++ $nome", prefix = true)
                        }
                    }
                    if (cfg["salsa_a_parte"] == true) addRow("  - Salsa a parte", note = true)
                    val posate = cfg["posate"]?.toString()
                    if (!posate.isNullOrBlank() && posate != "Senza Posate") addRow("  - $posate", note = true)
                }
                "bubbletea" -> {
                    val size = when (cfg["size"]?.toString()) { "M" -> "Media"; "G" -> "Grande"; else -> cfg["size"]?.toString() ?: "" }
                    val temp = cfg["temperatura"]?.toString()?.replaceFirstChar { it.uppercase() } ?: ""
                    if (size.isNotBlank()) addRow("  - $size", note = true)
                    if (temp.isNotBlank()) addRow("  - $temp", note = true)
                    (cfg["toppings"] as? List<*>)?.forEach { t ->
                        val tMap  = t as? Map<*, *> ?: return@forEach
                        val tNome = tMap["nome"]?.toString() ?: return@forEach
                        val gusto = tMap["gusto"]?.toString()
                        addRow("  + ${if (gusto != null) "$tNome ($gusto)" else tNome}", prefix = true)
                    }
                }
                else -> {
                    val porzione = cfg["porzione"]?.toString()
                    if (!porzione.isNullOrBlank()) addRow("  $porzione", note = true)
                }
            }
        }

        private fun addRow(text: String, prefix: Boolean = false, note: Boolean = false) {
            val ctx = binding.llConfigurazione.context
            val tv = TextView(ctx).apply {
                this.text = text
                textSize = 13f
                setTextColor(
                    when {
                        prefix -> 0xFF_2D6A4F.toInt()
                        note   -> 0xFF_888888.toInt()
                        else   -> 0xFF_333333.toInt()
                    }
                )
                setTypeface(null, if (prefix) Typeface.BOLD else Typeface.NORMAL)
                val lp = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = (2 * ctx.resources.displayMetrics.density).toInt() }
                layoutParams = lp
            }
            binding.llConfigurazione.addView(tv)
        }
    }
}

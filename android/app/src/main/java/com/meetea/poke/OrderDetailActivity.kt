package com.meetea.poke

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

        binding.recyclerItems.layoutManager = LinearLayoutManager(this)
        binding.recyclerItems.adapter = ItemsAdapter(order.items)

        binding.btnBack.setOnClickListener { finish() }
    }

    override fun onBackPressed() {
        finish()
    }
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

        fun bind(item: OrderItem) {
            binding.txtTipo.text = item.tipo.replaceFirstChar { it.uppercase() }
            binding.txtQuantita.text = "x${item.quantita}"

            binding.llConfigurazione.removeAllViews()
            item.configurazione.forEach { (key, value) ->
                if (value == null) return@forEach
                val displayValue = when (value) {
                    is List<*> -> value.filterNotNull().joinToString(", ")
                    else -> value.toString()
                }
                if (displayValue.isBlank()) return@forEach
                addConfigRow(binding.llConfigurazione, formatKey(key), displayValue)
            }
        }

        private fun addConfigRow(parent: LinearLayout, key: String, value: String) {
            val ctx = parent.context
            val row = LinearLayout(ctx).apply {
                orientation = LinearLayout.HORIZONTAL
                val lp = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = (3 * ctx.resources.displayMetrics.density).toInt() }
                layoutParams = lp
            }
            val keyView = TextView(ctx).apply {
                text = "$key: "
                textSize = 13f
                setTextColor(0xFF_AAAAAA.toInt())
                layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
            }
            val valView = TextView(ctx).apply {
                text = value
                textSize = 13f
                setTextColor(0xFF_333333.toInt())
                layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 2f)
            }
            row.addView(keyView)
            row.addView(valView)
            parent.addView(row)
        }

        private fun formatKey(key: String): String = key
            .replace('_', ' ')
            .replaceFirstChar { it.uppercase() }
    }
}

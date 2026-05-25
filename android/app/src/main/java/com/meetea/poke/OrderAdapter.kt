package com.meetea.poke

import android.content.Intent
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.meetea.poke.api.models.Order
import com.meetea.poke.databinding.ItemOrderBinding

enum class SortMode { RECEPTION, PICKUP }

class OrderAdapter : RecyclerView.Adapter<OrderAdapter.ViewHolder>() {

    private var orders: List<Order> = emptyList()
    private var sortMode: SortMode = SortMode.RECEPTION

    fun setData(newOrders: List<Order>, mode: SortMode) {
        sortMode = mode
        orders = sort(newOrders, mode)
        notifyDataSetChanged()
    }

    fun setSort(mode: SortMode) {
        sortMode = mode
        orders = sort(orders, mode)
        notifyDataSetChanged()
    }

    private fun sort(list: List<Order>, mode: SortMode): List<Order> = when (mode) {
        SortMode.RECEPTION -> list.sortedBy { it.createdAt ?: "" }
        SortMode.PICKUP -> list.sortedBy { it.orarioRitiro }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemOrderBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(orders[position])
    }

    override fun getItemCount() = orders.size

    class ViewHolder(private val binding: ItemOrderBinding) : RecyclerView.ViewHolder(binding.root) {

        fun bind(order: Order) {
            binding.txtNumeroOrdine.text = "#${order.numeroOrdine} - ${order.nomeCliente}"
            binding.txtRitiro.text = order.orarioRitiro
            binding.txtRicezione.text = formatTime(order.createdAt)

            val itemCount = order.items.sumOf { it.quantita }
            binding.txtItems.text = "$itemCount ${if (itemCount == 1) "prodotto" else "prodotti"}"

            binding.root.setOnClickListener {
                val ctx = it.context
                val intent = Intent(ctx, OrderDetailActivity::class.java).apply {
                    putExtra(OrderDetailActivity.EXTRA_ORDER_JSON, Gson().toJson(order))
                }
                ctx.startActivity(intent)
            }
        }

        private fun formatTime(isoString: String?): String {
            if (isoString.isNullOrBlank()) return "--:--"
            return try {
                val timePart = isoString.substringAfter("T").ifEmpty {
                    isoString.substringAfter(" ")
                }
                timePart.substring(0, 5)
            } catch (e: Exception) {
                "--:--"
            }
        }
    }
}

package com.meetea.poke

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
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
            binding.txtNumeroOrdine.text = "#${order.numeroOrdine}"
            binding.txtNomeCliente.text = order.nomeCliente

            binding.txtRitiro.text = order.orarioRitiro
            binding.txtRicezione.text = formatTime(order.createdAt)

            val itemCount = order.items.sumOf { it.quantita }
            binding.txtItems.text = "$itemCount ${if (itemCount == 1) "prodotto" else "prodotti"}"

            val (label, color) = when (order.stato) {
                "in_preparazione" -> "in prep." to "#2980B9"
                "pronto" -> "pronto" to "#2D6A4F"
                else -> "nuovo" to "#E67E22"
            }
            binding.txtStato.text = label
            binding.txtStato.backgroundTintList = android.content.res.ColorStateList.valueOf(Color.parseColor(color))
        }

        private fun formatTime(isoString: String?): String {
            if (isoString.isNullOrBlank()) return "--:--"
            return try {
                // ISO format: "2026-05-25T10:30:00.000000Z" or "2026-05-25 10:30:00"
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

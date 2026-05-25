package com.meetea.poke

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.meetea.poke.api.ApiClient
import com.meetea.poke.databinding.FragmentOrdersBinding
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class OrdersFragment : Fragment() {

    private var _binding: FragmentOrdersBinding? = null
    private val binding get() = _binding!!

    private val adapter = OrderAdapter()
    private var currentSort = SortMode.RECEPTION

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentOrdersBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.recyclerOrders.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerOrders.adapter = adapter

        binding.btnSortReception.setOnClickListener { applySortMode(SortMode.RECEPTION) }
        binding.btnSortPickup.setOnClickListener { applySortMode(SortMode.PICKUP) }

        applySortMode(SortMode.RECEPTION)
    }

    override fun onResume() {
        super.onResume()
        loadOrders()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun applySortMode(mode: SortMode) {
        currentSort = mode
        adapter.setSort(mode)

        val activeColor = Color.parseColor("#2D6A4F")
        val inactiveColor = Color.parseColor("#CCCCCC")

        binding.btnSortReception.backgroundTintList = ColorStateList.valueOf(
            if (mode == SortMode.RECEPTION) activeColor else inactiveColor
        )
        binding.btnSortReception.setTextColor(
            if (mode == SortMode.RECEPTION) Color.WHITE else Color.parseColor("#555555")
        )
        binding.btnSortPickup.backgroundTintList = ColorStateList.valueOf(
            if (mode == SortMode.PICKUP) activeColor else inactiveColor
        )
        binding.btnSortPickup.setTextColor(
            if (mode == SortMode.PICKUP) Color.WHITE else Color.parseColor("#555555")
        )
    }

    private fun loadOrders() {
        val prefs = requireContext().getSharedPreferences(PREFS_NAME, android.content.Context.MODE_PRIVATE)
        val baseUrl = prefs.getString(PREF_BASE_URL, "") ?: ""
        val token = prefs.getString(PREF_TOKEN, "") ?: ""

        if (baseUrl.isBlank() || token.isBlank()) {
            binding.txtEmptyOrders.text = "Configura URL e token nella tab Configurazione"
            binding.txtEmptyOrders.visibility = View.VISIBLE
            return
        }

        binding.progressOrders.visibility = View.VISIBLE
        binding.txtEmptyOrders.visibility = View.GONE
        binding.recyclerOrders.visibility = View.GONE

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val api = ApiClient.build(baseUrl, token)
                val orders = api.recentOrders()
                withContext(Dispatchers.Main) {
                    if (_binding == null) return@withContext
                    binding.progressOrders.visibility = View.GONE
                    if (orders.isEmpty()) {
                        binding.txtEmptyOrders.text = "Nessun ordine oggi"
                        binding.txtEmptyOrders.visibility = View.VISIBLE
                    } else {
                        adapter.setData(orders, currentSort)
                        binding.recyclerOrders.visibility = View.VISIBLE
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    if (_binding == null) return@withContext
                    binding.progressOrders.visibility = View.GONE
                    binding.recyclerOrders.visibility = View.VISIBLE
                    Toast.makeText(requireContext(), "Errore: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}

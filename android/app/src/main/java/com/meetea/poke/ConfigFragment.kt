package com.meetea.poke

import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.meetea.poke.databinding.FragmentConfigBinding

class ConfigFragment : Fragment() {

    private var _binding: FragmentConfigBinding? = null
    private val binding get() = _binding!!

    private var isAccordionExpanded = false

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentConfigBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val prefs = requireContext().getSharedPreferences(PREFS_NAME, android.content.Context.MODE_PRIVATE)
        val savedUrl = prefs.getString(PREF_BASE_URL, "") ?: ""
        val savedToken = prefs.getString(PREF_TOKEN, "") ?: ""

        binding.editBaseUrl.setText(savedUrl)
        binding.editToken.setText(savedToken)

        setAccordionExpanded(savedUrl.isBlank() || savedToken.isBlank())

        binding.llAccordionHeader.setOnClickListener {
            setAccordionExpanded(!isAccordionExpanded)
        }

        binding.btnSaveConfig.setOnClickListener {
            val url = binding.editBaseUrl.text.toString().trim()
            val token = binding.editToken.text.toString().trim()

            if (url.isBlank() || token.isBlank()) {
                Toast.makeText(requireContext(), "Compila tutti i campi", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            prefs.edit()
                .putString(PREF_BASE_URL, url)
                .putString(PREF_TOKEN, token)
                .apply()

            setAccordionExpanded(false)
            Toast.makeText(requireContext(), "Configurazione salvata.", Toast.LENGTH_SHORT).show()
        }

        binding.btnToggle.setOnClickListener {
            if (PrintService.isRunning) {
                PrintService.isRunning = false
                requireContext().stopService(Intent(requireContext(), PrintService::class.java))
                Toast.makeText(requireContext(), "Servizio stampa fermato.", Toast.LENGTH_SHORT).show()
            } else {
                val url = prefs.getString(PREF_BASE_URL, "") ?: ""
                val token = prefs.getString(PREF_TOKEN, "") ?: ""
                if (url.isBlank() || token.isBlank()) {
                    Toast.makeText(requireContext(), "Salva prima la configurazione.", Toast.LENGTH_SHORT).show()
                    setAccordionExpanded(true)
                    return@setOnClickListener
                }
                PrintService.isRunning = true
                requireContext().startService(Intent(requireContext(), PrintService::class.java))
                Toast.makeText(requireContext(), "Servizio stampa avviato.", Toast.LENGTH_SHORT).show()
            }
            updateServiceUI()
        }
    }

    override fun onResume() {
        super.onResume()
        updateServiceUI()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setAccordionExpanded(expanded: Boolean) {
        isAccordionExpanded = expanded
        binding.llAccordionContent.visibility = if (expanded) View.VISIBLE else View.GONE
        binding.dividerAccordion.visibility = if (expanded) View.VISIBLE else View.GONE
        binding.txtAccordionArrow.text = if (expanded) "▲" else "▼"
    }

    private fun updateServiceUI() {
        val running = PrintService.isRunning
        val activeColor = Color.parseColor("#2D6A4F")
        val inactiveColor = Color.parseColor("#999999")

        binding.txtStatusDot.setTextColor(if (running) activeColor else inactiveColor)
        binding.txtStatusLabel.text = if (running) "Servizio attivo" else "Servizio inattivo"
        binding.txtStatusLabel.setTextColor(if (running) activeColor else Color.parseColor("#555555"))

        binding.btnToggle.text = if (running) "Ferma servizio stampa" else "Avvia servizio stampa"
        binding.btnToggle.backgroundTintList = ColorStateList.valueOf(
            Color.parseColor(if (running) "#C0392B" else "#2D6A4F")
        )
    }
}

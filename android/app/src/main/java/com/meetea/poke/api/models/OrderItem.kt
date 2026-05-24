package com.meetea.poke.api.models

import com.google.gson.annotations.SerializedName

data class OrderItem(
    val tipo: String,
    val quantita: Int,
    val configurazione: Map<String, Any?>
)

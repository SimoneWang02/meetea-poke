package com.meetea.poke.api.models

import com.google.gson.annotations.SerializedName

data class Order(
    val id: Int,
    @SerializedName("numero_ordine") val numeroOrdine: String,
    @SerializedName("nome_cliente") val nomeCliente: String,
    @SerializedName("orario_ritiro") val orarioRitiro: String,
    val note: String?,
    val items: List<OrderItem>
)

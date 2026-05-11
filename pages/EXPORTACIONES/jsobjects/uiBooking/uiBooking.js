export default {
  ctx() {
    return {
      operacion: sl_operacion.selectedOptionValue || null,
      transporte: sl_transporte.selectedOptionValue || null,
      tipo_carga: sl_tipo_carga.selectedOptionValue || null,
    };
  },

  isVisible(operacion, transporte, tipo_carga) {
    const c = this.ctx();
    return c.operacion === operacion && c.transporte === transporte && c.tipo_carga === tipo_carga;
  },

  payloadComunes() {
    return {
      operacion: sl_operacion.selectedOptionValue,
      transporte: sl_transporte.selectedOptionValue,
      tipo_carga: sl_tipo_carga.selectedOptionValue,

      prefijo: q_operacion_no_preview.data?.[0]?.prefijo_id ?? null,
      operacion_no: inp_operacion_no.text,

      incoterm: sl_incoterm.selectedOptionValue ?? null,
      ciudad_incoterm: sl_ciudad_incoterm.selectedOptionValue ?? null,

      booking_no: inp_booking_no.text ?? null,
      fecha_booking: dp_fecha_booking.selectedDate ? new Date(dp_fecha_booking.selectedDate).toISOString() : null,

      bodega_cargue: sl_bodega_cargue.selectedOptionValue ?? null,
      cliente: sl_cliente.selectedOptionValue ?? null,

      transportadora_internacional: sl_transportadora_internaciona.selectedOptionValue ?? null,
      puerto_origen: sl_pol.selectedOptionValue ?? null,
      puerto_destino: sl_pod.selectedOptionValue ?? null,

      flete_pagado_en: sl_flete_pagado_en.selectedOptionValue ?? null,
      tarifa_flete_usd: inp_tarifa_flete_usd.text ? Number(inp_tarifa_flete_usd.text) : null,

      estado_operacion: sl_estado_operacion.selectedOptionValue ?? null,
    };
  },
};
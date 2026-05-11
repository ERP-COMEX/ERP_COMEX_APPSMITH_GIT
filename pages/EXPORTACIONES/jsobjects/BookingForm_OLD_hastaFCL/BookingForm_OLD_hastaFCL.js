export default {
  emptyForm() {
    return {
      exportacion_id: "",
      booking_id: "",

      operacion_no: "",
      tipo_operacion_exportacion_id: "",
      tipo_operacion_exportacion_label: "",

      exportador_id: "",
      exportador_label: "",
      cliente_id: "",

      referencia_cliente: "",
      booking_no: "",

      modalidad_transporte_id: "",
      modalidad_transporte_label: "",

      tipo_carga_id: "",
      tipo_carga_label: "",

      caracteristica_carga_id: "",
      caracteristica_carga_label: "",

      incoterm_id: "",
      incoterm_label: "",

      ciudad_incoterm_id: "",
      ciudad_incoterm_label: "",
      ubicacion_internacional_id: "",
      ubicacion_internacional_label: "",

      pais_origen_id: "",
      pais_origen_label: "",
      pol_id: "",
      pol_label: "",
      terminal_pol_id: "",
      terminal_pol_label: "",

      pais_destino_id: "",
      pais_destino_label: "",
      pod_id: "",
      pod_label: "",

      destinatario_id: "",
      destinatario_label: "",

      bodega_cargue_id: "",
      bodega_cargue_label: "",

      agente_carga_id: "",
      agente_carga_label: "",

      alcance_servicio_id: "",
      alcance_servicio_label: "",

      transportadora_internacional_id: "",
      transportadora_internacional_label: "",

      flete_pagado_en_id: "",
      flete_pagado_en_label: "",

      estado_operacion_id: "",
      estado_operacion_label: "",

      tipo_servicio_id: "",
      tipo_servicio_label: "",

      tipo_ruta_servicio_id: "",
      tipo_ruta_servicio_label: "",

      puerto_transbordo_id: "",
      puerto_transbordo_label: "",

      oferta: "",
      tarifa_flete_usd: "",

      fecha_booking: "",
      fecha_confirmacion_oferta: "",
      fecha_vigencia_oferta: "",

      total_contenedores: "",
      tipo_contenedor_id: "",
      tipo_contenedor_label: "",
      patio_retiro_vacios_id: "",
      patio_retiro_vacios_label: "",
      dias_libres: "",
      buque_id: "",
      buque_label: "",
      viaje: "",

      retiro_vacios: "",
      cierre_documental: "",
      entrega_puerto: "",
      cierre_fisico: "",
      eta: "",
      etd: "",
      eta_pod: "",

      pick_up_sea: "",
      consolidacion_sea: "",
      cierre_fisico_lcl: "",
      eta_origen_sea: "",
      etd_sea: "",
      eta_destino_sea: "",
      bultos_sea: "",
      embalaje_sea_id: "",
      embalaje_sea_label: "",
      peso_neto_kg_sea: "",
      peso_bruto_kg_sea: "",
      medidas_sea: "",
      cbm_sea: "",
      remontable_sea: "",
      buque_lcl_id: "",
      buque_lcl_label: "",
      viaje_lcl: "",

      pick_up_air: "",
      cierre_documental_air: "",
      cierre_fisico_air: "",
      etd_air: "",
      eta_air: "",
      bultos_air: "",
      embalaje_air_id: "",
      embalaje_air_label: "",
      peso_neto_kg_air: "",
      peso_bruto_kg_air: "",
      medidas_air: "",
      cbm_air: "",
      remontable_air: "",

      transporte_nacional_ter: "",
      transporte_nacional_ter_label: "",
      total_vehiculos_ter: "",
      tipo_vehiculo_id: "",
      tipo_vehiculo_label: "",
      cargue_ter: "",
      manejo_frontera_id: "",
      manejo_frontera_label: "",
      deposito_frontera_id: "",
      deposito_frontera_label: "",
      ingreso_deposito_ter: "",
      factura_triangulacion_ter: "",
      fecha_factura_ter: "",

      pick_up_correo: "",
      eta_correo: "",
      courier_correo_id: "",
      courier_correo_label: "",
      cuenta_courier_id: "",
      cuenta_courier_label: "",
      awb_correo: "",
      bultos_correo: "",
      embalaje_correo_id: "",
      embalaje_correo_label: "",
      peso_neto_kg_correo: "",
      peso_bruto_kg_correo: "",
      medidas_correo: "",
      cbm_correo: "",

      notas_internas: ""
    };
  },

  normalize(row) {
    if (!row) return this.emptyForm();

    return {
      ...this.emptyForm(),

      exportacion_id: row.exportacion_id || "",
      booking_id: row.id || "",

      operacion_no: row.operacion_no || row.exportacion_operacion_no || "",
      tipo_operacion_exportacion_id: row.tipo_operacion_exportacion_id || "",

      exportador_id: row.exportador_id || "",
      cliente_id: row.cliente_id || row.exportacion_cliente_id || "",

      referencia_cliente: row.referencia_cliente || row.exportacion_referencia_cliente || "",
      booking_no: row.booking_no || "",

      modalidad_transporte_id: row.modalidad_transporte_id || "",
      tipo_carga_id: row.tipo_carga_id || "",
      caracteristica_carga_id: row.caracteristica_carga_id || "",

      incoterm_id: row.incoterm_id || "",
      ciudad_incoterm_id: row.ciudad_incoterm_id || "",
      ubicacion_internacional_id: row.ubicacion_internacional_id || "",

      pais_origen_id: row.pais_origen_id || "",
      pol_id: row.pol_id || "",
      terminal_pol_id: row.terminal_pol_id || "",

      pais_destino_id: row.pais_destino_id || "",
      pod_id: row.pod_id || "",

      destinatario_id: row.destinatario_id || "",
      bodega_cargue_id: row.bodega_cargue_id || "",
      agente_carga_id: row.agente_carga_id || "",

      alcance_servicio_id: row.tipo_servicio_id || "",
      tipo_servicio_id: row.tipo_servicio_id || "",
      tipo_ruta_servicio_id: row.tipo_ruta_servicio_id || "",

      transportadora_internacional_id: row.transportadora_internacional_id || "",
      flete_pagado_en_id: row.flete_pagado_en_id || "",
      estado_operacion_id: row.estado_operacion_id || "",
      puerto_transbordo_id: row.puerto_transbordo_id || "",

      oferta: row.oferta || "",
      tarifa_flete_usd: row.tarifa_flete_usd ?? "",

      fecha_booking: row.fecha_booking || "",
      fecha_confirmacion_oferta: row.fecha_confirmacion_oferta || "",
      fecha_vigencia_oferta: row.fecha_vigencia_oferta || "",

      total_contenedores: row.total_contenedores ?? "",
      tipo_contenedor_id: row.tipo_contenedor_id || "",
      patio_retiro_vacios_id: row.patio_retiro_vacios_id || "",
      dias_libres: row.dias_libres ?? "",
      buque_id: row.buque_id || "",
      viaje: row.viaje || "",

      retiro_vacios: row.retiro_vacios || "",
      cierre_documental: row.cierre_documental || "",
      entrega_puerto: row.entrega_puerto || "",
      cierre_fisico: row.cierre_fisico || "",
      eta: row.eta || "",
      etd: row.etd || "",
      eta_pod: row.eta_pod || "",

      pick_up_sea: row.pick_up_sea || "",
      consolidacion_sea: row.consolidacion_sea || "",
      cierre_fisico_lcl: row.cierre_fisico_lcl || "",
      eta_origen_sea: row.eta_origen_sea || "",
      etd_sea: row.etd_sea || "",
      eta_destino_sea: row.eta_destino_sea || "",
      bultos_sea: row.bultos_sea ?? "",
      embalaje_sea_id: row.embalaje_sea_id || "",
      peso_neto_kg_sea: row.peso_neto_kg_sea ?? "",
      peso_bruto_kg_sea: row.peso_bruto_kg_sea ?? "",
      medidas_sea: row.medidas_sea || "",
      cbm_sea: row.cbm_sea ?? "",
      remontable_sea:
        row.remontable_sea === true ? "SI" :
        row.remontable_sea === false ? "NO" : "",
      buque_lcl_id: row.buque_lcl_id || "",
      viaje_lcl: row.viaje_lcl || "",

      pick_up_air: row.pick_up_air || "",
      cierre_documental_air: row.cierre_documental_air || "",
      cierre_fisico_air: row.cierre_fisico_air || "",
      etd_air: row.etd_air || "",
      eta_air: row.eta_air || "",
      bultos_air: row.bultos_air ?? "",
      embalaje_air_id: row.embalaje_air_id || "",
      peso_neto_kg_air: row.peso_neto_kg_air ?? "",
      peso_bruto_kg_air: row.peso_bruto_kg_air ?? "",
      medidas_air: row.medidas_air || "",
      cbm_air: row.cbm_air ?? "",
      remontable_air:
        row.remontable_air === true ? "SI" :
        row.remontable_air === false ? "NO" : "",

      transporte_nacional_ter: row.transporte_nacional_ter || "",
      total_vehiculos_ter: row.total_vehiculos_ter ?? "",
      tipo_vehiculo_id: row.tipo_vehiculo_id || "",
      cargue_ter: row.cargue_ter || "",
      manejo_frontera_id: row.manejo_frontera_id || "",
      deposito_frontera_id: row.deposito_frontera_id || "",
      ingreso_deposito_ter: row.ingreso_deposito_ter || "",
      factura_triangulacion_ter: row.factura_triangulacion_ter || "",
      fecha_factura_ter: row.fecha_factura_ter || "",

      pick_up_correo: row.pick_up_correo || "",
      eta_correo: row.eta_correo || "",
      courier_correo_id: row.courier_correo_id || "",
      cuenta_courier_id: row.cuentacourrier_correo_id || row.cuenta_courier_id || "",
      awb_correo: row.awb_correo || "",
      bultos_correo: row.bultos_correo ?? "",
      embalaje_correo_id: row.embalaje_correo_id || "",
      peso_neto_kg_correo: row.peso_neto_kg_correo ?? "",
      peso_bruto_kg_correo: row.peso_bruto_kg_correo ?? "",
      medidas_correo: row.medidas_correo || "",
      cbm_correo: row.cbm_correo ?? "",

      notas_internas: row.notas_internas || ""
    };
  },

  resetMainWidgets() {
    [
      "sl_exportador",
      "sl_operacion",
      "inp_operacion_no",
      "inp_booking_no",
      "inp_referencia_cliente",
      "sl_transporte",
      "sl_tipo_carga",
      "sl_caracteristicas",
      "sl_pais_origen",
      "sl_pol",
      "sl_terminal_pol",
      "sl_pais_destino",
      "sl_pod",
      "sl_incoterm",
      "sl_ciudad_incoterm",
      "sl_destinatario",
      "sl_bodega_cargue",
      "sl_agente_de_carga",
      "sl_alcance_servicio",
      "sl_transportadora_internaciona",
      "sl_flete_pagado_en",
      "sl_estado_operacion",
      "sl_tipo_contenedor",
      "sl_patio_retiro_vacios",
      "sl_buque",
      "inp_oferta",
      "inp_tarifa_flete_usd",
      "inp_total_contenedores",
      "inp_dias_libres",
      "inp_viaje",
      "sl_tipo_servicio",
      "sl_puerto_transbordo",
      "dp_fecha_booking",
      "dp_confirmacion_oferta",
      "dp_vigencia_oferta",
      "dp_retiro_vacios",
      "dp_cierre_documental",
      "dp_entrega_puerto",
      "dp_cierre_fisico",
      "dp_eta",
      "dp_etd",
      "dp_eta_pod"
    ].forEach((w) => {
      try {
        resetWidget(w, true);
      } catch (e) {}
    });
  },

  async loadFromSelectedRow() {
    try {
      const selected = tblBookingSearch_New.selectedRow || {};

      if (!selected.id) {
        showAlert("Selecciona un registro.", "warning");
        return false;
      }

      await storeValue("booking_form", this.emptyForm());

      await storeValue("current_booking_id", selected.id || "");
      await storeValue("current_exportacion_id", selected.exportacion_id || "");
      await storeValue("current_operacion_no", selected.operacion_no || "");

      const data = await q_booking_detail.run();
      const row = data?.[0] || q_booking_detail.data?.[0];

      if (!row) {
        showAlert("No se encontró detalle del registro seleccionado.", "error");
        return false;
      }

      const form = this.normalize(row);

      await storeValue("booking_form", form);
      await storeValue("form_mode", "VIEW");

      try {
        if (form.pais_origen_id && form.modalidad_transporte_id) {
          await q_pol_dropdown.run();
        }
      } catch (e) {}

      try {
        if (form.pais_destino_id && form.modalidad_transporte_id) {
          await q_pod_dropdown.run();
        }
      } catch (e) {}

      try {
        if (form.transportadora_internacional_id) {
          await q_buques_dropdown.run();
          await q_patios_retiro_vacios.run();
        }
      } catch (e) {}

      try {
        if (form.modalidad_transporte_id) {
          await q_tipos_servicio_dropdown.run();
          await q_tipos_ruta_servicio_dropdown.run();
        }
      } catch (e) {}

      this.resetMainWidgets();

      showAlert("Registro cargado en modo CONSULTA.", "success");
      return true;
    } catch (err) {
      showAlert("Error al cargar registro: " + JSON.stringify(err), "error");
      return false;
    }
  },

  async newForm() {
    await storeValue("booking_form", this.emptyForm());
    await storeValue("form_mode", "NEW");
    await storeValue("current_booking_id", "");
    await storeValue("current_exportacion_id", "");
    await storeValue("current_operacion_no", "");
    await storeValue("current_operacion_tipo_id", "");

    this.resetMainWidgets();

    return true;
  },

  async duplicateFromSelectedRow() {
    try {
      const selected = tblBookingSearch_New.selectedRow || {};

      if (!selected.id) {
        showAlert("Selecciona un registro para duplicar.", "warning");
        return false;
      }

      const loaded = await this.loadFromSelectedRow();

      if (!loaded) {
        return false;
      }

      const current = appsmith.store.booking_form || this.emptyForm();

      await storeValue("booking_form", {
        ...current,
        exportacion_id: "",
        booking_id: "",
        operacion_no: "",
        tipo_operacion_exportacion_id: "",
        tipo_operacion_exportacion_label: "",
        booking_no: ""
      });

      await storeValue("current_booking_id", "");
      await storeValue("current_exportacion_id", "");
      await storeValue("current_operacion_no", "");
      await storeValue("current_operacion_tipo_id", "");
      await storeValue("form_mode", "NEW");

      this.resetMainWidgets();

      showAlert(
        "Registro duplicado. Selecciona el régimen para generar el nuevo consecutivo.",
        "info"
      );

      return true;
    } catch (err) {
      showAlert("Error al duplicar registro: " + JSON.stringify(err), "error");
      return false;
    }
  },

  async setField(field, value) {
    const current = appsmith.store.booking_form || this.emptyForm();

    await storeValue("booking_form", {
      ...current,
      [field]: value ?? ""
    });

    return true;
  },

  async setFields(fields = {}) {
    const current = appsmith.store.booking_form || this.emptyForm();

    await storeValue("booking_form", {
      ...current,
      ...fields
    });

    return true;
  },

  async clearChildren(fields = []) {
    const current = appsmith.store.booking_form || this.emptyForm();
    const next = { ...current };

    fields.forEach((field) => {
      next[field] = "";
    });

    await storeValue("booking_form", next);
    return true;
  },

  async init() {
    const empty = this.emptyForm();

    await storeValue("booking_form", appsmith.store.booking_form || empty);
    await storeValue("form_mode", appsmith.store.form_mode || "VIEW");

    return true;
  }
};
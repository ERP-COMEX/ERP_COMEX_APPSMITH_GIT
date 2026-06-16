export default {
  async loadProforma() {
    const cab = appsmith.store.cv_proforma_loaded || {};

    if (!cab || !Object.keys(cab).length) {
      showAlert("No existe información de proforma.", "warning");
      return;
    }

    await storeValue("cv_ui_tipo_documento_id", cab.tipo_documento_id || "");
    await storeValue("cv_ui_proforma_no", cab.proforma_no || "");
    await storeValue("cv_ui_centro_costo_id", cab.centro_costo_venta_id || "");
    await storeValue("cv_ui_vendedor_id", cab.vendedor_id || "");
    await storeValue("cv_ui_obs_comerciales", cab.observaciones_comerciales || "");
    await storeValue("cv_ui_obs_logisticas", cab.observaciones_logisticas || "");
    await storeValue("cv_ui_fecha_proforma", cab.fecha_proforma || "");
    await storeValue("cv_ui_fecha_vencimiento", cab.fecha_vencimiento || "");
    await storeValue("cv_ui_fecha_entrega", cab.fecha_entrega || "");
    await storeValue("cv_ui_forma_pago_id", cab.forma_pago_id || "");
    await storeValue("cv_ui_moneda_id", cab.moneda_id || "");
    await storeValue("cv_ui_fecha_envio", cab.fecha_envio || "");
    await storeValue("cv_ui_estado_id", cab.estado_id || "");

    this.resetCabeceraWidgets();
  },

  async clearItemForm() {
    await storeValue("cv_item_producto", null);
    await storeValue("cv_item_empaque", null);
    await storeValue("cv_item_edit_index", null);

    await storeValue("cv_ui_item_tipo_producto", "");
    await storeValue("cv_ui_item_categoria", "");
    await storeValue("cv_ui_item_producto", "");
    await storeValue("cv_ui_item_codigo", "");
    await storeValue("cv_ui_item_empaque", "");

    await storeValue("cv_ui_item_cantidad", "");
    await storeValue("cv_ui_item_valor_unit", "");
    await storeValue("cv_ui_item_flete", "");
    await storeValue("cv_ui_item_seguro", "");
    await storeValue("cv_ui_item_gastos_destino", "");

    this.resetItemWidgets();
  },

  async resetProformaForm() {
    await storeValue("cv_form_mode", "NEW");
    await storeValue("cv_proforma_id", null);
    await storeValue("cv_proforma_loaded", null);
    await storeValue("cv_items_proforma", []);

    await storeValue("cv_ui_tipo_documento_id", "");
    await storeValue("cv_ui_proforma_no", "");
    await storeValue("cv_ui_centro_costo_id", "");
    await storeValue("cv_ui_vendedor_id", "");
    await storeValue("cv_ui_obs_comerciales", "");
    await storeValue("cv_ui_obs_logisticas", "");
    await storeValue("cv_ui_fecha_proforma", "");
    await storeValue("cv_ui_fecha_vencimiento", "");
    await storeValue("cv_ui_fecha_entrega", "");
    await storeValue("cv_ui_forma_pago_id", "");
    await storeValue("cv_ui_moneda_id", "");
    await storeValue("cv_ui_fecha_envio", "");
    await storeValue("cv_ui_estado_id", "");

    await this.clearItemForm();

    this.resetCabeceraWidgets();
    this.resetItemWidgets();
  },

  async resetFullForm() {
    await this.resetProformaForm();

    await storeValue("cv_exportacion_id", null);
    await storeValue("cv_operacion_no", null);
    await storeValue("cv_tenant_id", null);
    await storeValue("cv_cliente_id", null);
    await storeValue("cv_cliente", null);
    await storeValue("cv_status_cv", null);
    await storeValue("cv_confirmacion_venta_status", null);
    await storeValue("cv_loading_operacion", false);
    await storeValue("cv_loading_item_edit", false);
    await storeValue("cv_has_pending_changes", false);

    resetWidget("slCvOperacion", true);
    resetWidget("tblCvDetalle", true);
    resetWidget("tblCvProformasResumen", true);
  },

  async loadOperacionFromResumen(row) {
    if (!row) {
      showAlert("Selecciona una operación.", "warning");
      return;
    }

    if (appsmith.store.cv_has_pending_changes) {
      showAlert(
        "Tienes cambios pendientes. Guarda o cancela antes de cambiar de operación.",
        "warning"
      );
      return;
    }

    await storeValue("cv_loading_operacion", true);

    try {
      await storeValue("cv_exportacion_id", row.exportacion_id || row.id || null);
      await storeValue("cv_operacion_no", row.operacion_no || null);
      await storeValue("cv_tenant_id", row.tenant_id || null);
      await storeValue("cv_cliente_id", row.cliente_id || null);
      await storeValue("cv_status_cv", row.status_cv || null);

      await this.resetProformaForm();
      await storeValue("cv_has_pending_changes", false);

      if (qCvProformaCabecera?.run) {
        await qCvProformaCabecera.run();
      }

      if (qCvProformaDetalle?.run) {
        await qCvProformaDetalle.run();
      }

      resetWidget("tblCvDetalle", true);
      resetWidget("tblCvProformasResumen", true);

      if (qCvProformasResumen?.run) {
        await qCvProformasResumen.run();
      }

      if (qCvOperacionTotales?.run) {
        await qCvOperacionTotales.run();
      }

      showAlert("Operación cargada correctamente.", "success");
    } catch (err) {
      showAlert("Error al cargar operación: " + (err.message || err), "error");
    } finally {
      await storeValue("cv_loading_operacion", false);
    }
  },

  isProformaEditable() {
    const estado = (
      slCvEstado.selectedOptionLabel ||
      appsmith.store.cv_proforma_loaded?.estado ||
      ""
    )
      .toString()
      .trim()
      .toUpperCase();

    const estadosBloqueados = [
      "ENVIADA",
      "APROBADA",
      "FACTURADA",
      "ANULADA",
      "CERRADA"
    ];

    return !estadosBloqueados.includes(estado);
  },

  resetCabeceraWidgets() {
    resetWidget("slCvTipoDocumento", true);
    resetWidget("inpCvProformaNo", true);
    resetWidget("slCvCentroCostoVenta", true);
    resetWidget("slCvVendedor", true);
    resetWidget("taCvObsComerciales", true);
    resetWidget("taCvObsLogisticas", true);
    resetWidget("dpCvFechaProforma", true);
    resetWidget("dpCvFechaVencimiento", true);
    resetWidget("dpCvFechaEntrega", true);
    resetWidget("slCvFormaPago", true);
    resetWidget("slCvMoneda", true);
    resetWidget("dpCvFechaEnvio", true);
    resetWidget("slCvEstado", true);
  },

  resetItemWidgets() {
    resetWidget("slCvItemTipoProducto", true);
    resetWidget("slCvItemCategoria", true);
    resetWidget("slCvItemProducto", true);
    resetWidget("slCvItemCodigo", true);
    resetWidget("slCvItemEmpaque", true);
    resetWidget("inpCvItemCantidad", true);
    resetWidget("inpCvItemValorUnit", true);
    resetWidget("inpCvItemValorFlete", true);
    resetWidget("inpCvItemValorSeguro", true);
    resetWidget("inpCvItemValorGastDest", true);
  }
}
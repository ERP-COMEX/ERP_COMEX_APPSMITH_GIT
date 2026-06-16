export default {
  initStores: async () => {
    await storeValue("cp_exportacion_id", null);
    await storeValue("cp_operacion_no", null);
    await storeValue("cp_tenant_id", null);

    await storeValue("cp_booking_id", null);
    await storeValue("cp_booking_no", null);

    await storeValue("cp_proforma_id", null);
    await storeValue("cp_proforma_no", null);

    await storeValue("cp_cargue_id", null);
    await storeValue("cp_estado_cargue_id", null);

    await storeValue("cp_form_mode", "NEW");
    await storeValue("cp_has_pending_changes", false);

    await storeValue("cp_operacion_selected", null);

    await storeValue("cp_modalidad_transporte_id", null);
    await storeValue("cp_tipo_carga_id", null);
    await storeValue("cp_caracteristica_carga_id", null);

    await storeValue("cp_referencia_cliente", null);

    await storeValue("cp_total_contenedores_booking", 0);
    await storeValue("cp_total_contenedores_confirmados", 0);
    await storeValue("cp_total_vehiculos_booking", 0);

    await storeValue("cp_proforma_cantidad_total", 0);
    await storeValue("cp_proforma_peso_neto_total", 0);
    await storeValue("cp_proforma_peso_bruto_total", 0);
    await storeValue("cp_proforma_volumen_total", 0);

    await storeValue("cp_vehiculos", []);
    await storeValue("cp_contenedores", []);
    await storeValue("cp_sellos", []);
    await storeValue("cp_documentos", []);
    await storeValue("cp_mercancia", []);
    await storeValue("cp_inspecciones", []);

    await storeValue("cp_vehiculo_edit_index", null);
    await storeValue("cp_contenedor_edit_index", null);
    await storeValue("cp_sello_edit_index", null);
    await storeValue("cp_documento_edit_index", null);
    await storeValue("cp_mercancia_edit_index", null);

    await storeValue("cp_delete_context", null);
    await storeValue("cp_update_context", null);

    return true;
  },

  onOperacionSelected: async () => {
    const op = (qCpOperacionDropdown.data || []).find(
      x => x.value === slCpOperacion.selectedOptionValue
    );

    if (!op) {
      showAlert("NO SE ENCONTRÓ LA OPERACIÓN SELECCIONADA EN LA QUERY.", "warning");
      return false;
    }

    await storeValue("cp_operacion_selected", op);

    await storeValue("cp_exportacion_id", op.exportacion_id);
    await storeValue("cp_operacion_no", op.operacion_no);
    await storeValue("cp_tenant_id", op.tenant_id);

    await storeValue("cp_booking_id", op.booking_id || null);
    await storeValue("cp_booking_no", op.booking_no || null);

    await storeValue("cp_proforma_id", op.proforma_id || null);
    await storeValue("cp_proforma_no", op.proforma_no || null);

    await storeValue("cp_cargue_id", op.cargue_id || null);
    await storeValue("cp_estado_cargue_id", op.estado_cargue_id || null);

    await storeValue("cp_modalidad_transporte_id", op.modalidad_transporte_id || null);
    await storeValue("cp_tipo_carga_id", op.tipo_carga_id || null);
    await storeValue("cp_caracteristica_carga_id", op.caracteristica_carga_id || null);

    await storeValue("cp_referencia_cliente", op.referencia_cliente || null);

    await storeValue("cp_total_contenedores_booking", Number(op.total_contenedores || 0));
    await storeValue("cp_total_contenedores_confirmados", Number(op.total_contenedores_confirmados || 0));
    await storeValue("cp_total_vehiculos_booking", Number(op.total_vehiculos_ter || 0));

    await storeValue("cp_proforma_cantidad_total", Number(op.proforma_cantidad_total || 0));
    await storeValue("cp_proforma_peso_neto_total", Number(op.proforma_peso_neto_total || 0));
    await storeValue("cp_proforma_peso_bruto_total", Number(op.proforma_peso_bruto_total || 0));
    await storeValue("cp_proforma_volumen_total", Number(op.proforma_volumen_total || 0));

    await storeValue("cp_has_pending_changes", false);

    if (typeof qCpOperacionResumen !== "undefined") {
      await qCpOperacionResumen.run();
    }

    if (typeof qCpVehiculosResumen !== "undefined") {
      await qCpVehiculosResumen.run();
    }

    return true;
  },

  markDirty: async () => {
    await storeValue("cp_has_pending_changes", true);
    return true;
  },

  clearOperation: async () => {
    await storeValue("cp_exportacion_id", null);
    await storeValue("cp_operacion_no", null);
    await storeValue("cp_tenant_id", null);

    await storeValue("cp_booking_id", null);
    await storeValue("cp_booking_no", null);

    await storeValue("cp_proforma_id", null);
    await storeValue("cp_proforma_no", null);

    await storeValue("cp_cargue_id", null);
    await storeValue("cp_estado_cargue_id", null);

    await storeValue("cp_operacion_selected", null);
    await storeValue("cp_has_pending_changes", false);
    await storeValue("cp_update_context", null);

    return true;
  },

  openDirectorioVehiculoUpdate: async () => {
    const vehiculo = qCpBuscarVehiculoPorPlaca.data?.[0];

    if (vehiculo?.vehiculo_id) {
      await storeValue("cp_update_context", {
        entity: "VEHICULO",
        mode: "UPDATE",
        entity_id: vehiculo.vehiculo_id,
        title: "ACTUALIZAR DIRECTORIO DE VEHÍCULOS",
        modulo: "CARGUE_PLANTA"
      });

      if (typeof qDirVehiculoById !== "undefined") {
        await qDirVehiculoById.run();
      }

      showModal("mdlDirectorioUpdate");
      return true;
    }

    await storeValue("cp_update_context", {
      entity: "VEHICULO",
      mode: "CREATE",
      entity_id: null,
      title: "CREAR VEHÍCULO EN DIRECTORIO",
      modulo: "CARGUE_PLANTA"
    });

    showModal("mdlDirectorioUpdate");
    return true;
  },

  openDirectorioConductorUpdate: async () => {
    const conductor = qCpBuscarConductorPorDocumento.data?.[0];

    if (conductor?.conductor_id) {
      await storeValue("cp_update_context", {
        entity: "CONDUCTOR",
        mode: "UPDATE",
        entity_id: conductor.conductor_id,
        title: "ACTUALIZAR DIRECTORIO DE CONDUCTORES",
        modulo: "CARGUE_PLANTA"
      });

      if (typeof qDirConductorById !== "undefined") {
        await qDirConductorById.run();
      }

      showModal("mdlDirectorioUpdate");
      return true;
    }

    await storeValue("cp_update_context", {
      entity: "CONDUCTOR",
      mode: "CREATE",
      entity_id: null,
      title: "CREAR CONDUCTOR EN DIRECTORIO",
      modulo: "CARGUE_PLANTA"
    });

    showModal("mdlDirectorioUpdate");
    return true;
  },

  openDirectorioVehiculoCreate: async () => {
    await storeValue("cp_update_context", {
      entity: "VEHICULO",
      mode: "CREATE",
      entity_id: null,
      title: "CREAR VEHÍCULO EN DIRECTORIO",
      modulo: "CARGUE_PLANTA"
    });

    showModal("mdlDirectorioUpdate");
    return true;
  },

  openDirectorioConductorCreate: async () => {
    await storeValue("cp_update_context", {
      entity: "CONDUCTOR",
      mode: "CREATE",
      entity_id: null,
      title: "CREAR CONDUCTOR EN DIRECTORIO",
      modulo: "CARGUE_PLANTA"
    });

    showModal("mdlDirectorioUpdate");
    return true;
  },

  clearDirectorioUpdateModal: async () => {
    await storeValue("cp_update_context", null);

    await JS_FormUtils.resetWidgetsSafe([
      "inpDirUpdateMotivo",
      "inpDirUpdatePassword",

      "inpDirVehPlaca",
      "slDirVehTipoVehiculo",
      "slDirVehMarca",
      "inpDirVehModelo",
      "slDirVehColor",
      "inpDirVehCapacidadKg",
      "inpDirVehSoatNo",
      "dpDirVehSoatVencimiento",

      "inpDirCondNombre",
      "slDirCondTipoDocumento",
      "inpDirCondDocumento",
      "inpDirCondLicencia",
      "msDirCondCategoriaLicencia",
      "dpDirCondVencimientoLicencia",
      "inpDirCondTelefono",
      "inpDirCondEmail"
    ]);

    return true;
  },

  clearVehiculoForm: async () => {
    await JS_FormUtils.resetWidgetsSafe([
      "inpCpPlaca",
      "slCpTipoVehiculo",
      "slCpTipoRemolque",
      "inpCpPlacaRemolque",
      "slCpMarcaVehiculo",
      "inpCpModeloVehiculo",
      "slCpColorVehiculo",
      "inpCpCapacidadCargaKg",
      "inpCpSoatNo",
      "dpCpSoatVencimiento",
      "inpCpCedulaConductor",
      "inpCpNombreConductor",
      "inpCpLicenciaConductor",
      "inpCpTelefonoConductor"
    ]);

    return true;
  }
};
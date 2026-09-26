export default {
  /*
   * ============================================================
   * CONTEXTO GLOBAL DEL USUARIO
   * ============================================================
   */

  bootstrapUserContext: async () => {
    const currentUserId =
      appsmith.store.user_id ||
      appsmith.store.current_user?.id ||
      null;

    const currentTenantId =
      appsmith.store.tenant_id ||
      appsmith.store.current_user?.tenant_id ||
      null;

    if (currentUserId && currentTenantId) {
      return true;
    }

    if (typeof qDirBootstrapUsuarioActual === "undefined") {
      showAlert(
        "NO EXISTE LA QUERY qDirBootstrapUsuarioActual.",
        "error"
      );
      return false;
    }

    try {
      await qDirBootstrapUsuarioActual.run();

      const user =
        qDirBootstrapUsuarioActual.data?.[0] || null;

      if (!user?.user_id || !user?.tenant_id) {
        showAlert(
          "NO SE PUDO CARGAR EL CONTEXTO DEL USUARIO.",
          "error"
        );
        return false;
      }

      await storeValue("user_id", user.user_id);
      await storeValue("tenant_id", user.tenant_id);

      await storeValue("current_user", {
        id: user.user_id,
        tenant_id: user.tenant_id,
        email: user.email || null,
        nombre: user.nombre || null,
        rol: user.rol || null
      });

      return true;
    } catch (error) {
      console.error(
        "ERROR bootstrapUserContext:",
        error
      );

      showAlert(
        "NO SE PUDO INICIALIZAR EL USUARIO ACTUAL.",
        "error"
      );

      return false;
    }
  },

  /*
   * ============================================================
   * INICIALIZACIÓN DEL MÓDULO
   * ============================================================
   */

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
    await storeValue(
      "cp_caracteristica_carga_id",
      null
    );

    await storeValue("cp_referencia_cliente", null);

    await storeValue(
      "cp_total_contenedores_booking",
      0
    );

    await storeValue(
      "cp_total_contenedores_confirmados",
      0
    );

    await storeValue(
      "cp_total_vehiculos_booking",
      0
    );

    await storeValue(
      "cp_proforma_cantidad_total",
      0
    );

    await storeValue(
      "cp_proforma_peso_neto_total",
      0
    );

    await storeValue(
      "cp_proforma_peso_bruto_total",
      0
    );

    await storeValue(
      "cp_proforma_volumen_total",
      0
    );

    await storeValue("cp_vehiculos", []);
    await storeValue("cp_contenedores", []);
    await storeValue("cp_sellos", []);
    await storeValue("cp_documentos", []);
    await storeValue("cp_mercancia", []);
    await storeValue("cp_inspecciones", []);

    await storeValue(
      "cp_vehiculo_selected",
      null
    );

    await storeValue(
      "cp_vehiculo_selected_id",
      null
    );

    await storeValue(
      "cp_vehiculo_edit_index",
      null
    );

    await storeValue(
      "cp_vehiculo_edit_id",
      null
    );

    await storeValue(
      "cp_contenedor_edit_index",
      null
    );

    await storeValue(
      "cp_sello_edit_index",
      null
    );

    await storeValue(
      "cp_documento_edit_index",
      null
    );

    await storeValue(
      "cp_mercancia_edit_index",
      null
    );

    await storeValue("cp_delete_context", null);
    await storeValue("cp_update_context", null);
    await storeValue("cp_modal_open", false);

    /*
     * Stores del formulario de vehículo/viaje.
     */

    await storeValue("cp_ui_veh_placa", "");
    await storeValue(
      "cp_ui_veh_tipo_vehiculo_id",
      ""
    );

    await storeValue(
      "cp_ui_veh_tipo_remolque_id",
      ""
    );

    await storeValue(
      "cp_ui_veh_placa_remolque",
      ""
    );

    await storeValue("cp_ui_veh_marca", "");
    await storeValue("cp_ui_veh_modelo", "");
    await storeValue("cp_ui_veh_color", "");

    await storeValue(
      "cp_ui_veh_capacidad_kg",
      ""
    );

    await storeValue("cp_ui_veh_soat_no", "");

    await storeValue(
      "cp_ui_veh_soat_vencimiento",
      ""
    );

    await storeValue(
      "cp_ui_cond_documento",
      ""
    );

    await storeValue("cp_ui_cond_nombre", "");
    await storeValue(
      "cp_ui_cond_licencia",
      ""
    );

    await storeValue(
      "cp_ui_cond_telefono",
      ""
    );

    await storeValue(
      "cp_ui_cond_estado",
      ""
    );

    return true;
  },

  pageLoad: async () => {
    await storeValue(
      "active_section",
      "CARGUE_EN_PLANTA"
    );

    const userContextOk =
      await this.bootstrapUserContext();

    if (!userContextOk) {
      return false;
    }

    await this.initStores();

    await storeValue(
      "active_section",
      "CARGUE_EN_PLANTA"
    );

    return true;
  },

  /*
   * ============================================================
   * SELECCIÓN DE OPERACIÓN
   * ============================================================
   */

  onOperacionSelected: async () => {
    const op = (qCpOperacionDropdown.data || []).find(
      item =>
        item.value ===
        slCpOperacion.selectedOptionValue
    );

    if (!op) {
      showAlert(
        "NO SE ENCONTRÓ LA OPERACIÓN SELECCIONADA EN LA QUERY.",
        "warning"
      );
      return false;
    }

    await storeValue(
      "cp_operacion_selected",
      op
    );

    await storeValue(
      "cp_exportacion_id",
      op.exportacion_id || null
    );

    await storeValue(
      "cp_operacion_no",
      op.operacion_no || null
    );

    await storeValue(
      "cp_tenant_id",
      op.tenant_id ||
        appsmith.store.tenant_id ||
        null
    );

    await storeValue(
      "cp_booking_id",
      op.booking_id || null
    );

    await storeValue(
      "cp_booking_no",
      op.booking_no || null
    );

    await storeValue(
      "cp_proforma_id",
      op.proforma_id || null
    );

    await storeValue(
      "cp_proforma_no",
      op.proforma_no || null
    );

    await storeValue(
      "cp_cargue_id",
      op.cargue_id || null
    );

    await storeValue(
      "cp_estado_cargue_id",
      op.estado_cargue_id || null
    );

    await storeValue(
      "cp_modalidad_transporte_id",
      op.modalidad_transporte_id || null
    );

    await storeValue(
      "cp_tipo_carga_id",
      op.tipo_carga_id || null
    );

    await storeValue(
      "cp_caracteristica_carga_id",
      op.caracteristica_carga_id || null
    );

    await storeValue(
      "cp_referencia_cliente",
      op.referencia_cliente || null
    );

    await storeValue(
      "cp_total_contenedores_booking",
      Number(op.total_contenedores || 0)
    );

    await storeValue(
      "cp_total_contenedores_confirmados",
      Number(
        op.total_contenedores_confirmados || 0
      )
    );

    await storeValue(
      "cp_total_vehiculos_booking",
      Number(op.total_vehiculos_ter || 0)
    );

    await storeValue(
      "cp_proforma_cantidad_total",
      Number(op.proforma_cantidad_total || 0)
    );

    await storeValue(
      "cp_proforma_peso_neto_total",
      Number(
        op.proforma_peso_neto_total || 0
      )
    );

    await storeValue(
      "cp_proforma_peso_bruto_total",
      Number(
        op.proforma_peso_bruto_total || 0
      )
    );

    await storeValue(
      "cp_proforma_volumen_total",
      Number(
        op.proforma_volumen_total || 0
      )
    );

    await storeValue(
      "cp_vehiculo_selected",
      null
    );

    await storeValue(
      "cp_vehiculo_selected_id",
      null
    );

    await storeValue("cp_delete_context", null);
    await storeValue("cp_update_context", null);

    await storeValue("cp_form_mode", "NEW");
    await storeValue(
      "cp_has_pending_changes",
      false
    );

    await this.clearVehiculoForm();

    try {
      resetWidget("tblCpVehiculos", true);
    } catch (error) {
      console.log(
        "NO SE PUDO REINICIAR tblCpVehiculos:",
        error
      );
    }

    if (
      typeof qCpOperacionResumen !==
        "undefined" &&
      qCpOperacionResumen?.run
    ) {
      await qCpOperacionResumen.run();
    }

    if (
      typeof qCpVehiculosResumen !==
        "undefined" &&
      qCpVehiculosResumen?.run
    ) {
      await qCpVehiculosResumen.run();
    }

    return true;
  },

  markDirty: async () => {
    await storeValue(
      "cp_has_pending_changes",
      true
    );

    return true;
  },

  /*
   * ============================================================
   * LIMPIEZA DE OPERACIÓN
   * ============================================================
   */

  clearOperation: async () => {
    await storeValue("cp_exportacion_id", null);
    await storeValue("cp_operacion_no", null);
    await storeValue("cp_tenant_id", null);

    await storeValue("cp_booking_id", null);
    await storeValue("cp_booking_no", null);

    await storeValue("cp_proforma_id", null);
    await storeValue("cp_proforma_no", null);

    await storeValue("cp_cargue_id", null);

    await storeValue(
      "cp_estado_cargue_id",
      null
    );

    await storeValue(
      "cp_operacion_selected",
      null
    );

    await storeValue(
      "cp_modalidad_transporte_id",
      null
    );

    await storeValue("cp_tipo_carga_id", null);

    await storeValue(
      "cp_caracteristica_carga_id",
      null
    );

    await storeValue(
      "cp_referencia_cliente",
      null
    );

    await storeValue(
      "cp_total_contenedores_booking",
      0
    );

    await storeValue(
      "cp_total_contenedores_confirmados",
      0
    );

    await storeValue(
      "cp_total_vehiculos_booking",
      0
    );

    await storeValue(
      "cp_proforma_cantidad_total",
      0
    );

    await storeValue(
      "cp_proforma_peso_neto_total",
      0
    );

    await storeValue(
      "cp_proforma_peso_bruto_total",
      0
    );

    await storeValue(
      "cp_proforma_volumen_total",
      0
    );

    await storeValue("cp_vehiculos", []);
    await storeValue("cp_contenedores", []);
    await storeValue("cp_sellos", []);
    await storeValue("cp_documentos", []);
    await storeValue("cp_mercancia", []);
    await storeValue("cp_inspecciones", []);

    await storeValue(
      "cp_vehiculo_selected",
      null
    );

    await storeValue(
      "cp_vehiculo_selected_id",
      null
    );

    await storeValue("cp_delete_context", null);
    await storeValue("cp_update_context", null);

    await storeValue("cp_modal_open", false);
    await storeValue("cp_form_mode", "NEW");

    await storeValue(
      "cp_has_pending_changes",
      false
    );

    await this.clearVehiculoForm();

    try {
      resetWidget("tblCpVehiculos", true);
    } catch (error) {
      console.log(
        "NO SE PUDO REINICIAR tblCpVehiculos:",
        error
      );
    }

    return true;
  },

  /*
   * ============================================================
   * DIRECTORIO DE VEHÍCULOS
   * ============================================================
   */

  openDirectorioVehiculoUpdate: async () => {
  try {
    const userContextOk =
      await this.bootstrapUserContext();

    if (!userContextOk) {
      return false;
    }

    let resultadoBusqueda = [];

    if (
      typeof qCpBuscarVehiculoPorPlaca !==
        "undefined" &&
      typeof qCpBuscarVehiculoPorPlaca.run ===
        "function"
    ) {
      resultadoBusqueda =
        await qCpBuscarVehiculoPorPlaca.run();
    }

    const vehiculo =
      resultadoBusqueda?.[0] ||
      qCpBuscarVehiculoPorPlaca.data?.[0] ||
      null;

    const existeVehiculoNormalizado =
      Boolean(
        vehiculo?.vehiculo_id &&
        vehiculo?.tenant_vehiculo_id
      );

    if (existeVehiculoNormalizado) {
      await storeValue(
        "cp_update_context",
        {
          entity: "VEHICULO",
          mode: "UPDATE",

          entity_id:
            vehiculo.vehiculo_id,

          tenant_vehiculo_id:
            vehiculo.tenant_vehiculo_id,

          title:
            "ACTUALIZAR DIRECTORIO DE VEHÍCULOS",

          modulo:
            "CARGUE_PLANTA"
        }
      );

      if (
        typeof qDirVehiculoById !==
          "undefined" &&
        typeof qDirVehiculoById.run ===
          "function"
      ) {
        await qDirVehiculoById.run();
      }
    } else {
      await storeValue(
        "cp_update_context",
        {
          entity: "VEHICULO",
          mode: "CREATE",

          entity_id: null,
          tenant_vehiculo_id: null,

          title:
            "CREAR VEHÍCULO EN DIRECTORIO",

          modulo:
            "CARGUE_PLANTA"
        }
      );
    }

    await storeValue(
      "cp_modal_open",
      true
    );

    showModal(
      "mdlDirectorioUpdate"
    );

    return true;
  } catch (error) {
    console.error(
      "Error abriendo directorio de vehículos:",
      error
    );

    showAlert(
      "No fue posible abrir el directorio de vehículos.",
      "error"
    );

    return false;
  }
},

  openDirectorioVehiculoCreate: async () => {
    const userContextOk =
      await this.bootstrapUserContext();

    if (!userContextOk) {
      return false;
    }

    await storeValue("cp_update_context", {
      entity: "VEHICULO",
      mode: "CREATE",
      entity_id: null,
      title: "CREAR VEHÍCULO EN DIRECTORIO",
      modulo: "CARGUE_PLANTA"
    });

    await storeValue("cp_modal_open", true);

    showModal("mdlDirectorioUpdate");

    return true;
  },

  /*
   * ============================================================
   * DIRECTORIO DE CONDUCTORES
   * ============================================================
   */

  openDirectorioConductorUpdate: async () => {
  const userContextOk =
    await this.bootstrapUserContext();

  if (!userContextOk) {
    return false;
  }

  const conductor =
    qCpBuscarConductorPorDocumento.data?.[0] ||
    null;

  if (conductor?.conductor_id) {
    /*
     * El contexto guarda:
     * - conductor_id: identidad global.
     * - tenant_conductor_id: relación operativa con el tenant.
     */
    await storeValue("cp_update_context", {
      entity: "CONDUCTOR",
      mode: "UPDATE",

      entity_id:
        conductor.conductor_id,

      tenant_conductor_id:
        conductor.tenant_conductor_id || null,

      title:
        "ACTUALIZAR DIRECTORIO DE CONDUCTORES",

      modulo: "CARGUE_PLANTA"
    });

    if (
      typeof qDirConductorById !==
        "undefined" &&
      qDirConductorById?.run
    ) {
      await qDirConductorById.run();
    }
  } else {
    await storeValue("cp_update_context", {
      entity: "CONDUCTOR",
      mode: "CREATE",

      entity_id: null,
      tenant_conductor_id: null,

      title:
        "CREAR CONDUCTOR EN DIRECTORIO",

      modulo: "CARGUE_PLANTA"
    });
  }

  await storeValue("cp_modal_open", true);

  showModal("mdlDirectorioUpdate");

  return true;
},
	
  openDirectorioConductorCreate: async () => {
    const userContextOk =
      await this.bootstrapUserContext();

    if (!userContextOk) {
      return false;
    }

    await storeValue("cp_update_context", {
      entity: "CONDUCTOR",
      mode: "CREATE",
      entity_id: null,
      title:
        "CREAR CONDUCTOR EN DIRECTORIO",
      modulo: "CARGUE_PLANTA"
    });

    await storeValue("cp_modal_open", true);

    showModal("mdlDirectorioUpdate");

    return true;
  },

  /*
   * ============================================================
   * MODAL DE DIRECTORIOS
   * ============================================================
   */

  clearDirectorioUpdateModal: async () => {
    await storeValue("cp_modal_open", false);
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

  closeDirectorioUpdateModal: async () => {
    closeModal("mdlDirectorioUpdate");

    await this.clearDirectorioUpdateModal();

    return true;
  },

  /*
   * ============================================================
   * EDICIÓN DE VEHÍCULO / VIAJE
   * ============================================================
   */

  editVehiculoViaje: async () => {
    if (!appsmith.store.cp_exportacion_id) {
      showAlert(
        "SELECCIONE UNA OPERACIÓN.",
        "warning"
      );
      return false;
    }

    const row =
      appsmith.store.cp_vehiculo_selected ||
      tblCpVehiculos.selectedRow ||
      null;

    const rowId =
      row?.cargue_vehiculo_id ||
      row?.id ||
      appsmith.store.cp_vehiculo_selected_id ||
      null;

    if (!row || !rowId) {
      showAlert(
        "SELECCIONE UN VIAJE EN LA TABLA.",
        "warning"
      );
      return false;
    }

    if (
      row.exportacion_id &&
      row.exportacion_id !==
        appsmith.store.cp_exportacion_id
    ) {
      showAlert(
        "EL VIAJE SELECCIONADO NO PERTENECE A LA OPERACIÓN ACTIVA.",
        "error"
      );
      return false;
    }

    await storeValue(
      "cp_vehiculo_selected",
      row
    );

    await storeValue(
      "cp_vehiculo_selected_id",
      rowId
    );

    await storeValue(
      "cp_vehiculo_edit_id",
      rowId
    );

    await storeValue("cp_form_mode", "EDIT");

    await this.loadVehiculoViaje(row);

    await storeValue(
      "cp_has_pending_changes",
      false
    );

    showAlert(
      "VIAJE CARGADO PARA EDICIÓN.",
      "info"
    );

    return true;
  },
	
  duplicateVehiculoViaje: async () => {
    if (!appsmith.store.cp_exportacion_id) {
    showAlert("SELECCIONE UNA OPERACIÓN.", "warning");
    return false;
  }

  const row =
    appsmith.store.cp_vehiculo_selected ||
    tblCpVehiculos.selectedRow ||
    null;

  const rowId =
    row?.cargue_vehiculo_id ||
    row?.id ||
    appsmith.store.cp_vehiculo_selected_id ||
    null;

  if (!row || !rowId) {
    showAlert(
      "SELECCIONE UN VEHÍCULO / VIAJE EN LA TABLA.",
      "warning"
    );
    return false;
  }

  if (
    row.exportacion_id &&
    row.exportacion_id !== appsmith.store.cp_exportacion_id
  ) {
    showAlert(
      "EL VIAJE SELECCIONADO NO PERTENECE A LA OPERACIÓN ACTIVA.",
      "error"
    );
    return false;
  }

  /*
   * Conservamos temporalmente la fila fuente para trazabilidad
   * visual, pero eliminamos cualquier identificador editable.
   */
  await storeValue("cp_duplicate_source", {
    cargue_vehiculo_id: rowId,
    item_no: row.item_no || null,
    viaje_no: row.viaje_no || null,
    placa: row.placa || null
  });

  await storeValue("cp_form_mode", "DUPLICATE");

  /*
   * El nuevo registro todavía no existe.
   */
  await storeValue("cp_vehiculo_edit_id", null);
  await storeValue("cp_vehiculo_edit_index", null);

  await storeValue("cp_vehiculo_selected", null);
  await storeValue("cp_vehiculo_selected_id", null);

  /*
   * Copiamos únicamente el encabezado operativo.
   */
  await this.loadVehiculoViaje(row);

  /*
   * Garantizamos que información operativa hija no se replique.
   */
  await storeValue("cp_ui_peso_neto_cargado_kg", "");
  await storeValue("cp_ui_peso_bruto_cargado_kg", "");
  await storeValue("cp_ui_volumen_cargado_cbm", "");

  await storeValue("cp_has_pending_changes", false);

  try {
    resetWidget("tblCpVehiculos", true);
  } catch (error) {
    console.log(
      "NO SE PUDO LIMPIAR LA SELECCIÓN DE tblCpVehiculos:",
      error
    );
  }

  showAlert(
    "VIAJE COPIADO AL FORMULARIO. REVISE LOS DATOS Y PULSE GUARDAR PARA CREAR EL NUEVO VIAJE.",
    "info"
  );

  return true;
},
	
  loadVehiculoViaje: async rowParam => {
  const row =
    rowParam ||
    appsmith.store.cp_vehiculo_selected ||
    null;

  if (!row) {
    showAlert(
      "NO EXISTEN DATOS DEL VIAJE PARA CARGAR.",
      "warning"
    );
    return false;
  }

  /*
   * 1. CARGAR CATÁLOGOS NECESARIOS
   */

  try {
    if (
      typeof q_tipo_vehiculo_ter_drop !== "undefined" &&
      q_tipo_vehiculo_ter_drop?.run
    ) {
      await q_tipo_vehiculo_ter_drop.run();
    }

    if (
      typeof qCpTiposRemolqueDropdown !== "undefined" &&
      qCpTiposRemolqueDropdown?.run
    ) {
      await qCpTiposRemolqueDropdown.run();
    }

    if (
      typeof qCpMarcasVehiculoDropdown !== "undefined" &&
      qCpMarcasVehiculoDropdown?.run
    ) {
      await qCpMarcasVehiculoDropdown.run();
    }

    if (
      typeof qCpColoresVehiculoDropdown !== "undefined" &&
      qCpColoresVehiculoDropdown?.run
    ) {
      await qCpColoresVehiculoDropdown.run();
    }
  } catch (error) {
    console.error(
      "ERROR AL CARGAR CATÁLOGOS DE VEHÍCULO:",
      error
    );

    showAlert(
      "NO SE PUDIERON CARGAR LOS CATÁLOGOS DEL VEHÍCULO.",
      "error"
    );

    return false;
  }

  /*
   * 2. GUARDAR SNAPSHOT DEL VIAJE EN STORES
   */

  await storeValue(
    "cp_ui_veh_placa",
    row.placa || ""
  );

  await storeValue(
    "cp_ui_veh_tipo_vehiculo_id",
    row.tipo_vehiculo_terrestre_id ||
      row.tipo_vehiculo_id ||
      ""
  );

  await storeValue(
    "cp_ui_veh_tipo_remolque_id",
    row.tipo_remolque_catalogo_id ||
      row.tipo_remolque_id ||
      ""
  );

  await storeValue(
    "cp_ui_veh_placa_remolque",
    row.placa_remolque || ""
  );

  await storeValue(
    "cp_ui_veh_marca",
    row.marca_vehiculo ||
      row.marca ||
      ""
  );

  await storeValue(
    "cp_ui_veh_modelo",
    row.modelo_vehiculo ||
      row.modelo ||
      ""
  );

  await storeValue(
    "cp_ui_veh_color",
    row.color_vehiculo ||
      row.color ||
      ""
  );

  await storeValue(
    "cp_ui_veh_capacidad_kg",
    row.capacidad_carga_kg ?? ""
  );

  await storeValue(
    "cp_ui_veh_soat_no",
    row.soat_no || ""
  );

  await storeValue(
    "cp_ui_veh_soat_vencimiento",
    row.soat_vencimiento || ""
  );

  await storeValue(
    "cp_ui_cond_documento",
    row.conductor_documento || ""
  );

  await storeValue(
    "cp_ui_cond_nombre",
    row.conductor_nombre || ""
  );

  await storeValue(
    "cp_ui_cond_licencia",
    row.conductor_licencia || ""
  );

  await storeValue(
    "cp_ui_cond_telefono",
    row.conductor_telefono || ""
  );

  await storeValue(
    "cp_ui_cond_estado",
    row.conductor_estado || ""
  );

  /*
   * 3. REINICIAR WIDGETS PARA REEVALUAR DEFAULT VALUES
   */

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
},

  clearVehiculoEditStores: async () => {
    await storeValue("cp_ui_veh_placa", "");

    await storeValue(
      "cp_ui_veh_tipo_vehiculo_id",
      ""
    );

    await storeValue(
      "cp_ui_veh_tipo_remolque_id",
      ""
    );

    await storeValue(
      "cp_ui_veh_placa_remolque",
      ""
    );

    await storeValue("cp_ui_veh_marca", "");
    await storeValue("cp_ui_veh_modelo", "");
    await storeValue("cp_ui_veh_color", "");

    await storeValue(
      "cp_ui_veh_capacidad_kg",
      ""
    );

    await storeValue("cp_ui_veh_soat_no", "");

    await storeValue(
      "cp_ui_veh_soat_vencimiento",
      ""
    );

    await storeValue(
      "cp_ui_cond_documento",
      ""
    );

    await storeValue("cp_ui_cond_nombre", "");

    await storeValue(
      "cp_ui_cond_licencia",
      ""
    );

    await storeValue(
      "cp_ui_cond_telefono",
      ""
    );

    await storeValue(
      "cp_ui_cond_estado",
      ""
    );

    return true;
  },

  cancelVehiculoEdit: async () => {
    await storeValue("cp_form_mode", "NEW");

    await storeValue(
      "cp_vehiculo_edit_id",
      null
    );

    await storeValue(
      "cp_vehiculo_selected",
      null
    );

    await storeValue(
      "cp_vehiculo_selected_id",
      null
    );

    await storeValue(
      "cp_has_pending_changes",
      false
    );

    await this.clearVehiculoForm();

    try {
      resetWidget("tblCpVehiculos", true);
    } catch (error) {
      console.log(
        "NO SE PUDO LIMPIAR LA SELECCIÓN DE tblCpVehiculos:",
        error
      );
    }

    return true;
  },

  /*
   * ============================================================
   * LIMPIEZA DEL FORMULARIO VEHÍCULO / VIAJE
   * ============================================================
   */

  clearVehiculoForm: async () => {
    await this.clearVehiculoEditStores();

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

    await storeValue(
      "cp_vehiculo_edit_id",
      null
    );

    await storeValue(
      "cp_vehiculo_edit_index",
      null
    );

    return true;
  },
cancelVehiculoForm: async () => {
  /*
   * Cancela cualquier estado:
   * NEW, EDIT, selección residual o datos parciales.
   */

  await storeValue("cp_form_mode", "NEW");
  await storeValue("cp_has_pending_changes", false);

  await storeValue("cp_vehiculo_edit_id", null);
  await storeValue("cp_vehiculo_edit_index", null);

  await storeValue("cp_vehiculo_selected", null);
  await storeValue("cp_vehiculo_selected_id", null);

  await storeValue("cp_delete_context", null);
  await storeValue("cp_update_context", null);
	await storeValue("cp_duplicate_source", null);

  /*
   * Limpia stores intermedios usados para edición.
   */
  await this.clearVehiculoEditStores();

  /*
   * Limpia los widgets del formulario.
   */
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

  /*
   * Limpia selección visual de la tabla.
   */
  try {
    resetWidget("tblCpVehiculos", true);
  } catch (error) {
    console.log(
      "NO SE PUDO LIMPIAR LA SELECCIÓN DE tblCpVehiculos:",
      error
    );
  }

  /*
   * Las queries conservan su última respuesta; se ejecutan con
   * controles vacíos para que dejen de alimentar Default Values.
   */
  try {
    if (qCpBuscarVehiculoPorPlaca?.run) {
      await qCpBuscarVehiculoPorPlaca.run();
    }
  } catch (error) {
    console.log(
      "NO SE PUDO LIMPIAR qCpBuscarVehiculoPorPlaca:",
      error
    );
  }

  try {
    if (qCpBuscarConductorPorDocumento?.run) {
      await qCpBuscarConductorPorDocumento.run();
    }
  } catch (error) {
    console.log(
      "NO SE PUDO LIMPIAR qCpBuscarConductorPorDocumento:",
      error
    );
  }

  /*
   * Segundo reset: necesario porque las queries pueden haber
   * provocado una nueva evaluación de los Default Values.
   */
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
},
	newVehiculoViaje: async () => {
  if (!appsmith.store.cp_exportacion_id) {
    showAlert(
      "SELECCIONE UNA OPERACIÓN.",
      "warning"
    );
    return false;
  }

  /*
   * Limpia por completo cualquier estado anterior:
   * EDIT, DUPLICATE, selección o datos parciales.
   */
  await this.cancelVehiculoForm();

  /*
   * Reafirma el modo nuevo.
   */
  await storeValue("cp_form_mode", "NEW");
  await storeValue("cp_has_pending_changes", false);

  await storeValue("cp_vehiculo_edit_id", null);
  await storeValue("cp_vehiculo_edit_index", null);

  await storeValue("cp_vehiculo_selected", null);
  await storeValue("cp_vehiculo_selected_id", null);

  await storeValue("cp_duplicate_source", null);

  await storeValue("cp_delete_context", null);
  await storeValue("cp_update_context", null);

  /*
   * Limpia una vez más la selección visual de la tabla.
   */
  try {
    resetWidget("tblCpVehiculos", true);
  } catch (error) {
    console.log(
      "NO SE PUDO LIMPIAR tblCpVehiculos AL INICIAR NUEVO VIAJE:",
      error
    );
  }

  return true;
},
	syncVehiculoDirectorioToForm: async () => {
  const vehiculo =
    qCpBuscarVehiculoPorPlaca.data?.[0] || null;

  if (!vehiculo?.vehiculo_id) {
    showAlert(
      "NO SE ENCONTRÓ EL VEHÍCULO ACTUALIZADO EN EL DIRECTORIO.",
      "warning"
    );
    return false;
  }

  await storeValue(
    "cp_ui_veh_placa",
    vehiculo.placa || ""
  );

  await storeValue(
    "cp_ui_veh_tipo_vehiculo_id",
    vehiculo.tipo_vehiculo_terrestre_id || ""
  );

  await storeValue(
    "cp_ui_veh_marca",
    vehiculo.marca || ""
  );

  await storeValue(
    "cp_ui_veh_modelo",
    vehiculo.modelo || ""
  );

  await storeValue(
    "cp_ui_veh_color",
    vehiculo.color || ""
  );

  await storeValue(
    "cp_ui_veh_capacidad_kg",
    vehiculo.capacidad_carga_kg ?? ""
  );

  await storeValue(
    "cp_ui_veh_soat_no",
    vehiculo.soat_no || ""
  );

  await storeValue(
    "cp_ui_veh_soat_vencimiento",
    vehiculo.soat_vencimiento || ""
  );

  await JS_FormUtils.resetWidgetsSafe([
    "inpCpPlaca",
    "slCpTipoVehiculo",
    "slCpMarcaVehiculo",
    "inpCpModeloVehiculo",
    "slCpColorVehiculo",
    "inpCpCapacidadCargaKg",
    "inpCpSoatNo",
    "dpCpSoatVencimiento"
  ]);

  await storeValue(
    "cp_has_pending_changes",
    true
  );

  return true;
},

syncConductorDirectorioToForm: async () => {
  const conductor =
    qCpBuscarConductorPorDocumento.data?.[0] || null;

  if (!conductor?.conductor_id) {
    showAlert(
      "NO SE ENCONTRÓ EL CONDUCTOR ACTUALIZADO EN EL DIRECTORIO.",
      "warning"
    );
    return false;
  }

  await storeValue(
    "cp_ui_cond_documento",
    conductor.numero_documento || ""
  );

  await storeValue(
    "cp_ui_cond_nombre",
    conductor.nombre_completo || ""
  );

  await storeValue(
    "cp_ui_cond_licencia",
    conductor.numero_licencia || ""
  );

  await storeValue(
    "cp_ui_cond_telefono",
    conductor.telefono || ""
  );

  await storeValue(
    "cp_ui_cond_estado",
    conductor.estado_conductor || ""
  );

  await JS_FormUtils.resetWidgetsSafe([
    "inpCpCedulaConductor",
    "inpCpNombreConductor",
    "inpCpLicenciaConductor",
    "inpCpTelefonoConductor"
  ]);

  await storeValue(
    "cp_has_pending_changes",
    true
  );

  return true;
}
};
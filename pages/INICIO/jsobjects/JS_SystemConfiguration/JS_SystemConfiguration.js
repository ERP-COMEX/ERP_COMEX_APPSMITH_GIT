export default {

  /**
   * Inicializa la configuración centralizada del ERP.
   *
   * Flujo:
   * 1. Marca la configuración como no lista.
   * 2. Limpia errores anteriores.
   * 3. Ejecuta qPlatformConfiguration.
   * 4. Normaliza la respuesta JSON/JSONB.
   * 5. Valida el ambiente y los bloques obligatorios.
   * 6. Guarda la configuración en appsmith.store.
   * 7. Marca la configuración como lista.
   */
  async init() {
    try {
      await storeValue(
        "platform_config_ready",
        false,
        false
      );

      await storeValue(
        "platform_config_error",
        null,
        false
      );

      const response =
        await qPlatformConfiguration.run();

      const row =
        Array.isArray(response) && response.length > 0
          ? response[0]
          : (
              Array.isArray(qPlatformConfiguration.data) &&
              qPlatformConfiguration.data.length > 0
                ? qPlatformConfiguration.data[0]
                : null
            );

      if (!row) {
        throw new Error(
          "La consulta de configuración no devolvió registros."
        );
      }

      const rawConfiguration =
        row.application_configuration;

      const configuration =
        this.parseConfiguration(rawConfiguration);

      if (!configuration) {
        throw new Error(
          "La configuración recibida no tiene un formato válido."
        );
      }

      if (configuration.ready !== true) {
        throw new Error(
          configuration.error ||
          "La plataforma indicó que la configuración no está lista."
        );
      }

      if (!configuration.environment?.id) {
        throw new Error(
          "La configuración no contiene el identificador del ambiente."
        );
      }

      if (!configuration.environment?.code) {
        throw new Error(
          "La configuración no contiene el código del ambiente."
        );
      }

      const settings =
        configuration.settings &&
        typeof configuration.settings === "object"
          ? configuration.settings
          : {};

      const features =
        configuration.features &&
        typeof configuration.features === "object"
          ? configuration.features
          : {};

      const parameters =
        configuration.parameters &&
        typeof configuration.parameters === "object"
          ? configuration.parameters
          : {};

      const integrations =
        configuration.integrations &&
        typeof configuration.integrations === "object"
          ? configuration.integrations
          : {};

      const storage =
        configuration.storage &&
        typeof configuration.storage === "object"
          ? configuration.storage
          : {};

      const counts =
        configuration.counts &&
        typeof configuration.counts === "object"
          ? configuration.counts
          : {};

      /*
       * Objeto completo.
       */
      await storeValue(
        "platform_configuration",
        configuration,
        false
      );

      /*
       * Estado general.
       */
      await storeValue(
        "platform_config_environment",
        configuration.environment,
        false
      );

      await storeValue(
        "platform_config_environment_id",
        configuration.environment.id,
        false
      );

      await storeValue(
        "platform_config_environment_code",
        configuration.environment.code,
        false
      );

      await storeValue(
        "platform_config_environment_name",
        configuration.environment.name || "",
        false
      );

      await storeValue(
        "platform_config_environment_type",
        configuration.environment.type || "",
        false
      );

      await storeValue(
        "platform_config_deployment_provider",
        configuration.environment.deployment_provider || "",
        false
      );

      await storeValue(
        "platform_config_frontend_platform",
        configuration.environment.frontend_platform || "",
        false
      );

      await storeValue(
        "platform_config_is_production",
        configuration.environment.is_production === true,
        false
      );

      await storeValue(
        "platform_config_maintenance_mode",
        configuration.environment.maintenance_mode === true,
        false
      );

      await storeValue(
        "platform_config_debug_enabled",
        configuration.environment.debug_enabled === true,
        false
      );

      await storeValue(
        "platform_config_version",
        Number(
          configuration.environment.config_version || 1
        ),
        false
      );

      /*
       * Bloques funcionales.
       */
      await storeValue(
        "platform_config_settings",
        settings,
        false
      );

      await storeValue(
        "platform_config_settings_metadata",
        Array.isArray(configuration.settings_metadata)
          ? configuration.settings_metadata
          : [],
        false
      );

      await storeValue(
        "platform_config_features",
        features,
        false
      );

      await storeValue(
        "platform_config_features_metadata",
        Array.isArray(configuration.features_metadata)
          ? configuration.features_metadata
          : [],
        false
      );

      await storeValue(
        "platform_config_parameters",
        parameters,
        false
      );

      await storeValue(
        "platform_config_parameters_metadata",
        Array.isArray(configuration.parameters_metadata)
          ? configuration.parameters_metadata
          : [],
        false
      );

      await storeValue(
        "platform_config_integrations",
        integrations,
        false
      );

      await storeValue(
        "platform_config_storage",
        storage,
        false
      );

      await storeValue(
        "platform_config_counts",
        counts,
        false
      );

      await storeValue(
        "platform_config_loaded_at",
        configuration.loaded_at ||
        new Date().toISOString(),
        false
      );

      await storeValue(
        "platform_config_ready",
        true,
        false
      );

      await storeValue(
        "platform_config_error",
        null,
        false
      );

      return {
        ok: true,
        configuration: this.getCurrent()
      };

    } catch (error) {
      const message =
        error?.message ||
        "No fue posible inicializar la configuración del ERP.";

      await storeValue(
        "platform_config_ready",
        false,
        false
      );

      await storeValue(
        "platform_config_error",
        message,
        false
      );

      showAlert(message, "error");

      return {
        ok: false,
        error: message,
        configuration: this.getCurrent()
      };
    }
  },


  /**
   * Convierte la respuesta de Supabase/Appsmith en objeto.
   * Soporta JSONB interpretado o texto JSON.
   */
  parseConfiguration(value) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return null;
      }
    }

    return null;
  },


  /**
   * Devuelve toda la configuración vigente.
   */
  getCurrent() {
    return {
      ready:
        appsmith.store.platform_config_ready === true,

      environment:
        appsmith.store.platform_config_environment || null,

      settings:
        appsmith.store.platform_config_settings || {},

      settings_metadata:
        Array.isArray(
          appsmith.store.platform_config_settings_metadata
        )
          ? appsmith.store.platform_config_settings_metadata
          : [],

      features:
        appsmith.store.platform_config_features || {},

      features_metadata:
        Array.isArray(
          appsmith.store.platform_config_features_metadata
        )
          ? appsmith.store.platform_config_features_metadata
          : [],

      parameters:
        appsmith.store.platform_config_parameters || {},

      parameters_metadata:
        Array.isArray(
          appsmith.store.platform_config_parameters_metadata
        )
          ? appsmith.store.platform_config_parameters_metadata
          : [],

      integrations:
        appsmith.store.platform_config_integrations || {},

      storage:
        appsmith.store.platform_config_storage || {},

      counts:
        appsmith.store.platform_config_counts || {},

      loaded_at:
        appsmith.store.platform_config_loaded_at || null,

      error:
        appsmith.store.platform_config_error || null
    };
  },


  /**
   * Indica si la configuración está completa y utilizable.
   */
  isReady() {
    return (
      appsmith.store.platform_config_ready === true &&
      Boolean(
        appsmith.store.platform_config_environment_id
      ) &&
      Boolean(
        appsmith.store.platform_config_environment_code
      ) &&
      !appsmith.store.platform_config_error
    );
  },


  /**
   * Obtiene una configuración general por su clave.
   *
   * Ejemplo:
   * JS_SystemConfiguration.getSetting("app.name")
   */
  getSetting(settingKey, defaultValue = null) {
    const key =
      String(settingKey || "").trim().toLowerCase();

    if (!key) {
      return defaultValue;
    }

    const settings =
      appsmith.store.platform_config_settings || {};

    return Object.prototype.hasOwnProperty.call(
      settings,
      key
    )
      ? settings[key]
      : defaultValue;
  },


  /**
   * Obtiene un parámetro operativo por su clave.
   *
   * Ejemplo:
   * JS_SystemConfiguration.getParameter(
   *   "pagination.default_page_size",
   *   25
   * )
   */
  getParameter(parameterKey, defaultValue = null) {
    const key =
      String(parameterKey || "").trim().toLowerCase();

    if (!key) {
      return defaultValue;
    }

    const parameters =
      appsmith.store.platform_config_parameters || {};

    return Object.prototype.hasOwnProperty.call(
      parameters,
      key
    )
      ? parameters[key]
      : defaultValue;
  },


  /**
   * Obtiene la configuración completa de una feature.
   */
  getFeature(featureCode) {
    const code =
      String(featureCode || "").trim().toLowerCase();

    if (!code) {
      return null;
    }

    const features =
      appsmith.store.platform_config_features || {};

    return features[code] || null;
  },


  /**
   * Indica si una funcionalidad está habilitada.
   *
   * Esta validación NO reemplaza permisos ni RLS.
   */
  isFeatureEnabled(featureCode) {
    const feature =
      this.getFeature(featureCode);

    return feature?.enabled === true;
  },


  /**
   * Obtiene la configuración no secreta de una integración.
   */
  getIntegration(integrationCode) {
    const code =
      String(integrationCode || "").trim().toLowerCase();

    if (!code) {
      return null;
    }

    const integrations =
      appsmith.store.platform_config_integrations || {};

    return integrations[code] || null;
  },


  /**
   * Indica si una integración está habilitada.
   */
  isIntegrationEnabled(integrationCode) {
    const integration =
      this.getIntegration(integrationCode);

    return integration?.enabled === true;
  },


  /**
   * Obtiene la configuración de una ubicación de Storage.
   */
  getStorage(storageCode) {
    const code =
      String(storageCode || "").trim().toLowerCase();

    if (!code) {
      return null;
    }

    const storage =
      appsmith.store.platform_config_storage || {};

    return storage[code] || null;
  },


  /**
   * Indica si una ubicación de Storage está habilitada.
   */
  isStorageEnabled(storageCode) {
    const storageLocation =
      this.getStorage(storageCode);

    return storageLocation?.enabled === true;
  },


  /**
   * Devuelve información resumida del ambiente.
   */
  getEnvironment() {
    return (
      appsmith.store.platform_config_environment ||
      null
    );
  },


  /**
   * Indica si el ambiente actual es producción.
   */
  isProduction() {
    return (
      appsmith.store.platform_config_is_production === true
    );
  },


  /**
   * Indica si el ERP está en mantenimiento.
   */
  isMaintenanceMode() {
    return (
      appsmith.store.platform_config_maintenance_mode === true
    );
  },


  /**
   * Limpia toda la configuración almacenada.
   */
  async clear() {
    const keys = [
      "platform_configuration",
      "platform_config_ready",
      "platform_config_error",
      "platform_config_environment",
      "platform_config_environment_id",
      "platform_config_environment_code",
      "platform_config_environment_name",
      "platform_config_environment_type",
      "platform_config_deployment_provider",
      "platform_config_frontend_platform",
      "platform_config_is_production",
      "platform_config_maintenance_mode",
      "platform_config_debug_enabled",
      "platform_config_version",
      "platform_config_settings",
      "platform_config_settings_metadata",
      "platform_config_features",
      "platform_config_features_metadata",
      "platform_config_parameters",
      "platform_config_parameters_metadata",
      "platform_config_integrations",
      "platform_config_storage",
      "platform_config_counts",
      "platform_config_loaded_at"
    ];

    for (const key of keys) {
      await removeValue(key);
    }

    return {
      ok: true
    };
  }

};
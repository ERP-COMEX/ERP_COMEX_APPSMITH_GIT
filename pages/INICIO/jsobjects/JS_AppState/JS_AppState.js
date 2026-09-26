export default {

  /**
   * Inicializa el estado global básico de la aplicación.
   *
   * No carga identidad, permisos ni configuración del ambiente.
   * Esas responsabilidades pertenecen a:
   * - JS_SystemConfiguration
   * - JS_SessionContext
   * - JS_Permissions
   */
  async init() {
    const values = {
      platform_app_ready: false,
      platform_app_initializing: true,
      platform_app_loading: true,

      platform_app_error: null,
      platform_app_warning: null,

      platform_app_online:
        typeof navigator !== "undefined"
          ? navigator.onLine !== false
          : true,

      /*
       * Se completan después de cargar JS_SystemConfiguration.
       */
      platform_app_environment: null,
      platform_app_debug: false,
      platform_app_maintenance: false,

      platform_app_initialized_at: null,
      platform_app_last_activity_at:
        new Date().toISOString()
    };

    for (const [key, value] of Object.entries(values)) {
      await storeValue(key, value, false);
    }

    return {
      ok: true,
      state: this.getCurrent()
    };
  },


  /**
   * Sincroniza el estado global con la configuración
   * centralizada del ambiente.
   */
  async applySystemConfiguration() {
    try {
      if (!JS_SystemConfiguration.isReady()) {
        throw new Error(
          "La configuración del sistema no está lista para sincronizar el estado global."
        );
      }

      const environment =
        JS_SystemConfiguration.getEnvironment();

      if (!environment?.code) {
        throw new Error(
          "La configuración no contiene un código de ambiente válido."
        );
      }

      await storeValue(
        "platform_app_environment",
        environment.code,
        false
      );

      await storeValue(
        "platform_app_debug",
        environment.debug_enabled === true,
        false
      );

      await storeValue(
        "platform_app_maintenance",
        environment.maintenance_mode === true,
        false
      );

      await storeValue(
        "platform_app_last_activity_at",
        new Date().toISOString(),
        false
      );

      return {
        ok: true,
        state: this.getCurrent()
      };

    } catch (error) {
      const message =
        error?.message ||
        "No fue posible sincronizar la configuración con el estado global.";

      await this.markError(message);

      return {
        ok: false,
        error: message,
        state: this.getCurrent()
      };
    }
  },


  /**
   * Marca la aplicación como completamente lista.
   */
  async markReady() {
    const now = new Date().toISOString();

    await storeValue(
      "platform_app_initializing",
      false,
      false
    );

    await storeValue(
      "platform_app_loading",
      false,
      false
    );

    await storeValue(
      "platform_app_ready",
      true,
      false
    );

    await storeValue(
      "platform_app_error",
      null,
      false
    );

    await storeValue(
      "platform_app_initialized_at",
      now,
      false
    );

    await storeValue(
      "platform_app_last_activity_at",
      now,
      false
    );

    return {
      ok: true,
      state: this.getCurrent()
    };
  },


  /**
   * Marca la aplicación como no lista por un error.
   */
  async markError(message) {
    const normalizedMessage =
      String(
        message ||
        "Error no identificado al iniciar la aplicación."
      ).trim();

    await storeValue(
      "platform_app_ready",
      false,
      false
    );

    await storeValue(
      "platform_app_initializing",
      false,
      false
    );

    await storeValue(
      "platform_app_loading",
      false,
      false
    );

    await storeValue(
      "platform_app_error",
      normalizedMessage,
      false
    );

    await storeValue(
      "platform_app_last_activity_at",
      new Date().toISOString(),
      false
    );

    return {
      ok: false,
      error: normalizedMessage,
      state: this.getCurrent()
    };
  },


  /**
   * Activa o desactiva el estado general de carga.
   */
  async setLoading(value) {
    const loading =
      value === true;

    await storeValue(
      "platform_app_loading",
      loading,
      false
    );

    await storeValue(
      "platform_app_last_activity_at",
      new Date().toISOString(),
      false
    );

    return loading;
  },


  /**
   * Registra una advertencia no bloqueante.
   */
  async setWarning(message) {
    const normalizedMessage =
      message === null ||
      message === undefined
        ? null
        : String(message).trim() || null;

    await storeValue(
      "platform_app_warning",
      normalizedMessage,
      false
    );

    return normalizedMessage;
  },


  /**
   * Actualiza la marca de actividad de la aplicación.
   */
  async touch() {
    const now =
      new Date().toISOString();

    await storeValue(
      "platform_app_last_activity_at",
      now,
      false
    );

    return now;
  },


  /**
   * Devuelve el estado global actual.
   */
  getCurrent() {
    return {
      ready:
        appsmith.store.platform_app_ready === true,

      initializing:
        appsmith.store.platform_app_initializing === true,

      loading:
        appsmith.store.platform_app_loading === true,

      online:
        appsmith.store.platform_app_online !== false,

      environment:
        appsmith.store.platform_app_environment || null,

      debug:
        appsmith.store.platform_app_debug === true,

      maintenance:
        appsmith.store.platform_app_maintenance === true,

      initialized_at:
        appsmith.store.platform_app_initialized_at || null,

      last_activity_at:
        appsmith.store.platform_app_last_activity_at || null,

      warning:
        appsmith.store.platform_app_warning || null,

      error:
        appsmith.store.platform_app_error || null
    };
  },


  /**
   * Indica si la aplicación está lista para operar.
   */
  isReady() {
    return (
      appsmith.store.platform_app_ready === true &&
      appsmith.store.platform_app_initializing !== true &&
      appsmith.store.platform_app_loading !== true &&
      appsmith.store.platform_app_maintenance !== true &&
      appsmith.store.platform_app_error == null
    );
  },


  /**
   * Limpia únicamente las claves administradas por JS_AppState.
   */
  async clear() {
    const keys = [
      "platform_app_ready",
      "platform_app_initializing",
      "platform_app_loading",
      "platform_app_error",
      "platform_app_warning",
      "platform_app_online",
      "platform_app_environment",
      "platform_app_debug",
      "platform_app_maintenance",
      "platform_app_initialized_at",
      "platform_app_last_activity_at"
    ];

    for (const key of keys) {
      await removeValue(key);
    }

    return {
      ok: true
    };
  }

};
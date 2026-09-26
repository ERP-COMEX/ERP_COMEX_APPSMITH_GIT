export default {

  /**
   * Inicializa coordinadamente el núcleo global del ERP.
   *
   * Orden:
   * 1. Estado global de la aplicación.
   * 2. Configuración centralizada del ambiente.
   * 3. Contexto organizacional del usuario.
   * 4. Permisos efectivos.
   * 5. Validaciones finales.
   * 6. Aplicación lista.
   */
  async init() {
    try {

      // --------------------------------------------------------
      // 1. Estado global
      // --------------------------------------------------------

      const stateResult =
        await JS_AppState.init();

      if (!stateResult?.ok) {
        throw new Error(
          stateResult?.error ||
          "No fue posible inicializar el estado global de la aplicación."
        );
      }


      // --------------------------------------------------------
      // 2. Configuración centralizada
      // --------------------------------------------------------

      const configurationResult =
        await JS_SystemConfiguration.init();

      if (!configurationResult?.ok) {
        throw new Error(
          configurationResult?.error ||
          "No fue posible inicializar la configuración centralizada del ERP."
        );
      }

      if (!JS_SystemConfiguration.isReady()) {
        throw new Error(
          "La configuración centralizada no quedó lista después de la inicialización."
        );
      }

      const environment =
        JS_SystemConfiguration.getEnvironment();

      if (!environment?.code) {
        throw new Error(
          "No fue posible determinar el ambiente actual del ERP."
        );
      }

    if (JS_SystemConfiguration.isMaintenanceMode()) {
  throw new Error(
    "El ERP se encuentra temporalmente en modo mantenimiento."
  );
}

// --------------------------------------------------------
// Sincronizar AppState con la configuración del ambiente
// --------------------------------------------------------

const applyConfigurationResult =
  await JS_AppState.applySystemConfiguration();

if (!applyConfigurationResult?.ok) {
  throw new Error(
    applyConfigurationResult?.error ||
    "No fue posible sincronizar el estado global con el ambiente actual."
  );
}

      // --------------------------------------------------------
      // 3. Contexto organizacional
      // --------------------------------------------------------

      const sessionResult =
        await JS_SessionContext.init();

      if (!sessionResult?.ok) {
        throw new Error(
          sessionResult?.error ||
          "No fue posible inicializar el contexto organizacional."
        );
      }

      if (!JS_SessionContext.isReady()) {
        throw new Error(
          "El contexto organizacional no quedó listo después de la inicialización."
        );
      }


      // --------------------------------------------------------
      // 4. Permisos efectivos
      // --------------------------------------------------------

      const permissionsResult =
        await JS_Permissions.init();

      if (!permissionsResult?.ok) {
        throw new Error(
          permissionsResult?.error ||
          "No fue posible inicializar los permisos efectivos."
        );
      }

      if (!JS_Permissions.isReady()) {
        throw new Error(
          "Los permisos efectivos no quedaron listos después de la inicialización."
        );
      }


      // --------------------------------------------------------
      // 5. Validaciones finales
      // --------------------------------------------------------

      const session =
        JS_SessionContext.getCurrent();

      if (session?.effective_access !== true) {
        throw new Error(
          "El usuario no tiene acceso organizacional efectivo al ERP."
        );
      }

      const configuration =
        JS_SystemConfiguration.getCurrent();

      if (configuration?.ready !== true) {
        throw new Error(
          "La configuración del ERP no está disponible."
        );
      }


      // --------------------------------------------------------
      // 6. Aplicación lista
      // --------------------------------------------------------

      const readyResult =
        await JS_AppState.markReady();

      if (!readyResult?.ok) {
        throw new Error(
          readyResult?.error ||
          "No fue posible marcar la aplicación como lista."
        );
      }

      return {
        ok: true,

        app:
          JS_AppState.getCurrent(),

        configuration:
          JS_SystemConfiguration.getCurrent(),

        session:
          JS_SessionContext.getCurrent(),

        permissions:
          JS_Permissions.getCurrent()
      };

    } catch (error) {

      const message =
        error?.message ||
        "No fue posible iniciar correctamente el ERP.";

      await JS_AppState.markError(message);

      showAlert(
        message,
        "error"
      );

      return {
        ok: false,
        error: message,

        app:
          JS_AppState.getCurrent(),

        configuration:
          JS_SystemConfiguration.getCurrent(),

        session:
          JS_SessionContext.getCurrent(),

        permissions:
          JS_Permissions.getCurrent()
      };
    }
  },


  /**
   * Reinicia completamente el núcleo global.
   *
   * No debe ejecutarse automáticamente.
   * Se reserva para acciones administrativas o diagnóstico.
   */
  async restart() {
    try {

      await JS_Permissions.clear();

      await JS_SessionContext.clear();

      await JS_SystemConfiguration.clear();

      await JS_AppState.clear();

      return await this.init();

    } catch (error) {

      const message =
        error?.message ||
        "No fue posible reiniciar la aplicación.";

      await JS_AppState.markError(message);

      showAlert(
        message,
        "error"
      );

      return {
        ok: false,
        error: message,

        app:
          JS_AppState.getCurrent(),

        configuration:
          JS_SystemConfiguration.getCurrent(),

        session:
          JS_SessionContext.getCurrent(),

        permissions:
          JS_Permissions.getCurrent()
      };
    }
  },


  /**
   * Devuelve una vista consolidada del estado global.
   */
  getCurrent() {
    return {
      app:
        JS_AppState.getCurrent(),

      configuration:
        JS_SystemConfiguration.getCurrent(),

      session:
        JS_SessionContext.getCurrent(),

      permissions:
        JS_Permissions.getCurrent(),

      ready:
        this.isReady()
    };
  },


  /**
   * Indica si todo el núcleo del ERP está listo.
   */
  isReady() {
    return (
      JS_AppState.isReady() &&
      JS_SystemConfiguration.isReady() &&
      JS_SessionContext.isReady() &&
      JS_Permissions.isReady()
    );
  },


  /**
   * Devuelve un resumen técnico del ambiente actual.
   */
  getEnvironmentSummary() {
    const environment =
      JS_SystemConfiguration.getEnvironment();

    return {
      code:
        environment?.code || null,

      name:
        environment?.name || null,

      type:
        environment?.type || null,

      deployment_provider:
        environment?.deployment_provider || null,

      frontend_platform:
        environment?.frontend_platform || null,

      is_production:
        environment?.is_production === true,

      maintenance_mode:
        environment?.maintenance_mode === true,

      debug_enabled:
        environment?.debug_enabled === true,

      config_version:
        environment?.config_version || null
    };
  }

};
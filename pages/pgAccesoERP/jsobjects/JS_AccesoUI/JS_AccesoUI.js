export default {
  VISTAS: {
    LOGIN: "LOGIN",
    RECOVERY: "RECOVERY",
    VALIDATING: "VALIDATING",
    ACCESS_DENIED: "ACCESS_DENIED"
  },

  async inicializar() {
    const vista = appsmith.store.accesoVista;

    const vistasValidas = [
      "LOGIN",
      "RECOVERY",
      "VALIDATING",
      "ACCESS_DENIED"
    ];

    if (!vistasValidas.includes(vista)) {
      await storeValue("accesoVista", "LOGIN", false);
    }
  },

  async limpiarMensajes() {
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
  },

  async mostrarLogin() {
    await storeValue("accesoVista", "LOGIN", false);
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
  },

  async mostrarRecuperacion() {
    await storeValue("accesoVista", "RECOVERY", false);
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
  },

  async mostrarValidacion() {
    await storeValue("accesoVista", "VALIDATING", false);
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
  },

  async mostrarAccesoRestringido(mensaje) {
    await storeValue("accesoVista", "ACCESS_DENIED", false);
    await storeValue(
      "accesoError",
      mensaje || "La cuenta no tiene permisos para ingresar al ERP.",
      false
    );
    await storeValue("recuperacionMensaje", "", false);
  },

  async mostrarError(mensaje) {
    await storeValue("accesoVista", "LOGIN", false);
    await storeValue(
      "accesoError",
      mensaje || "No fue posible iniciar sesión.",
      false
    );
    await storeValue("recuperacionMensaje", "", false);
  },

  async mostrarMensajeRecuperacion(mensaje) {
    await storeValue("accesoVista", "RECOVERY", false);
    await storeValue("accesoError", "", false);
    await storeValue(
      "recuperacionMensaje",
      mensaje ||
        "Si el correo está registrado, recibirás instrucciones para restablecer la contraseña.",
      false
    );
  },

  async cerrarAccesoRestringido() {
    const keys = [
      "erp_access_token",
      "erp_refresh_token",
      "erp_access_token_expires_at",
      "erp_remember_session",
      "erp_user_id",
      "erp_user_name",
      "erp_tenant_id",
      "erp_company_id",
      "erp_role_id",
      "erp_role_code",
      "erp_role_name",
      "erp_session_context",
      "erp_available_contexts",
      "erp_admin_notification_inbox",
      "erp_admin_unread_count",
      "erp_admin_selected_notification_delivery_id"
    ];

    for (const key of keys) {
      await removeValue(key);
    }

    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
    await storeValue("accesoVista", "LOGIN", false);

    showAlert("Puedes iniciar sesión con otra cuenta.", "info");
  },

  async simularRecuperacion() {
    const correo = inpRecuperarCorreo.text
      ? inpRecuperarCorreo.text.trim().toLowerCase()
      : "";

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    await storeValue("recuperacionMensaje", "", false);

    if (!correo || !correoValido) {
      showAlert("Ingresa un correo electrónico válido.", "warning");
      return;
    }

    try {
      await qAuthRecover.run();

      await this.mostrarMensajeRecuperacion(
        "Si el correo está registrado, recibirás instrucciones para restablecer la contraseña."
      );

      showAlert("Solicitud enviada.", "success");
    } catch (error) {
      const detalle = JSON.stringify(error || {}).toLowerCase();

      if (
        detalle.includes("429") ||
        detalle.includes("rate limit") ||
        detalle.includes("over_email_send_rate_limit")
      ) {
        await this.mostrarMensajeRecuperacion(
          "Debes esperar unos minutos antes de solicitar otro correo."
        );
        return;
      }

      await this.mostrarMensajeRecuperacion(
        "Si el correo está registrado, recibirás instrucciones para restablecer la contraseña."
      );
    }
  }
};
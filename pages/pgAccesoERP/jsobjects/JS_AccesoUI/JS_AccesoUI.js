export default {
  VISTAS: {
    LOGIN: "LOGIN",
    RECOVERY: "RECOVERY",
    VALIDATING: "VALIDATING",
    ACCESS_DENIED: "ACCESS_DENIED",
    INVITE: "INVITE"
  },

  async inicializar() {
    const vista = appsmith.store.accesoVista;

    const vistasValidas = [
      "LOGIN",
      "RECOVERY",
      "VALIDATING",
      "ACCESS_DENIED",
      "INVITE"
    ];

    if (!vistasValidas.includes(vista)) {
      await storeValue("accesoVista", "LOGIN", false);
    }

    await this.capturarInvitacion();
  },

  async capturarInvitacion() {
    const hash = appsmith.URL.hash || "";

    const fragmento = hash.startsWith("#")
      ? hash.substring(1)
      : hash;

    const parametros = new URLSearchParams(fragmento);

    const accessToken = parametros.get("access_token");
    const tipo = parametros.get("type");

    if (!accessToken || tipo !== "invite") {
      return false;
    }

    await storeValue(
      "erp_access_token",
      accessToken,
      false
    );

    await storeValue(
      "accesoVista",
      "INVITE",
      false
    );

    await storeValue(
      "invitacionMensaje",
      "",
      false
    );

    return true;
  },

  async limpiarMensajes() {
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
    await storeValue("invitacionMensaje", "", false);
  },

  async mostrarLogin() {
    await storeValue("accesoVista", "LOGIN", false);
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
    await storeValue("invitacionMensaje", "", false);
  },

  async mostrarRecuperacion() {
    await storeValue("accesoVista", "RECOVERY", false);
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
    await storeValue("invitacionMensaje", "", false);
  },

  async mostrarValidacion() {
    await storeValue("accesoVista", "VALIDATING", false);
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);
    await storeValue("invitacionMensaje", "", false);
  },

  async mostrarAccesoRestringido(mensaje) {
    await storeValue("accesoVista", "ACCESS_DENIED", false);

    await storeValue(
      "accesoError",
      mensaje || "La cuenta no tiene permisos para ingresar al ERP.",
      false
    );

    await storeValue("recuperacionMensaje", "", false);
    await storeValue("invitacionMensaje", "", false);
  },

  async mostrarError(mensaje) {
    await storeValue("accesoVista", "LOGIN", false);

    await storeValue(
      "accesoError",
      mensaje || "No fue posible iniciar sesión.",
      false
    );

    await storeValue("recuperacionMensaje", "", false);
    await storeValue("invitacionMensaje", "", false);
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

    await storeValue("invitacionMensaje", "", false);
  },

  async mostrarInvitacion(mensaje) {
    await storeValue("accesoVista", "INVITE", false);
    await storeValue("accesoError", "", false);
    await storeValue("recuperacionMensaje", "", false);

    await storeValue(
      "invitacionMensaje",
      mensaje || "",
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
    await storeValue("invitacionMensaje", "", false);
    await storeValue("accesoVista", "LOGIN", false);

    showAlert(
      "Puedes iniciar sesión con otra cuenta.",
      "info"
    );
  },

  async simularRecuperacion() {
    const correo = inpRecuperarCorreo.text
      ? inpRecuperarCorreo.text.trim().toLowerCase()
      : "";

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    await storeValue("recuperacionMensaje", "", false);

    if (!correo || !correoValido) {
      showAlert(
        "Ingresa un correo electrónico válido.",
        "warning"
      );
      return;
    }

    try {
      await qAuthRecover.run();

      await this.mostrarMensajeRecuperacion(
        "Si el correo está registrado, recibirás instrucciones para restablecer la contraseña."
      );

      showAlert(
        "Solicitud enviada.",
        "success"
      );
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
  },

  async validarInvitacion() {
    const password = inpInvitacionPassword.text || "";
    const confirmacion =
      inpInvitacionConfirmar.text || "";

    await storeValue(
      "invitacionMensaje",
      "",
      false
    );

    if (password.length < 8) {
      await this.mostrarInvitacion(
        "La contraseña debe tener al menos 8 caracteres."
      );

      showAlert(
        "La contraseña es demasiado corta.",
        "warning"
      );

      return false;
    }

    if (password !== confirmacion) {
      await this.mostrarInvitacion(
        "Las contraseñas no coinciden."
      );

      showAlert(
        "Las contraseñas no coinciden.",
        "warning"
      );

      return false;
    }

    await this.mostrarInvitacion(
      "La contraseña cumple la validación básica. Aún no se ha guardado."
    );

    showAlert(
      "La contraseña está lista para activarse.",
      "success"
    );

    return true;
  },
async activarInvitacion() {
  const validacion = await this.validarInvitacion();

  if (!validacion) {
    return false;
  }

  const accessToken = appsmith.store.erp_access_token;

  if (!accessToken) {
    await this.mostrarInvitacion(
      "El enlace de invitación no es válido o ya expiró."
    );

    showAlert(
      "No se encontró una sesión válida de invitación.",
      "error"
    );

    return false;
  }

  try {
    await qAuthUpdatePassword.run();

    await removeValue("erp_access_token");

    await storeValue(
      "invitacionMensaje",
      "Contraseña activada correctamente. Ya puedes iniciar sesión.",
      false
    );

    await storeValue(
      "accesoVista",
      "LOGIN",
      false
    );

    showAlert(
      "Contraseña activada correctamente.",
      "success"
    );

    return true;
  } catch (error) {
    const detalle = JSON.stringify(error || {}).toLowerCase();

    if (
      detalle.includes("401") ||
      detalle.includes("invalid") ||
      detalle.includes("expired")
    ) {
      await this.mostrarInvitacion(
        "El enlace de invitación expiró o ya fue utilizado."
      );

      showAlert(
        "El enlace ya no es válido.",
        "error"
      );

      return false;
    }

    await this.mostrarInvitacion(
      "No fue posible activar la contraseña. Intenta nuevamente."
    );

    showAlert(
      "No fue posible activar la contraseña.",
      "error"
    );

    return false;
  }
},
  async cancelarInvitacion() {
    await this.mostrarLogin();

    showAlert(
      "Activación cancelada.",
      "info"
    );
  }
};
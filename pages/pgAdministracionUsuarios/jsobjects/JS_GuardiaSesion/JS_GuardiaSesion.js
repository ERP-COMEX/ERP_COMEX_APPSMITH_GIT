export default {
  MARGEN_EXPIRACION_SEGUNDOS: 60,

  obtenerToken() {
    return String(
      appsmith.store.erp_access_token || ""
    )
      .trim()
      .replace(/^Bearer\s+/i, "")
      .replace(/^"+|"+$/g, "");
  },

  obtenerExpiracionToken() {
    const expirationFromStore = Number(
      appsmith.store.erp_access_token_expires_at || 0
    );

    if (expirationFromStore > 0) {
      return expirationFromStore;
    }

    try {
      const token = this.obtenerToken();
      const partes = token.split(".");

      if (partes.length !== 3) {
        return null;
      }

      const payloadNormalizado = partes[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payloadRelleno =
        payloadNormalizado +
        "=".repeat(
          (4 - (payloadNormalizado.length % 4)) % 4
        );

      const claims = JSON.parse(
        atob(payloadRelleno)
      );

      const expirationFromJwt =
        Number(claims?.exp || 0);

      return expirationFromJwt > 0
        ? expirationFromJwt
        : null;
    } catch (error) {
      return null;
    }
  },

  sesionEstaVigente() {
    const token = this.obtenerToken();
    const expiresAt =
      this.obtenerExpiracionToken();

    if (
      !token ||
      token.split(".").length !== 3 ||
      !expiresAt
    ) {
      return false;
    }

    const ahora =
      Math.floor(Date.now() / 1000);

    return (
      ahora <
      expiresAt - this.MARGEN_EXPIRACION_SEGUNDOS
    );
  },

  async limpiarSesion() {
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
  },

  async cerrarSesion() {
    await this.limpiarSesion();

    await navigateTo(
      "pgAccesoERP",
      {},
      "SAME_WINDOW"
    );

    showAlert(
      "Sesión cerrada.",
      "success"
    );
  },

  async cerrarSesionExpirada() {
    await this.limpiarSesion();

    await navigateTo(
      "pgAccesoERP",
      {},
      "SAME_WINDOW"
    );

    showAlert(
      "Tu sesión venció. Inicia sesión nuevamente para continuar.",
      "warning"
    );
  },

  async asegurarSesionActiva() {
    if (this.sesionEstaVigente()) {
      return true;
    }

    await this.cerrarSesionExpirada();

    return false;
  },

  async validarSesionProtegida() {
    return await this.asegurarSesionActiva();
  },

  async verificarSesionAlCargar() {
    return await this.validarSesionProtegida();
  },

  async manejarErrorDeSesion(error) {
    let detalle = "";

    try {
      detalle = JSON.stringify(
        error || {}
      ).toLowerCase();
    } catch (serializationError) {
      detalle = String(
        error || ""
      ).toLowerCase();
    }

    const sesionExpirada =
      detalle.includes("jwt expired") ||
      detalle.includes("pgrst303") ||
      detalle.includes("401 unauthorized") ||
      detalle.includes("invalid jwt");

    if (sesionExpirada) {
      await this.cerrarSesionExpirada();
      return true;
    }

    return false;
  }
};
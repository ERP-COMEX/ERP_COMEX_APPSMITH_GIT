export default {
  DESTINO_ACCESO: "pgAccesoERP",

  obtenerToken() {
    return appsmith.store.erp_access_token || "";
  },

  obtenerExpiracionToken() {
    const expirationFromStore = Number(
      appsmith.store.erp_access_token_expires_at || 0
    );

    if (expirationFromStore > 0) {
      return expirationFromStore;
    }

    try {
      const tokenParts = this.obtenerToken().split(".");

      if (tokenParts.length < 2) {
        return null;
      }

      const payload = tokenParts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const claims = JSON.parse(atob(payload));
      const expirationFromJwt = Number(claims.exp || 0);

      return expirationFromJwt > 0
        ? expirationFromJwt
        : null;
    } catch (error) {
      return null;
    }
  },

  sesionEstaVigente() {
    const token = this.obtenerToken();

    if (!token) {
      return false;
    }

    const expiresAt = this.obtenerExpiracionToken();

    return !expiresAt || expiresAt > Math.floor(Date.now() / 1000) + 10;
  },

  async limpiarSesion() {
    const keys = [
      "erp_access_token",
      "erp_access_token_expires_at",
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

  async cerrarSesionExpirada() {
    await this.limpiarSesion();

    showAlert(
      "Tu sesión venció. Inicia sesión nuevamente para continuar.",
      "warning"
    );

    await navigateTo(this.DESTINO_ACCESO, {}, "SAME_WINDOW");
  },

  async asegurarSesionActiva() {
    if (this.sesionEstaVigente()) {
      return true;
    }

    await this.cerrarSesionExpirada();
    return false;
  },

  async verificarSesionAlCargar() {
    await this.asegurarSesionActiva();
  },

  async manejarErrorDeSesion(error) {
    const detail = JSON.stringify(error || {}).toLowerCase();

    const expired =
      detail.includes("jwt expired") ||
      detail.includes("pgrst303") ||
      detail.includes("401 unauthorized");

    if (expired) {
      await this.cerrarSesionExpirada();
      return true;
    }

    return false;
  }
};
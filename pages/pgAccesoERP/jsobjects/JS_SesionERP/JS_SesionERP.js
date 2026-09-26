export default {
  DESTINO_INICIAL: "pgAdministracionUsuarios",
  PAGINA_ACCESO: "pgAccesoERP",
  MARGEN_EXPIRACION_SEGUNDOS: 60,

  limpiarToken(token) {
    if (token === null || token === undefined) {
      return "";
    }

    return String(token)
      .trim()
      .replace(/^Bearer\s+/i, "")
      .replace(/^"+|"+$/g, "")
      .replace(/^'+|'+$/g, "");
  },

  tokenValido(token) {
    const limpio = this.limpiarToken(token);

    return (
      limpio.length > 0 &&
      limpio.split(".").length === 3
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
      "erp_available_contexts"
    ];

    for (const key of keys) {
      await removeValue(key);
    }
  },

  obtenerExpiracionToken(auth) {
    const expiresAt = Number(auth?.expires_at);

    if (Number.isFinite(expiresAt) && expiresAt > 0) {
      return expiresAt;
    }

    const expiresIn = Number(auth?.expires_in);

    if (Number.isFinite(expiresIn) && expiresIn > 0) {
      return Math.floor(Date.now() / 1000) + expiresIn;
    }

    try {
      const token = this.limpiarToken(
        auth?.access_token
      );

      const payload = token.split(".")[1];

      if (!payload) {
        return null;
      }

      const normalizado = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const relleno =
        normalizado +
        "=".repeat(
          (4 - (normalizado.length % 4)) % 4
        );

      const claims = JSON.parse(
        atob(relleno)
      );

      const exp = Number(claims?.exp);

      return Number.isFinite(exp) ? exp : null;
    } catch (error) {
      return null;
    }
  },

  tokenSigueVigente() {
    const token =
      appsmith.store.erp_access_token;

    const expiraEn =
      Number(
        appsmith.store.erp_access_token_expires_at
      );

    if (!this.tokenValido(token) || !expiraEn) {
      return false;
    }

    const ahora =
      Math.floor(Date.now() / 1000);

    return (
      ahora <
      expiraEn - this.MARGEN_EXPIRACION_SEGUNDOS
    );
  },

  sesionDebePersistir() {
    return (
      appsmith.store.erp_remember_session === true
    );
  },

  async guardarTokens(auth, recordar) {
    const accessToken =
      this.limpiarToken(auth?.access_token);

    const refreshToken =
      this.limpiarToken(auth?.refresh_token);

    if (!this.tokenValido(accessToken)) {
      throw new Error(
        "Supabase no devolvió un access token JWT válido."
      );
    }

    if (!refreshToken) {
      throw new Error(
        "Supabase no devolvió un refresh token válido."
      );
    }

    const expiresAt =
      this.obtenerExpiracionToken({
        ...auth,
        access_token: accessToken
      });

    await storeValue(
      "erp_access_token",
      accessToken,
      recordar
    );

    await storeValue(
      "erp_refresh_token",
      refreshToken,
      recordar
    );

    await storeValue(
      "erp_access_token_expires_at",
      expiresAt,
      recordar
    );

    await storeValue(
      "erp_remember_session",
      recordar,
      recordar
    );

    const tokenGuardado =
      this.limpiarToken(
        appsmith.store.erp_access_token
      );

    if (!this.tokenValido(tokenGuardado)) {
      throw new Error(
        "El token no pudo guardarse correctamente en Appsmith."
      );
    }
  },

  async guardarContexto(session, recordar) {
    const context =
      session?.default_context;

    if (
      session?.ok !== true ||
      !context?.tenant_id ||
      !context?.company_id ||
      !context?.role_code
    ) {
      await storeValue(
        "erp_available_contexts",
        session?.contexts || [],
        recordar
      );

      throw new Error(
        "La cuenta no tiene un contexto organizacional válido."
      );
    }

    await storeValue(
      "erp_user_id",
      session.user_id,
      recordar
    );

    await storeValue(
      "erp_user_name",
      session.user_full_name || "",
      recordar
    );

    await storeValue(
      "erp_tenant_id",
      context.tenant_id,
      recordar
    );

    await storeValue(
      "erp_company_id",
      context.company_id,
      recordar
    );

    await storeValue(
      "erp_role_id",
      context.role_id,
      recordar
    );

    await storeValue(
      "erp_role_code",
      context.role_code,
      recordar
    );

    await storeValue(
      "erp_role_name",
      context.role_name || "",
      recordar
    );

    await storeValue(
      "erp_session_context",
      session,
      recordar
    );

    await storeValue(
      "erp_available_contexts",
      session.contexts || [],
      recordar
    );
  },

  async obtenerContextoActual() {
    const token =
      this.limpiarToken(
        appsmith.store.erp_access_token
      );

    if (!this.tokenValido(token)) {
      throw new Error(
        "El token de sesión no es válido para consultar el contexto."
      );
    }

    const session =
      await qGetMySessionContext.run();

    if (!session) {
      throw new Error(
        "El servidor no devolvió el contexto de sesión."
      );
    }

    if (
      session.ok !== true ||
      !session.default_context
    ) {
      throw new Error(
        "La autenticación fue correcta, pero no fue posible cargar el contexto organizacional."
      );
    }

    return session;
  },

  obtenerMensajeError(error, fase) {
    const status = Number(
      error?.responseMeta?.statusCode ||
      error?.status ||
      error?.response?.status ||
      0
    );

    const texto = [
      error?.message,
      error?.description,
      error?.response?.data?.message,
      error?.response?.data?.error_description,
      error?.response?.data?.error,
      error?.data?.message,
      error?.data?.error
    ]
      .filter(Boolean)
      .map(valor =>
        String(valor).toLowerCase()
      )
      .join(" ");

    if (fase === "auth") {
      if (
        status === 400 ||
        texto.includes("invalid login credentials") ||
        texto.includes("invalid_credentials") ||
        texto.includes("invalid password") ||
        texto.includes("invalid email")
      ) {
        return (
          "El correo electrónico o la contraseña son incorrectos."
        );
      }

      return "No fue posible autenticar la cuenta.";
    }

    if (fase === "context") {
      return (
        "La autenticación fue correcta, pero no fue posible cargar el contexto organizacional."
      );
    }

    if (fase === "refresh") {
      return (
        "La sesión expiró. Ingrese nuevamente al ERP."
      );
    }

    return "No fue posible completar el ingreso al ERP.";
  },

  async iniciarSesion() {
    let fase = "auth";

    try {
      const correo =
        inpLoginCorreo.text
          ?.trim()
          .toLowerCase();

      const password =
        inpLoginPassword.text || "";

      const recordar =
        swLoginRecordar.isSwitchedOn === true;

      const correoValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(correo || "");

      if (!correo || !password) {
        showAlert(
          "Ingrese su correo electrónico y contraseña.",
          "warning"
        );
        return;
      }

      if (!correoValido) {
        showAlert(
          "Ingrese un correo electrónico válido.",
          "warning"
        );
        return;
      }

      await JS_AccesoUI.mostrarValidacion();
      await this.limpiarSesion();

      const auth =
        await qAuthSignIn.run();

      await this.guardarTokens(
        auth,
        recordar
      );

      fase = "context";

      const session =
        await this.obtenerContextoActual();

      await this.guardarContexto(
        session,
        recordar
      );

      showAlert(
        `Bienvenido${
          session.user_full_name
            ? `, ${session.user_full_name}`
            : ""
        }.`,
        "success"
      );

      await navigateTo(
        this.DESTINO_INICIAL,
        {},
        "SAME_WINDOW"
      );
    } catch (error) {
      const mensaje =
        this.obtenerMensajeError(error, fase);

      await this.limpiarSesion();
      await JS_AccesoUI.mostrarError(mensaje);

      showAlert(
        mensaje,
        "error"
      );
    }
  },

  async refrescarSesion() {
    const refreshToken =
      this.limpiarToken(
        appsmith.store.erp_refresh_token
      );

    if (!refreshToken) {
      return false;
    }

    try {
      const auth =
        await qAuthRefresh.run();

      await this.guardarTokens(
        auth,
        true
      );

      const session =
        await this.obtenerContextoActual();

      await this.guardarContexto(
        session,
        true
      );

      return true;
    } catch (error) {
      await this.limpiarSesion();
      return false;
    }
  },

  async inicializarAcceso() {
    if (this.tokenSigueVigente()) {
      await navigateTo(
        this.DESTINO_INICIAL,
        {},
        "SAME_WINDOW"
      );

      return;
    }

    if (
      this.sesionDebePersistir() &&
      appsmith.store.erp_refresh_token
    ) {
      const renovada =
        await this.refrescarSesion();

      if (renovada) {
        await navigateTo(
          this.DESTINO_INICIAL,
          {},
          "SAME_WINDOW"
        );

        return;
      }
    }

    await JS_AccesoUI.mostrarLogin();
  },

  async validarSesionProtegida() {
    if (this.tokenSigueVigente()) {
      return true;
    }

    if (
      this.sesionDebePersistir() &&
      appsmith.store.erp_refresh_token
    ) {
      const renovada =
        await this.refrescarSesion();

      if (renovada) {
        return true;
      }
    }

    await this.limpiarSesion();
    await JS_AccesoUI.mostrarLogin();

    showAlert(
      "La sesión expiró. Ingrese nuevamente.",
      "warning"
    );

    await navigateTo(
      this.PAGINA_ACCESO,
      {},
      "SAME_WINDOW"
    );

    return false;
  },

  async cerrarSesion() {
    try {
      if (
        this.tokenValido(
          appsmith.store.erp_access_token
        )
      ) {
        await qAuthLogout.run();
      }
    } catch (error) {
      // El cierre local continúa aunque falle el cierre remoto.
    } finally {
      await this.limpiarSesion();

      await JS_AccesoUI.mostrarLogin();

      await navigateTo(
        this.PAGINA_ACCESO,
        {},
        "SAME_WINDOW"
      );

      showAlert(
        "Sesión cerrada.",
        "success"
      );
    }
  },

  async cerrarSesionLocal() {
    await this.limpiarSesion();
    await JS_AccesoUI.mostrarLogin();

    await navigateTo(
      this.PAGINA_ACCESO,
      {},
      "SAME_WINDOW"
    );
  }
};
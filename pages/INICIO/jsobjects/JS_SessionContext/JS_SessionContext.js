export default {

  /**
   * Inicializa el contexto organizacional activo del usuario.
   *
   * Flujo:
   * 1. Marca el contexto como no listo.
   * 2. Limpia errores previos.
   * 3. Obtiene el correo autenticado de Appsmith.
   * 4. Ejecuta qSessionGetContext.
   * 5. Valida que exista exactamente una fila.
   * 6. Valida campos obligatorios y acceso efectivo.
   * 7. Guarda las claves platform_*.
   * 8. Marca el contexto como listo.
   */
  async init() {
    try {
      await storeValue("platform_context_ready", false);
      await storeValue("platform_context_error", null);

      const email = String(appsmith.user?.email || "")
        .trim()
        .toLowerCase();

      if (!email) {
        throw new Error(
          "No fue posible obtener el correo del usuario autenticado en Appsmith."
        );
      }

      const result = await qSessionGetContext.run();

      if (!Array.isArray(result)) {
        throw new Error(
          "La consulta de contexto no devolvió una colección válida."
        );
      }

      if (result.length === 0) {
        throw new Error(
          "El usuario no tiene un contexto organizacional activo y predeterminado."
        );
      }

      if (result.length > 1) {
        throw new Error(
          `La consulta devolvió ${result.length} contextos. Se esperaba exactamente uno.`
        );
      }

      const ctx = result[0];

      const requiredFields = [
        "user_id",
        "user_full_name",
        "user_email",

        "user_tenant_access_id",
        "tenant_id",
        "tenant_code",
        "tenant_name",

        "role_id",
        "role_code",
        "role_name",

        "user_company_access_id",
        "company_id",
        "company_code",
        "company_name",

        "branch_id",
        "branch_code",
        "branch_name",

        "user_area_access_id",
        "area_id",
        "area_code",
        "area_name"
      ];

      const missingFields = requiredFields.filter((field) => {
        const value = ctx[field];

        return (
          value === null ||
          value === undefined ||
          String(value).trim() === ""
        );
      });

      if (missingFields.length > 0) {
        throw new Error(
          `El contexto está incompleto. Campos faltantes: ${missingFields.join(", ")}.`
        );
      }

      if (ctx.effective_access !== true) {
        throw new Error(
          "El contexto recuperado no tiene acceso organizacional efectivo."
        );
      }

      const values = {
        platform_user_id: ctx.user_id,
        platform_user_full_name: ctx.user_full_name,
        platform_user_email: ctx.user_email,
        platform_user_status: ctx.user_status,
        platform_user_is_super_admin:
          ctx.user_is_super_admin === true,

        platform_tenant_access_id:
          ctx.user_tenant_access_id,
        platform_tenant_id:
          ctx.tenant_id,
        platform_tenant_code:
          ctx.tenant_code,
        platform_tenant_name:
          ctx.tenant_name,
        platform_tenant_status:
          ctx.tenant_status,

        platform_role_id:
          ctx.role_id,
        platform_role_code:
          ctx.role_code,
        platform_role_name:
          ctx.role_name,

        platform_company_access_id:
          ctx.user_company_access_id,
        platform_company_id:
          ctx.company_id,
        platform_company_code:
          ctx.company_code,
        platform_company_name:
          ctx.company_name,
        platform_company_status:
          ctx.company_status,
        platform_company_is_default:
          ctx.is_default_company === true,

        platform_branch_id:
          ctx.branch_id,
        platform_branch_code:
          ctx.branch_code,
        platform_branch_name:
          ctx.branch_name,
        platform_branch_type:
          ctx.branch_type,
        platform_branch_status:
          ctx.branch_status,
        platform_branch_is_primary:
          ctx.is_primary_branch === true,

        platform_area_access_id:
          ctx.user_area_access_id,
        platform_area_id:
          ctx.area_id,
        platform_area_code:
          ctx.area_code,
        platform_area_name:
          ctx.area_name,
        platform_area_type:
          ctx.area_type,
        platform_area_status:
          ctx.area_status,
        platform_area_is_primary:
          ctx.is_primary_area === true,

        platform_effective_access:
          ctx.effective_access === true,

        platform_context_loaded_at:
          new Date().toISOString(),

        platform_context_error:
          null
      };

      for (const [key, value] of Object.entries(values)) {
        await storeValue(key, value);
      }

      await storeValue("platform_context_ready", true);

      return {
        ok: true,
        context: this.getCurrent()
      };

    } catch (error) {
      const message =
        error?.message ||
        "No fue posible inicializar el contexto organizacional.";

      await storeValue("platform_context_ready", false);
      await storeValue("platform_context_error", message);

      showAlert(message, "error");

      return {
        ok: false,
        error: message
      };
    }
  },


  /**
   * Limpia únicamente las claves platform_* utilizadas
   * por el contexto organizacional.
   */
  async clear() {
    const keys = [
      "platform_user_id",
      "platform_user_full_name",
      "platform_user_email",
      "platform_user_status",
      "platform_user_is_super_admin",

      "platform_tenant_access_id",
      "platform_tenant_id",
      "platform_tenant_code",
      "platform_tenant_name",
      "platform_tenant_status",

      "platform_role_id",
      "platform_role_code",
      "platform_role_name",

      "platform_company_access_id",
      "platform_company_id",
      "platform_company_code",
      "platform_company_name",
      "platform_company_status",
      "platform_company_is_default",

      "platform_branch_id",
      "platform_branch_code",
      "platform_branch_name",
      "platform_branch_type",
      "platform_branch_status",
      "platform_branch_is_primary",

      "platform_area_access_id",
      "platform_area_id",
      "platform_area_code",
      "platform_area_name",
      "platform_area_type",
      "platform_area_status",
      "platform_area_is_primary",

      "platform_effective_access",
      "platform_context_ready",
      "platform_context_loaded_at",
      "platform_context_error"
    ];

    for (const key of keys) {
      await removeValue(key);
    }

    return {
      ok: true
    };
  },


  /**
   * Retorna el contexto actualmente almacenado.
   */
  getCurrent() {
    return {
      ready:
        appsmith.store.platform_context_ready === true,

      user_id:
        appsmith.store.platform_user_id || null,
      user_name:
        appsmith.store.platform_user_full_name || null,
      user_email:
        appsmith.store.platform_user_email || null,
      user_status:
        appsmith.store.platform_user_status || null,
      user_is_super_admin:
        appsmith.store.platform_user_is_super_admin === true,

      tenant_access_id:
        appsmith.store.platform_tenant_access_id || null,
      tenant_id:
        appsmith.store.platform_tenant_id || null,
      tenant_code:
        appsmith.store.platform_tenant_code || null,
      tenant_name:
        appsmith.store.platform_tenant_name || null,
      tenant_status:
        appsmith.store.platform_tenant_status || null,

      role_id:
        appsmith.store.platform_role_id || null,
      role_code:
        appsmith.store.platform_role_code || null,
      role_name:
        appsmith.store.platform_role_name || null,

      company_access_id:
        appsmith.store.platform_company_access_id || null,
      company_id:
        appsmith.store.platform_company_id || null,
      company_code:
        appsmith.store.platform_company_code || null,
      company_name:
        appsmith.store.platform_company_name || null,
      company_status:
        appsmith.store.platform_company_status || null,
      company_is_default:
        appsmith.store.platform_company_is_default === true,

      branch_id:
        appsmith.store.platform_branch_id || null,
      branch_code:
        appsmith.store.platform_branch_code || null,
      branch_name:
        appsmith.store.platform_branch_name || null,
      branch_type:
        appsmith.store.platform_branch_type || null,
      branch_status:
        appsmith.store.platform_branch_status || null,
      branch_is_primary:
        appsmith.store.platform_branch_is_primary === true,

      area_access_id:
        appsmith.store.platform_area_access_id || null,
      area_id:
        appsmith.store.platform_area_id || null,
      area_code:
        appsmith.store.platform_area_code || null,
      area_name:
        appsmith.store.platform_area_name || null,
      area_type:
        appsmith.store.platform_area_type || null,
      area_status:
        appsmith.store.platform_area_status || null,
      area_is_primary:
        appsmith.store.platform_area_is_primary === true,

      effective_access:
        appsmith.store.platform_effective_access === true,

      loaded_at:
        appsmith.store.platform_context_loaded_at || null,

      error:
        appsmith.store.platform_context_error || null
    };
  },


  /**
   * Indica si el contexto está completo y utilizable.
   */
  isReady() {
    return (
      appsmith.store.platform_context_ready === true &&
      appsmith.store.platform_effective_access === true &&
      Boolean(appsmith.store.platform_user_id) &&
      Boolean(appsmith.store.platform_tenant_id) &&
      Boolean(appsmith.store.platform_company_id) &&
      Boolean(appsmith.store.platform_branch_id) &&
      Boolean(appsmith.store.platform_area_id)
    );
  },


  /**
   * Retorna el valor de una clave del contexto.
   */
  get(key) {
    const context = this.getCurrent();

    return Object.prototype.hasOwnProperty.call(context, key)
      ? context[key]
      : null;
  }
};
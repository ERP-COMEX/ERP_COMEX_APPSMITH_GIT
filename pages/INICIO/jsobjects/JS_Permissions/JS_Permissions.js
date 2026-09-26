export default {

  /**
   * Carga y almacena los permisos efectivos del usuario actual.
   *
   * Dependencias:
   * - JS_SessionContext
   * - qPermissionsGetCurrent
   */
  async init() {
    try {
      await this.clear();

      if (!JS_SessionContext.isReady()) {
        throw new Error(
          "No es posible cargar permisos porque el contexto de sesión no está listo."
        );
      }

      const result = await qPermissionsGetCurrent.run();

      if (!Array.isArray(result)) {
        throw new Error(
          "La consulta de permisos no devolvió una colección válida."
        );
      }

      const grantedPermissions = result
        .filter(row =>
          row &&
          row.effective_granted === true &&
          row.permission_code
        )
        .map(row => ({
          permission_id: row.permission_id || null,
          permission_code: String(row.permission_code).trim(),
          permission_name: row.permission_name || null,
          module_code: row.module_code
            ? String(row.module_code).trim()
            : null,
          action_code: row.action_code
            ? String(row.action_code).trim()
            : null,
          description: row.permission_description || null
        }));

      const permissionCodes = [
        ...new Set(
          grantedPermissions.map(item => item.permission_code)
        )
      ];

      const permissionsByModule = grantedPermissions.reduce(
        (accumulator, permission) => {
          const moduleCode =
            permission.module_code || "_unclassified";

          if (!accumulator[moduleCode]) {
            accumulator[moduleCode] = [];
          }

          accumulator[moduleCode].push(
            permission.permission_code
          );

          return accumulator;
        },
        {}
      );

      const modules = Object.keys(permissionsByModule);

      const now = new Date().toISOString();

      await storeValue(
        "platform_permissions",
        grantedPermissions
      );

      await storeValue(
        "platform_permission_codes",
        permissionCodes
      );

      await storeValue(
        "platform_permissions_by_module",
        permissionsByModule
      );

      await storeValue(
        "platform_permission_modules",
        modules
      );

      await storeValue(
        "platform_permissions_count",
        permissionCodes.length
      );

      await storeValue(
        "platform_permissions_role_id",
        appsmith.store.platform_role_id || null
      );

      await storeValue(
        "platform_permissions_role_code",
        appsmith.store.platform_role_code || null
      );

      await storeValue(
        "platform_permissions_loaded_at",
        now
      );

      await storeValue(
        "platform_permissions_error",
        null
      );

      await storeValue(
        "platform_permissions_ready",
        true
      );

      return {
        ok: true,
        permissions_count: permissionCodes.length,
        modules,
        permission_codes: permissionCodes
      };

    } catch (error) {
      const message =
        error?.message ||
        "No fue posible cargar los permisos del usuario.";

      await storeValue(
        "platform_permissions_ready",
        false
      );

      await storeValue(
        "platform_permissions_error",
        message
      );

      return {
        ok: false,
        error: message
      };
    }
  },

  /**
   * Comprueba un permiso por su código completo.
   *
   * Ejemplo:
   * JS_Permissions.has("booking.create")
   */
  has(permissionCode) {
    const normalizedCode =
      String(permissionCode || "").trim();

    if (!normalizedCode) {
      return false;
    }

    const permissionCodes =
      Array.isArray(appsmith.store.platform_permission_codes)
        ? appsmith.store.platform_permission_codes
        : [];

    return permissionCodes.includes(normalizedCode);
  },

  /**
   * Alias semántico de has().
   */
  can(permissionCode) {
    return this.has(permissionCode);
  },

  /**
   * Comprueba si el usuario posee todos los permisos indicados.
   *
   * Ejemplo:
   * JS_Permissions.hasAll([
   *   "booking.read",
   *   "booking.update"
   * ])
   */
  hasAll(permissionCodes) {
    if (!Array.isArray(permissionCodes)) {
      return false;
    }

    return permissionCodes.every(code =>
      this.has(code)
    );
  },

  /**
   * Comprueba si el usuario posee al menos uno de los permisos.
   */
  hasAny(permissionCodes) {
    if (!Array.isArray(permissionCodes)) {
      return false;
    }

    return permissionCodes.some(code =>
      this.has(code)
    );
  },

  /**
   * Comprueba si existe al menos un permiso para un módulo.
   *
   * Ejemplo:
   * JS_Permissions.canAccessModule("booking")
   */
  canAccessModule(moduleCode) {
    const normalizedModule =
      String(moduleCode || "").trim();

    if (!normalizedModule) {
      return false;
    }

    const permissionsByModule =
      appsmith.store.platform_permissions_by_module || {};

    return (
      Array.isArray(
        permissionsByModule[normalizedModule]
      ) &&
      permissionsByModule[normalizedModule].length > 0
    );
  },

  /**
   * Comprueba una acción dentro de un módulo.
   *
   * Ejemplo:
   * JS_Permissions.canPerform("booking", "create")
   */
  canPerform(moduleCode, actionCode) {
    const normalizedModule =
      String(moduleCode || "").trim();

    const normalizedAction =
      String(actionCode || "").trim();

    if (!normalizedModule || !normalizedAction) {
      return false;
    }

    return this.has(
      `${normalizedModule}.${normalizedAction}`
    );
  },

  /**
   * Devuelve todos los permisos asignados a un módulo.
   */
  getModulePermissions(moduleCode) {
    const normalizedModule =
      String(moduleCode || "").trim();

    const permissionsByModule =
      appsmith.store.platform_permissions_by_module || {};

    return Array.isArray(
      permissionsByModule[normalizedModule]
    )
      ? permissionsByModule[normalizedModule]
      : [];
  },

  /**
   * Devuelve el contexto consolidado de permisos.
   */
  getCurrent() {
    return {
      ready:
        appsmith.store.platform_permissions_ready === true,

      role_id:
        appsmith.store.platform_permissions_role_id || null,

      role_code:
        appsmith.store.platform_permissions_role_code || null,

      permissions_count:
        Number(
          appsmith.store.platform_permissions_count || 0
        ),

      modules:
        Array.isArray(
          appsmith.store.platform_permission_modules
        )
          ? appsmith.store.platform_permission_modules
          : [],

      permission_codes:
        Array.isArray(
          appsmith.store.platform_permission_codes
        )
          ? appsmith.store.platform_permission_codes
          : [],

      permissions_by_module:
        appsmith.store.platform_permissions_by_module || {},

      loaded_at:
        appsmith.store.platform_permissions_loaded_at || null,

      error:
        appsmith.store.platform_permissions_error || null
    };
  },

  /**
   * Indica si la capa de permisos está lista.
   */
  isReady() {
    return (
      appsmith.store.platform_permissions_ready === true &&
      appsmith.store.platform_permissions_error == null
    );
  },

  /**
   * Limpia únicamente las claves administradas por este objeto.
   */
  async clear() {
    const keys = [
      "platform_permissions",
      "platform_permission_codes",
      "platform_permissions_by_module",
      "platform_permission_modules",
      "platform_permissions_count",
      "platform_permissions_role_id",
      "platform_permissions_role_code",
      "platform_permissions_loaded_at",
      "platform_permissions_error",
      "platform_permissions_ready"
    ];

    for (const key of keys) {
      await removeValue(key);
    }

    return {
      ok: true
    };
  }

};
export default {
  async init() {
    const ctx = q_bootstrap_context.data?.[0];

    if (!ctx?.user_id || !ctx?.tenant_id) {
      showAlert("No se pudo inicializar el contexto del usuario.", "error");
      return;
    }

    await storeValue("user_id", ctx.user_id, false);
    await storeValue("tenant_id", ctx.tenant_id, false);
    await storeValue("user_email", ctx.user_email || "", false);
    await storeValue("user_name", ctx.user_name || "", false);

    await q_exportadores_dropdown.run();
    await q_clientes_dropdown.run();

    return this.get();
  },

  get() {
    return {
      tenant_id: appsmith.store.tenant_id || "",
      user_id: appsmith.store.user_id || "",
      user_email: appsmith.store.user_email || "",
      user_name: appsmith.store.user_name || ""
    };
  },

  isReady() {
    return !!appsmith.store.tenant_id && !!appsmith.store.user_id;
  },

  async reset() {
    await removeValue("tenant_id");
    await removeValue("user_id");
    await removeValue("user_email");
    await removeValue("user_name");

    showAlert("Contexto reiniciado.", "info");
  }
}
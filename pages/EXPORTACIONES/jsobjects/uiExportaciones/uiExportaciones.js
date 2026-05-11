export default {
  init() {
    // Inicializa ambos si no existen
    if (!appsmith.store.active_section) {
      storeValue("active_section", "CONFIRMACION_VENTA");
    }
    if (!appsmith.store.export_selection) {
      storeValue("export_selection", "confirmacion_venta"); // si ya lo usabas así
    }
    return true;
  },

  goTo(key) {
    // key = string de tu navegación (ej: "CONFIRMACION_VENTA", "BOOKING", etc.)
    storeValue("active_section", key);

    // Mantén también export_selection para estilos/hightlight si lo estás usando
    // Puedes guardarlo igual o en minúsculas, pero sé consistente con tus estilos actuales:
    storeValue("export_selection", key.toLowerCase());

    return true;
  },

  isActive(key) {
    // key se compara contra active_section (lo correcto para navegación)
    return appsmith.store.active_section === key;
  },

  // Si en estilos estabas usando export_selection directamente:
  isActiveLegacy(keyLower) {
    return (appsmith.store.export_selection || "") === keyLower;
  },
};
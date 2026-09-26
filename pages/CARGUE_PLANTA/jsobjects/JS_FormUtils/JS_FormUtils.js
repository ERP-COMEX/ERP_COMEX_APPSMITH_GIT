export default {
  resetWidgetsSafe: async (widgets = []) => {
    for (const widgetName of widgets) {
      try {
        resetWidget(widgetName, true);
      } catch (e) {
        console.log("NO SE PUDO LIMPIAR:", widgetName, e);
      }
    }

    return true;
  }
};
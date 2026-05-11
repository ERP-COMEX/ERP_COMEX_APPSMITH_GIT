export default {
  async cargarDesdeTabla() {
    try {
      await storeValue("form_mode", "VIEW");

      resetWidget("sl_ciudad_incoterm", true);
      resetWidget("sl_terminal_pol", true);
      resetWidget("sl_pod", true);
      resetWidget("sl_puerto_transbordo", true);

      await storeValue("current_booking_id", tblBookingSearch_New.selectedRow.id);
      await storeValue("current_exportacion_id", tblBookingSearch_New.selectedRow.exportacion_id);
      await storeValue("current_operacion_no", tblBookingSearch_New.selectedRow.operacion_no);

      await q_booking_detail.run();

      showAlert("Registro cargado en modo CONSULTA.", "success");
      return true;
    } catch (err) {
      showAlert("Error al cargar registro: " + JSON.stringify(err), "error");
      return false;
    }
  }
}
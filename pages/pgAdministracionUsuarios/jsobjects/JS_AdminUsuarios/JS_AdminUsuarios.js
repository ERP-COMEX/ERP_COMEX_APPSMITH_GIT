export default {
  documentosMock: [
    {
      document_id: "DOC-001",
      tipo_codigo: "DELIVERY_ACT",
      tipo_nombre: "Acta de entrega",
      nombre_archivo: "acta_entrega_usuario.pdf",
      mime_type: "application/pdf",
      estado: "GENERADO",
      version: 1,
      fecha: "2026-09-04",
      creado_por: "Nicolás Cano",
      view_url:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ],

  async inicializarDocumentos() {
    await storeValue("adminDocumentosVista", "LISTADO", false);
    await storeValue("adminDocumentoSeleccionado", null, false);
  },

  async verDocumento(documento) {
    if (!documento?.document_id) {
      showAlert("No fue posible identificar el documento.", "warning");
      return;
    }

    await storeValue(
      "adminDocumentoSeleccionado",
      documento,
      false
    );

    await storeValue(
      "adminDocumentosVista",
      "VISOR",
      false
    );
  },

  async volverDocumentos() {
    await storeValue(
      "adminDocumentosVista",
      "LISTADO",
      false
    );
  },

  async generarActaPrototipo() {
    showAlert(
      "La generación del acta se conectará posteriormente con el backend.",
      "info"
    );
  },

  async subirDocumentoPrototipo() {
    const archivos = fpAdminCargarDocumento.files || [];
    const tipo = slAdminTipoDocumento.selectedOptionValue;

    if (!tipo) {
      showAlert(
        "Selecciona el tipo de documento.",
        "warning"
      );
      return;
    }

    if (!archivos.length) {
      showAlert(
        "Selecciona un archivo para cargar.",
        "warning"
      );
      return;
    }

    showAlert(
      "Documento validado en el prototipo. La carga definitiva será realizada por el backend.",
      "success"
    );

    resetWidget("fpAdminCargarDocumento", true);
    resetWidget("inpAdminDescripcionDocumento", true);
    resetWidget("slAdminTipoDocumento", true);
  },

  async descargarDocumento(documento) {
    if (!documento?.view_url) {
      showAlert(
        "El documento no tiene una dirección de descarga disponible.",
        "warning"
      );
      return;
    }

    download(
      documento.view_url,
      documento.nombre_archivo || "documento.pdf"
    );
  },

  async limpiarDetalleUsuario() {
    await storeValue("adminDocumentosVista", "LISTADO", false);
    await storeValue("adminDocumentoSeleccionado", null, false);
  }
};
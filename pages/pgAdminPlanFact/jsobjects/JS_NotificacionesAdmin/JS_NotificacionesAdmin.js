export default {
  async guardarBandeja(inbox) {
    await storeValue(
      "erp_admin_notification_inbox",
      inbox,
      false
    );

    await storeValue(
      "erp_admin_unread_count",
      inbox.unread_count || 0,
      false
    );
  },

  async cargarBandeja(abrirModal = false) {
    const inbox = await qGetMyInAppNotifications.run();

    if (!inbox?.ok) {
      throw new Error("No fue posible cargar las notificaciones.");
    }

    await this.guardarBandeja(inbox);

    if (abrirModal) {
      showModal("mdlAdminNotificaciones");
    }

    return inbox;
  },

  async inicializarBandeja() {
    try {
      // La guardia de página redirige si no existe o venció la sesión.
      if (!JS_GuardiaSesion.sesionEstaVigente()) {
        return;
      }

      await this.cargarBandeja(false);
    } catch (error) {
      const sessionClosed =
        await JS_GuardiaSesion.manejarErrorDeSesion(error);

      if (!sessionClosed) {
        console.warn(
          "No fue posible inicializar la bandeja de notificaciones.",
          error
        );
      }
    }
  },

  async abrirBandeja() {
    try {
      const sessionIsActive =
        await JS_GuardiaSesion.asegurarSesionActiva();

      if (!sessionIsActive) {
        return;
      }

      await this.cargarBandeja(true);
    } catch (error) {
      const sessionClosed =
        await JS_GuardiaSesion.manejarErrorDeSesion(error);

      if (!sessionClosed) {
        showAlert(
          error?.message || "No fue posible abrir las notificaciones.",
          "error"
        );
      }
    }
  },

  async marcarComoLeida(deliveryId) {
    try {
      const sessionIsActive =
        await JS_GuardiaSesion.asegurarSesionActiva();

      if (!sessionIsActive) {
        return;
      }

      await storeValue(
        "erp_admin_selected_notification_delivery_id",
        deliveryId,
        false
      );

      const result = await qMarkMyInAppNotificationRead.run();

      if (!result?.ok) {
        throw new Error(
          "No fue posible marcar la notificación como leída."
        );
      }

      await this.cargarBandeja(false);

      showAlert(
        "Notificación marcada como leída.",
        "success"
      );
    } catch (error) {
      const sessionClosed =
        await JS_GuardiaSesion.manejarErrorDeSesion(error);

      if (!sessionClosed) {
        showAlert(
          error?.message || "No fue posible actualizar la notificación.",
          "error"
        );
      }
    }
  },

  async atenderNotificacion(deliveryId) {
    try {
      const sessionIsActive =
        await JS_GuardiaSesion.asegurarSesionActiva();

      if (!sessionIsActive) {
        return;
      }

      await storeValue(
        "erp_admin_selected_notification_delivery_id",
        deliveryId,
        false
      );

      const result =
        await qAcknowledgeMyInAppNotificatio.run();

      if (!result?.ok) {
        throw new Error(
          "No fue posible atender la notificación."
        );
      }

      await this.cargarBandeja(false);

      showAlert(
        "Notificación atendida.",
        "success"
      );
    } catch (error) {
      const sessionClosed =
        await JS_GuardiaSesion.manejarErrorDeSesion(error);

      if (!sessionClosed) {
        showAlert(
          error?.message || "No fue posible atender la notificación.",
          "error"
        );
      }
    }
  },

  cerrarBandeja() {
    closeModal("mdlAdminNotificaciones");
  }
};
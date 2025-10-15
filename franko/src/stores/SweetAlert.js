import { defineStore } from 'pinia';
import Swal from 'sweetalert2';


export const useSweetAlertStore = defineStore ('SweetAlert', {
  actions: {
    showAlert(title, message, icon = 'error') {
      Swal.fire({
        icon: icon,
        title: title,
        text: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
      })
    },
    //alert success
    success (message, title ="success!") {
      Swal.fire({
        title,
        text: message,
        icon: "success",
        confirmButtonColor: "#a54c03",
        background: "#1a1f27",
        color: "#fff",
        toast: true,
        timer:2000,
        position: 'top-end',
      });
    },

    //error alert

    error (message, title = "Error!") {
        Swal.fire({
        title,
        text: message,
        icon: "error",
        confirmButtonColor: "#a54c03",
        background: "#1a1f27",
        color: "#fff",
        toast: true,
        timer:3000,
        position: 'top-end',
      });
    },

    //alert informations

    info (message, title = "Information") {

        Swal.fire({
        title,
        text: message,
        icon: "info",
        confirmButtonColor: "#a54c03",
        background: "#1a1f27",
        color: "#fff",
        toast: true,
        timer:3000,
        position: 'top-end',
      });
    },

    confirm(message, title = "Are you sure", confirmText = "yes") {
        return Swal.fire({
        title,
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#a54c03",
        background: "#1a1f27",
        color: "#fff",
        toast: true,
        timer: 2000,
        position: 'top-end',
      });
    },

  }

})

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const showToast = (message, type, autoClose = 3000) => {
  toast[type](message, {
    theme: 'colored',
    autoClose: autoClose,
    position: 'bottom-right'
  })
}

import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastProvider = () => {
  return <ToastContainer transition={Slide} autoClose={3000} />
}

export default ToastProvider

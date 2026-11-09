import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import store from './store/store.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
   
   <Provider store={store}>
     <App />
   </Provider>

<ToastContainer
position="top-right"
autoClose={2500}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
 bodyClassName="toastBody"
transition={Bounce}
/>
  </StrictMode>,
)

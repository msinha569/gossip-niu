import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Body from './pages/Body.jsx'
import { FirebaseProvider } from './context/firebase.jsx'
import SignUp from './components/SignUp.jsx'
import { Toaster } from 'react-hot-toast'
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <div>You Encountred an Error!</div>,
    children: [
      {
        path: "/",
        element: <Body/>
      },
      {
        path: "/contact",
        element: <Contact/>
      },
      {
        path: "/about",
        element: <About/>
      },
      {
        path: "/signup",
        element: <SignUp/>
      }

    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster/>
    <FirebaseProvider>
    <RouterProvider router={appRouter}>
    <App />
    </RouterProvider>
    </FirebaseProvider>
  </StrictMode>,
)

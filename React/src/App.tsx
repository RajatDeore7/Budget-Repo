import { AuthProvider } from "./providers/AuthProvider";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from 'react-router-dom';
import { Router } from '@/routes';

function App() {
  return (
      <BrowserRouter>
          <AuthProvider>
              <Router />
              <ToastContainer />
          </AuthProvider>
      </BrowserRouter>
  );
}

export default App;

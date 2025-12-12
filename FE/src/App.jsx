import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import TitleManager from "./router/TitleManager";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
      <TitleManager />
      <Toaster position="top-center" />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;

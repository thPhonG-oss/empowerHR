import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import TitleManager from "./router/TitleManager";
function App() {
  return (
    <BrowserRouter>
      <TitleManager />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;

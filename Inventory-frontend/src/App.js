// import "./Styles.css";
// import "./AddedStyles.css";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./component/authentication/UserAuthContext";

import MainRouting from "./component/moduleRouting/MainRouting";
function App() {
  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        <MainRouting />
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Login from "./Login";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Navbar />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

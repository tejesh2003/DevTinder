import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Login from "./Login";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";

function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/*" element={<Layout />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

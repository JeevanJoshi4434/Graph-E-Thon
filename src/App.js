import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import Admin from "./Pages/Admin/Admin";
import Checkout from "./Pages/Checkout/Checkout";
import Home from "./Pages/Home/Home";
import Orders from "./Pages/Admin/Orders";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}
       ></Route>
      <Route path="/Login" element={<Login />}
       ></Route>
      <Route path="/signup" element={<Signup />}
       ></Route>
      <Route path="/dashboard" element={<Admin />}
       ></Route>
      <Route path="/dashboard/orders" element={<Orders />}
       ></Route>
      <Route path="/checkout" element={<Checkout />}
       ></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;

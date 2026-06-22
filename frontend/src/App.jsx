import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import Expenses from "./pages/Expenses";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import api from "./services/api";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await api.get('auth/user/');
        setUser(resp.data.user);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (

    <BrowserRouter>

      <Navbar user={user} setUser={setUser} />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/add-product"
          element={<AddProduct />}
        />
        <Route
          path="/edit-product/:id"
          element={<EditProduct />}
        />
        <Route
          path="/orders"
          element={<Orders />}
        />
        <Route
          path="/expenses"
          element={<Expenses />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>

  );
}

 

 

export default App;
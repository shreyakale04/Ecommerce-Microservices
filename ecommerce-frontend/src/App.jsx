import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import Inventory from "./pages/Inventory";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/products" element={<Products />} />

                <Route path="/inventory" element={<Inventory />} />

                <Route path="/orders" element={<Orders />} />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/add-product"
                    element={<AddProduct />}
                />



            </Routes>
        </BrowserRouter>
    );
}

export default App;
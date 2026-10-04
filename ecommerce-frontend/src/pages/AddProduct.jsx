import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AddProduct() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/products",
                {
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price),
                    category: formData.category,
                    quantity: Number(formData.quantity)
                }
            );

            console.log("Product created:", response.data);

            setMessage("Product added successfully!");

            setTimeout(() => {
                navigate("/products");
            }, 1000);

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data ||
                "Failed to add product"
            );
        }
    };

    return (
        <div>

            <h1>Add Product</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Product name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <textarea
                    name="description"
                    placeholder="Product description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">
                    Add Product
                </button>

            </form>

            <p>{message}</p>

        </div>
    );
}

export default AddProduct;
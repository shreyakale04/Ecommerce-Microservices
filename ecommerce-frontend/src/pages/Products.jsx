import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUserRole } from "../utils/jwt";
import { useNavigate } from "react-router-dom";

function Products() {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const role = getUserRole();

    // Add Product form
    const [showForm, setShowForm] = useState(false);

    // Edit Product form
    const [showEditForm, setShowEditForm] = useState(false);

    // Product form data
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: ""
    });

    // Product ID being edited
    const [editProductId, setEditProductId] = useState(null);


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================

    const fetchProducts = async () => {

        try {

            const response = await api.get("/products");

            console.log("Products:", response.data);

            setProducts(response.data);
            setError("");

        } catch (error) {

            console.error(error);

            setError("Failed to load products");
        }
    };


    // =====================================================
    // LOAD PRODUCTS WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        fetchProducts();

    }, []);


    // =====================================================
    // ADD PRODUCT
    // =====================================================

    const handleAddProduct = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/products",
                {
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    category: product.category,
                    quantity: Number(product.quantity)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Product added successfully!");

            // Clear form
            setProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                quantity: ""
            });

            // Close form
            setShowForm(false);

            // Reload products
            fetchProducts();

        } catch (error) {

            console.error("Error adding product:", error);

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert("Unauthorized. Please login again.");

            } else {

                alert("Failed to add product");
            }
        }
    };


    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const handleEditClick = (product) => {

        setEditProductId(product.id);

        setProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            quantity: product.quantity
        });

        setShowEditForm(true);

        // Close Add form if it is open
        setShowForm(false);
    };


    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    const handleUpdateProduct = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/products/${editProductId}`,
                {
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    category: product.category,
                    quantity: Number(product.quantity)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Product updated successfully!");

            // Clear form
            setProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                quantity: ""
            });

            // Clear ID
            setEditProductId(null);

            // Close edit form
            setShowEditForm(false);

            // Reload products
            fetchProducts();

        } catch (error) {

            console.error("Error updating product:", error);

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert("Unauthorized. Please login again.");

            } else {

                alert("Failed to update product");
            }
        }
    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDeleteProduct = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Product deleted successfully!");

            // Reload products
            fetchProducts();

        } catch (error) {

            console.error("Error deleting product:", error);

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert("Unauthorized. Please login again.");

            } else {

                alert("Failed to delete product");
            }
        }
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancelEdit = () => {

        setShowEditForm(false);

        setEditProductId(null);

        setProduct({
            name: "",
            description: "",
            price: "",
            category: "",
            quantity: ""
        });
    };


    // =====================================================
    // CANCEL ADD
    // =====================================================

    const handleCancelAdd = () => {

        setShowForm(false);

        setProduct({
            name: "",
            description: "",
            price: "",
            category: "",
            quantity: ""
        });
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div>

            {/* ========================================= */}
            {/* PAGE TITLE */}
            {/* ========================================= */}

            <h1>Products</h1>

            <p>Your Role: {role}</p>

            <button onClick={() => navigate("/inventory")}>
                Inventory
            </button>


            {/* ========================================= */}
            {/* ADD PRODUCT BUTTON */}
            {/* ========================================= */}

            {role === "ROLE_ADMIN" && (

                <button
                    onClick={() => {
                        setShowForm(true);
                        setShowEditForm(false);
                    }}
                >
                    Add Product
                </button>

            )}


            {/* ========================================= */}
            {/* ADD PRODUCT FORM */}
            {/* ========================================= */}

            {showForm && role === "ROLE_ADMIN" && (

                <form onSubmit={handleAddProduct}>

                    <h2>Add Product</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <button type="submit">
                        Save Product
                    </button>

                    <button
                        type="button"
                        onClick={handleCancelAdd}
                    >
                        Cancel
                    </button>

                </form>

            )}


            {/* ========================================= */}
            {/* EDIT PRODUCT FORM */}
            {/* ========================================= */}

            {showEditForm && role === "ROLE_ADMIN" && (

                <form onSubmit={handleUpdateProduct}>

                    <h2>Edit Product</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <button type="submit">
                        Update Product
                    </button>

                    <button
                        type="button"
                        onClick={handleCancelEdit}
                    >
                        Cancel
                    </button>

                </form>

            )}


            {/* ========================================= */}
            {/* ERROR MESSAGE */}
            {/* ========================================= */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ========================================= */}
            {/* NO PRODUCTS */}
            {/* ========================================= */}

            {products.length === 0 && !error && (

                <p>
                    No products found.
                </p>

            )}


            {/* ========================================= */}
            {/* PRODUCT LIST */}
            {/* ========================================= */}

            {products.map((product) => (

                <div key={product.id}>

                    <h2>
                        {product.name}
                    </h2>

                    <p>
                        Description: {product.description}
                    </p>

                    <p>
                        Price: ₹{product.price}
                    </p>

                    <p>
                        Category: {product.category}
                    </p>

                    <p>
                        Quantity: {product.quantity}
                    </p>


                    {/* ================================= */}
                    {/* ADMIN ACTIONS */}
                    {/* ================================= */}

                    {role === "ROLE_ADMIN" && (

                        <div>

                            <button
                                onClick={() =>
                                    handleEditClick(product)
                                }
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleDeleteProduct(product.id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    )}

                    <hr />

                </div>

            ))}

        </div>
    );
}

export default Products;
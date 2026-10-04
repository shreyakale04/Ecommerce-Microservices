import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUserRole } from "../utils/jwt";

function Inventory() {

    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");

    const role = getUserRole();

    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const [stock, setStock] = useState({
        productId: "",
        quantity: ""
    });

    const [editProductId, setEditProductId] = useState(null);


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        setStock({
            ...stock,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // GET ALL INVENTORY
    // =====================================================

    const fetchInventory = async () => {

        try {

            const response = await api.get("/inventory");

            console.log("Inventory:", response.data);

            setInventory(response.data);

            setError("");

        } catch (error) {

            console.error("Error loading inventory:", error);

            setError("Failed to load inventory");
        }
    };


    // =====================================================
    // LOAD INVENTORY WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        fetchInventory();

    }, []);


    // =====================================================
    // ADD INVENTORY
    // =====================================================

    const handleAddInventory = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/inventory",
                {
                    productId: Number(stock.productId),
                    quantity: Number(stock.quantity)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Inventory added successfully!");

            setStock({
                productId: "",
                quantity: ""
            });

            setShowForm(false);

            fetchInventory();

        } catch (error) {

            console.error("Error adding inventory:", error);

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert("Unauthorized. Please login again.");

            } else {

                alert("Failed to add inventory");
            }
        }
    };


    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const handleEditClick = (item) => {

        setEditProductId(item.productId);

        setStock({
            productId: item.productId,
            quantity: item.quantity
        });

        setShowEditForm(true);

        setShowForm(false);
    };


    // =====================================================
    // UPDATE INVENTORY
    // =====================================================

    const handleUpdateInventory = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/inventory/product/${editProductId}`,
                {
                    productId: Number(stock.productId),
                    quantity: Number(stock.quantity)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Inventory updated successfully!");

            setStock({
                productId: "",
                quantity: ""
            });

            setEditProductId(null);

            setShowEditForm(false);

            fetchInventory();

        } catch (error) {

            console.error("Error updating inventory:", error);

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert("Unauthorized. Please login again.");

            } else {

                alert("Failed to update inventory");
            }
        }
    };


    // =====================================================
    // REDUCE STOCK
    // =====================================================

    const handleReduceStock = async (productId) => {

        const quantity = prompt(
            "Enter quantity to reduce:"
        );

        if (!quantity) {
            return;
        }

        if (Number(quantity) <= 0) {

            alert("Quantity must be greater than 0");

            return;
        }

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/inventory/product/${productId}/reduce`,
                null,
                {
                    params: {
                        quantity: Number(quantity)
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Stock reduced successfully!");

            fetchInventory();

        } catch (error) {

            console.error("Error reducing stock:", error);

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert("Unauthorized. Please login again.");

            } else {

                alert("Failed to reduce stock");
            }
        }
    };


    // =====================================================
    // DELETE INVENTORY
    // =====================================================

    const handleDeleteInventory = async (productId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this inventory?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/inventory/product/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Inventory deleted successfully!");

            fetchInventory();

        } catch (error) {

            console.error("Error deleting inventory:", error);

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert("Unauthorized. Please login again.");

            } else {

                alert("Failed to delete inventory");
            }
        }
    };


    // =====================================================
    // CANCEL ADD
    // =====================================================

    const handleCancelAdd = () => {

        setShowForm(false);

        setStock({
            productId: "",
            quantity: ""
        });
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancelEdit = () => {

        setShowEditForm(false);

        setEditProductId(null);

        setStock({
            productId: "",
            quantity: ""
        });
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div>

            <h1>Inventory</h1>

            <p>Your Role: {role}</p>


            {/* ========================================= */}
            {/* ADD INVENTORY BUTTON */}
            {/* ========================================= */}

            {role === "ROLE_ADMIN" && (

                <button
                    onClick={() => {

                        setShowForm(true);
                        setShowEditForm(false);

                    }}
                >
                    Add Inventory
                </button>

            )}


            {/* ========================================= */}
            {/* ADD INVENTORY FORM */}
            {/* ========================================= */}

            {showForm && role === "ROLE_ADMIN" && (

                <form onSubmit={handleAddInventory}>

                    <h2>Add Inventory</h2>

                    <input
                        type="number"
                        name="productId"
                        placeholder="Product ID"
                        value={stock.productId}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={stock.quantity}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <button type="submit">
                        Save Inventory
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
            {/* EDIT INVENTORY FORM */}
            {/* ========================================= */}

            {showEditForm && role === "ROLE_ADMIN" && (

                <form onSubmit={handleUpdateInventory}>

                    <h2>Edit Inventory</h2>

                    <input
                        type="number"
                        name="productId"
                        placeholder="Product ID"
                        value={stock.productId}
                        onChange={handleChange}
                        disabled
                    />

                    <br />
                    <br />

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={stock.quantity}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />

                    <button type="submit">
                        Update Inventory
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
            {/* ERROR */}
            {/* ========================================= */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ========================================= */}
            {/* EMPTY INVENTORY */}
            {/* ========================================= */}

            {inventory.length === 0 && !error && (

                <p>
                    No inventory found.
                </p>

            )}


            {/* ========================================= */}
            {/* INVENTORY LIST */}
            {/* ========================================= */}

            {inventory.map((item) => (

                <div key={item.id}>

                    <h2>
                        Product ID: {item.productId}
                    </h2>

                    <p>
                        Inventory ID: {item.id}
                    </p>

                    <p>
                        Quantity: {item.quantity}
                    </p>


                    {/* ================================= */}
                    {/* ADMIN ACTIONS */}
                    {/* ================================= */}

                    {role === "ROLE_ADMIN" && (

                        <div>

                            <button
                                onClick={() =>
                                    handleEditClick(item)
                                }
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleReduceStock(item.productId)
                                }
                            >
                                Reduce Stock
                            </button>

                            <button
                                onClick={() =>
                                    handleDeleteInventory(
                                        item.productId
                                    )
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

export default Inventory;
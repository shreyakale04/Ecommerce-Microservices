import { useEffect, useState } from "react";
import api from "../api/axios";
import {getUserRole, getUserEmail} from "../utils/jwt";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    const role = getUserRole();

    const [showForm, setShowForm] = useState(false);

    const [order, setOrder] = useState({
        productId: "",
        quantity: "",
        customerEmail: ""
    });


    // =====================================================
    // GET LOGGED-IN USER EMAIL
    // =====================================================

   const customerEmail = getUserEmail();


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        setOrder({
            ...order,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // GET ORDERS
    // ADMIN  -> GET ALL ORDERS
    // USER   -> GET ONLY OWN ORDERS
    // =====================================================

    const fetchOrders = async () => {

        try {

            setError("");

            let response;

            if (role === "ROLE_ADMIN") {

                response = await api.get("/orders");

            } else {

                if (!customerEmail) {
                    setError("Customer email not found. Please login again.");
                    return;
                }

                response = await api.get(
                    `/orders/customer/${encodeURIComponent(customerEmail)}`
                );
            }

            console.log("Orders:", response.data);

            setOrders(response.data);

        } catch (error) {

            console.error("Error loading orders:", error);

            if (error.response?.status === 401) {

                setError("Unauthorized. Please login again.");

            } else if (error.response?.status === 403) {

                setError("Access denied.");

            } else {

                setError("Failed to load orders");
            }
        }
    };


    // =====================================================
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {

        fetchOrders();

    }, [role, customerEmail]);


    // =====================================================
    // CREATE ORDER
    // =====================================================

    const handleCreateOrder = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            // Use logged-in email automatically
            const email =
                customerEmail || order.customerEmail;

            await api.post(
                "/orders",
                {
                    productId: Number(order.productId),
                    quantity: Number(order.quantity),
                    customerEmail: email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Order created successfully!");

            // Reset form
            setOrder({
                productId: "",
                quantity: "",
                customerEmail: ""
            });

            setShowForm(false);

            // Reload orders
            fetchOrders();

        } catch (error) {

            console.error(
                "Error creating order:",
                error
            );

            if (error.response?.status === 400) {

                alert(
                    error.response?.data?.message ||
                    "Invalid order or insufficient stock."
                );

            } else if (error.response?.status === 403) {

                alert("Access denied.");

            } else if (error.response?.status === 401) {

                alert(
                    "Unauthorized. Please login again."
                );

            } else if (error.response?.status === 404) {

                alert(
                    error.response?.data?.message ||
                    "Product or inventory not found."
                );

            } else {

                alert("Failed to create order");
            }
        }
    };


    // =====================================================
    // UPDATE ORDER STATUS
    // ADMIN ONLY
    // =====================================================

    const handleUpdateStatus = async (
        id,
        status
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            await api.put(
                `/orders/${id}/status`,
                null,
                {
                    params: {
                        status: status
                    },

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                `Order status changed to ${status}`
            );

            fetchOrders();

        } catch (error) {

            console.error(
                "Error updating order status:",
                error
            );

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert(
                    "Unauthorized. Please login again."
                );

            } else {

                alert(
                    "Failed to update order status"
                );
            }
        }
    };


    // =====================================================
    // CANCEL ORDER
    // ADMIN ONLY
    // =====================================================

    const handleCancelOrder = async (id) => {

        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );

        if (!confirmCancel) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            await api.delete(
                `/orders/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Order cancelled successfully!"
            );

            fetchOrders();

        } catch (error) {

            console.error(
                "Error cancelling order:",
                error
            );

            if (error.response?.status === 403) {

                alert("Access denied. ADMIN only.");

            } else if (error.response?.status === 401) {

                alert(
                    "Unauthorized. Please login again."
                );

            } else {

                alert("Failed to cancel order");
            }
        }
    };


    // =====================================================
    // CANCEL CREATE FORM
    // =====================================================

    const handleCancelForm = () => {

        setShowForm(false);

        setOrder({
            productId: "",
            quantity: "",
            customerEmail: ""
        });
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div>

            <h1>Orders</h1>

            <p>
                Your Role: {role}
            </p>

            {role !== "ROLE_ADMIN" && (
                <p>
                    Customer: {customerEmail}
                </p>
            )}


            {/* ========================================= */}
            {/* PLACE ORDER BUTTON */}
            {/* ========================================= */}

            <button
                onClick={() => setShowForm(true)}
            >
                Place Order
            </button>


            {/* ========================================= */}
            {/* CREATE ORDER FORM */}
            {/* ========================================= */}

            {showForm && (

                <form
                    onSubmit={handleCreateOrder}
                >

                    <h2>Place Order</h2>


                    {/* PRODUCT ID */}

                    <input
                        type="number"
                        name="productId"
                        placeholder="Product ID"
                        value={order.productId}
                        onChange={handleChange}
                        required
                    />

                    <br />
                    <br />


                    {/* QUANTITY */}

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={order.quantity}
                        onChange={handleChange}
                        min="1"
                        required
                    />

                    <br />
                    <br />


                    {/* CUSTOMER EMAIL */}

                    {role === "ROLE_ADMIN" ? (

                        <input
                            type="email"
                            name="customerEmail"
                            placeholder="Customer Email"
                            value={order.customerEmail}
                            onChange={handleChange}
                            required
                        />

                    ) : (

                        <input
                            type="email"
                            value={customerEmail || ""}
                            readOnly
                        />

                    )}

                    <br />
                    <br />


                    {/* SUBMIT */}

                    <button type="submit">
                        Place Order
                    </button>


                    {/* CANCEL */}

                    <button
                        type="button"
                        onClick={handleCancelForm}
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
            {/* NO ORDERS */}
            {/* ========================================= */}

            {orders.length === 0 && !error && (

                <p>
                    No orders found.
                </p>

            )}


            {/* ========================================= */}
            {/* ORDER LIST */}
            {/* ========================================= */}

            {orders.map((item) => (

                <div key={item.id}>

                    <h2>
                        Order #{item.id}
                    </h2>


                    <p>
                        Product ID: {item.productId}
                    </p>


                    <p>
                        Quantity: {item.quantity}
                    </p>


                   <p>
                       Price: ₹{Number(item.price).toLocaleString("en-IN")}
                   </p>

                   <p>
                       Total Amount: ₹
                       {(Number(item.price) * Number(item.quantity))
                           .toLocaleString("en-IN")}
                   </p>docker compose up -d


                    <p>
                        Customer:
                        {" "}
                        {item.customerEmail}
                    </p>


                    <p>
                        Status:
                        {" "}
                        <strong>
                            {item.status}
                        </strong>
                    </p>


                    {/* ================================= */}
                    {/* ADMIN ACTIONS */}
                    {/* ================================= */}

                    {role === "ROLE_ADMIN" && (

                        <div>

                            {/* CONFIRM */}

                            {item.status === "CREATED" && (

                                <button
                                    onClick={() =>
                                        handleUpdateStatus(
                                            item.id,
                                            "CONFIRMED"
                                        )
                                    }
                                >
                                    Confirm Order
                                </button>

                            )}


                            {/* CANCEL */}

                            {item.status !== "CANCELLED" && (

                                <button
                                    onClick={() =>
                                        handleCancelOrder(
                                            item.id
                                        )
                                    }
                                >
                                    Cancel Order
                                </button>

                            )}

                        </div>

                    )}

                    <hr />

                </div>

            ))}

        </div>
    );
}

export default Orders;
import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/my-orders/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                setOrders(response.data);
            } catch (err) {
                setError("Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto mt-5 p-5">
            <h2 className="text-2xl font-bold mb-4">My Order History</h2>
            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Order ID</th>
                                <th className="py-2 px-4 border">Date</th>
                                <th className="py-2 px-4 border">Total Price</th>
                                <th className="py-2 px-4 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="py-2 px-4 border">{order.id}</td>
                                    <td className="py-2 px-4 border">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border">${order.total_price}</td>
                                    <td className="py-2 px-4 border">
                                        <span className={`px-2 py-1 rounded-full text-white ${order.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default OrderHistory;

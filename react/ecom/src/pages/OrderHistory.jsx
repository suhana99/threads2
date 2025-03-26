import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 
import { Button } from "reactstrap";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
  const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/my-orders/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                console.log(response.data); // Log the response to check the delivery_status value
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
        <div className="container mx-auto mt-5 text-center">
            {/* <h2 className="text-2xl font-bold mb-4">My Order History</h2> */}
            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {orders.length > 0 ? (
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <table className="min-w-full bg-white border border-gray-200 shadow-md" style={{ align:'center'}}>
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Order ID</th>
                                <th className="py-2 px-4 border">Date</th>
                                <th className="py-2 px-4 border">Product Details</th>
                                <th className="py-2 px-4 border">Quantity</th>
                                <th className="py-2 px-4 border">Total Price</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                {order.items.map((item, index) => (
                                    <tr key={item.id} className="border-t">
                                        {index === 0 && (
                                            <>
                                                <td className="py-4 px-4 border text-center font-semibold" rowSpan={order.items.length}>
                                                    {order.id}
                                                </td>
                                                <td className="py-4 px-4 border text-center font-semibold" rowSpan={order.items.length}>
                                                    {new Date(order.created_date).toLocaleDateString()}
                                                </td>
                                            </>
                                        )}
               <td className="py-4 px-4 border !text-left cursor-pointer" onClick={() => navigate(`/product/${item.product_id}`)}>
                    <div style={{display:'flex', justifyContent:'start', alignItems:'center'}}>
                        <img src={item.product_image} alt={item.product_name} className="object-cover" style={{ maxHeight: '60px', minHeight: '60px', minWidth: '50px' }} />
                        <span className="whitespace-nowrap">&nbsp;{item.product_name}</span>
                    </div>
                </td>

                <td className="py-4 px-4 border text-center">{item.quantity}</td>
                {index === 0 && (
                    <>
                        <td className="py-4 px-4 border text-center font-semibold" rowSpan={order.items.length}>
                            ${order.total_price}
                        </td>
                        <td className="py-4 px-4 border text-center" rowSpan={order.items.length}>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium 
                                ${order.delivery_status.trim() === 'Pending' ? 'bg-yellow-500' : 
                                order.delivery_status === 'Packed' ? 'bg-blue-500' : 
                                order.delivery_status === 'Out for delivery' ? 'bg-orange-500' : 
                                order.delivery_status === 'Delivered' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                {order.delivery_status}
                            </span>
                        </td>
                    </>
                )}
                <td className="py-4 px-4 border text-center"><Button>Review</Button> &emsp; <Button>Cancel</Button></td>
            </tr>
        ))}
    </React.Fragment>
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

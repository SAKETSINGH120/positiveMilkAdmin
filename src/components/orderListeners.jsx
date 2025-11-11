import { useEffect } from "react";
import { io } from "socket.io-client";
import { notification } from "antd";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// const socket = io(BASE_URL);

function OrderListener({ role }) {
    const navigate = useNavigate();
    const { vendor } = useAuth();
    const vendorId = vendor?._id; // or vendor?.id, depending on your data

    useEffect(() => {
        // console.log(BASE_URL)
        const socket = io(BASE_URL, {
            query: {
                userId: vendorId,
                role: role
            }
        });

        const navigateTo = (role) => {
            if (role == 'vendor') {
                navigate(`/vendor/order`)
            } else {
                navigate(`/admin/order`)
            }
            notification.destroy();
        }

        socket.on("new-order", (order) => {
            const audio = new Audio("/audio.mp3");
            audio.play();

            // Show notification
            notification.open({
                message: "🛎️ New Order Received",
                description: (
                    <div className="text-sm">
                        <p><strong>Order ID:</strong> {order._id || 'New Order'}</p>
                        <p><strong>Customer:</strong> {order.customerName || 'Name'}</p>
                        <p><strong>Items:</strong> {order.items?.length}</p>
                        <p className="text-blue-600 underline mt-2 cursor-pointer"
                            onClick={() => navigateTo(role)}>
                            View Order Details
                        </p>
                    </div>
                ),
                duration: 0, // stays until user interacts
                placement: "bottomRight",
                style: {
                    width: 350,
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }
            });

            // console.log("New order received:", order);
        });

        return () => {
            socket.off("new-order");
        };
    }, [navigate, vendorId]);

    return null;
}

export default OrderListener;

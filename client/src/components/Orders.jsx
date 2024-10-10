import React, { useEffect, useState } from "react";
import { query, where, getDocs, collection, db } from "../firebase"; 
import { toast } from "react-toastify";
import jsPDF from "jspdf"; 
import { ClipLoader } from "react-spinners"; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 
  const userEmail = localStorage.getItem("email"); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userEmail) {
          toast.error("User email not found. Please login.");
          setLoading(false);
          return;
        }

       
        const ordersQuery = query(
          collection(db, "orders"),
          where("userEmail", "==", userEmail)
        );
        const querySnapshot = await getDocs(ordersQuery);

      
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (fetchedOrders.length === 0) {
          toast.info("No orders found.");
        }

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        toast.error("Failed to retrieve orders.");
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, [userEmail]);

 
  const generateInvoice = (order) => {
    const doc = new jsPDF();


    doc.setFontSize(20);
    doc.text("Trendzilla", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

  
    doc.setFontSize(16);
    doc.text("Invoice", doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });


    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 50);
    doc.text(`Email: ${userEmail}`, 20, 60);
    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      20,
      70
    ); 

    let yOffset = 80;
    order.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - $${item.price} x ${item.quantity}`,
        20,
        yOffset
      );
      yOffset += 10; 
    });


    doc.text(`Total: $${order.totalAmount}`, 20, yOffset + 10);

 
    doc.save(`invoice_${order.id}.pdf`);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {/* Display user email */}
      {userEmail && (
        <p className="text-lg mb-6 text-gray-600">
          Logged in as: <span className="font-semibold">{userEmail}</span>
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          {/* Display the loading spinner */}
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {" "}
          {/* Add max-width and center the cards */}
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-lg font-bold mb-2">Order ID: {order.id}</h2>
              <p className="text-gray-500 mb-2">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}{" "}
                {/* Display formatted order date */}
              </p>
              <ul className="mb-2">
                {order.items.map((item, index) => (
                  <li key={index} className="mb-1">
                    {item.name} - ${item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="font-bold">Total: ${order.totalAmount}</p>

              {/* Download Invoice Button */}
              <button
                onClick={() => generateInvoice(order)}
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Download Invoice
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

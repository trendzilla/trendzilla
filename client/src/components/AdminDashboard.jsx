import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"; 
import { db } from "../firebase"; 
import { FiEdit, FiPlus, FiX } from "react-icons/fi"; 

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("products");
  const [products, setProducts] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null); 
  const [isSaving, setIsSaving] = useState(false); 
  const [saveStatus, setSaveStatus] = useState(""); 
  const storage = getStorage(); 

  // Fetch users from Firebase
  const fetchUsers = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map((doc) => doc.data());
    setUsers(usersList);
  };

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    const ordersCollection = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersCollection);
    const ordersList = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(ordersList);
  };

  // Fetch products from Firebase
  const fetchProducts = async () => {
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);
    const productsList = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsList);
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchProducts();
  }, []);

  
  const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null); 
        return;
      }

      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {}, 
        (error) => reject(error),
        async () => {
          
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

 
  const handleAddProduct = async () => {
    try {
      setIsSaving(true); 
      setSaveStatus(""); 

      const imageUrl = await uploadImageToStorage(imageFile); 

      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        image: imageUrl,
        category: newProduct.category,
      });

      setShowAddProduct(false); 
      fetchProducts(); 
      setNewProduct({ name: "", price: "", image: "", category: "" }); 
      setImageFile(null); 

      setSaveStatus("Saved"); 
    } catch (error) {
      console.error("Error adding product: ", error);
    } finally {
      setIsSaving(false); 
    }
  };


  const handleSaveEdit = async () => {
    try {
      setIsSaving(true); 
      setSaveStatus(""); 

      const imageUrl = editImageFile
        ? await uploadImageToStorage(editImageFile)
        : editProduct.image; 

      const productRef = doc(db, "products", editProductId);
      await updateDoc(productRef, {
        name: editProduct.name,
        price: parseFloat(editProduct.price),
        image: imageUrl,
        category: editProduct.category,
      });

      setEditProductId(null); 
      fetchProducts(); 
      setEditImageFile(null);

      setSaveStatus("Saved"); 
    } catch (error) {
      console.error("Error updating product: ", error);
    } finally {
      setIsSaving(false); 
    }
  };

  // Handle file input for image
  const handleImageUpload = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file); 
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="mb-4 space-x-4">
        <button
          onClick={() => setActiveSection("users")}
          className={`px-4 py-2 ${
            activeSection === "users" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveSection("orders")}
          className={`px-4 py-2 ${
            activeSection === "orders"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveSection("products")}
          className={`px-4 py-2 ${
            activeSection === "products"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Products
        </button>
      </div>

      {/* Users Section */}
      {activeSection === "users" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index} className="border p-4 mb-2">
                  <p>Email: {user.email}</p>
                  <p>Created At: {user.createdAt}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Orders Section */}
      {activeSection === "orders" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="border p-4 mb-2">
                  <p>Order ID: {order.id}</p>
                  <p>User Email: {order.userEmail}</p>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - ${item.price} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p>Total: ${order.totalAmount}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Products Section */}
      {activeSection === "products" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Products</h2>

          {/* Add Product Form */}
          {showAddProduct && (
            <div className="mb-6 p-4 border rounded-lg shadow-lg bg-white max-w-lg mx-auto">
              <h3 className="text-xl font-bold mb-4">Add New Product</h3>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Product Name"
                className="p-2 border rounded w-full mb-4"
              />
              <input
                type="text"
                name="price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="Product Price"
                className="p-2 border rounded w-full mb-4"
              />
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                placeholder="Product Category"
                className="p-2 border rounded w-full mb-4"
              />
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, setImageFile)}
                className="p-2 border rounded w-full mb-4"
              />
              <button
                onClick={handleAddProduct}
                className="bg-green-500 text-white px-4 py-2 rounded-full"
              >
                {isSaving ? "Saving..." : saveStatus || "Save"}
              </button>
            </div>
          )}

          {/* Add Product Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
            >
              <FiPlus size={24} className="mr-2" />
              Add New Product
            </button>
          </div>

          {/* Display products in horizontal cards */}
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center border p-4 rounded-lg shadow-md"
              >
                <div className="w-24">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="ml-6 flex-grow">
                  {editProductId === product.id ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={editProduct.name}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            name: e.target.value,
                          })
                        }
                        className="p-2 border rounded mb-2 w-full"
                        placeholder="Product Name"
                      />
                      <input
                        type="text"
                        name="price"
                        value={editProduct.price}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            price: e.target.value,
                          })
                        }
                        className="p-2 border rounded mb-2 w-full"
                        placeholder="Product Price"
                      />
                      <input
                        type="text"
                        name="category"
                        value={editProduct.category}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            category: e.target.value,
                          })
                        }
                        className="p-2 border rounded mb-2 w-full"
                        placeholder="Product Category"
                      />
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, setEditImageFile)}
                        className="p-2 border rounded mb-2 w-full"
                      />
                      <div className="flex space-x-4">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          {isSaving ? "Saving..." : saveStatus || "Save"}
                        </button>
                        <button
                          onClick={() => setEditProductId(null)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          <FiX size={20} />
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>ID: {product.id}</p>
                      <p>Name: {product.name}</p>
                      <p>Price: ${product.price.toFixed(2)}</p>
                      <p>Category: {product.category}</p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditProductId(product.id);
                    setEditProduct({ ...product });
                  }}
                  className="ml-4 text-blue-500 hover:text-blue-700"
                >
                  <FiEdit size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

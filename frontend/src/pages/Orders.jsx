import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

function Orders() {

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [items, setItems] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      const customerRes = await API.get("/customers/");
      const productRes = await API.get("/products/");

      setCustomers(customerRes.data);
      setProducts(productRes.data);

    };

    fetchData();

  }, []);

  const addItem = () => {

    setItems([
      ...items,
      {
        product_id: parseInt(productId),
        quantity: parseInt(quantity)
      }
    ]);

    setProductId("");
    setQuantity("");
  };

  const createOrder = async () => {

    await API.post("/orders/", {
      customer_id: parseInt(customerId),
      items: items
    });

    alert("Order created!");

    setItems([]);
  };

  return (

    <div>

      <Navbar />

      <div style={{ marginLeft: "220px", padding: "30px" }}>

        <h1>Create Order</h1>

        <h3>Select Customer</h3>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >

          <option value="">Select Customer</option>

          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}

        </select>

        <hr />

        <h3>Add Product</h3>

        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >

          <option value="">Select Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}

        </select>

        <input
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={addItem}>
          Add Item
        </button>

        <hr />

        <h3>Order Items</h3>

        <ul>

          {items.map((item, index) => {

            const product = products.find(p => p.id === item.product_id);

            return (
              <li key={index}>
                {product?.name} - Qty: {item.quantity}
              </li>
            );

          })}

        </ul>

        <button onClick={createOrder}>
          Create Order
        </button>

      </div>

    </div>
  );
}

export default Orders;
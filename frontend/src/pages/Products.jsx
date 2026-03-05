import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function Products() {

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const fetchProducts = async () => {
    const res = await API.get("/products/");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {

    await API.post("/products/", {
      name: name,
      sku: sku,
      price: parseFloat(price),
      stock_quantity: parseInt(stock)
    });

    setName("");
    setSku("");
    setPrice("");
    setStock("");

    fetchProducts();
  };

  return (

    <div>

      <Navbar />

      <div style={{ marginLeft: "220px", padding: "30px" }}>

        <h1>Products</h1>

        <h3>Add Product</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button onClick={addProduct}>
          Add Product
        </button>

        <hr />

        <h3>Product List</h3>

        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>

            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.price}</td>
                <td>{p.stock_quantity}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Products;
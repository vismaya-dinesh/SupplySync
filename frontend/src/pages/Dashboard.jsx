import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      const res = await API.get("/dashboard/overview");
      setData(res.data);

    };

    fetchData();

  }, []);

  if (!data) return <h3>Loading...</h3>;

  return (
    <div>

      <Navbar />

      <div style={{marginLeft: "220px", padding: "30px"}}>

        <h1>Dashboard</h1>

        <h3>Total Revenue: {data.total_revenue}</h3>
        <h3>Total Orders: {data.total_orders}</h3>
        <h3>Total Products: {data.total_products}</h3>
        <h3>Total Customers: {data.total_customers}</h3>

        <h3>Low Stock Products</h3>

        <ul>
          {data.low_stock_products.map((p) => (
            <li key={p.id}>
              {p.name} (Stock: {p.stock_quantity})
            </li>
          ))}
        </ul>

      </div>

    </div>
  );
}

export default Dashboard;
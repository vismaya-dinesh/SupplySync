import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      width: "200px",
      background: "#222",
      color: "white",
      height: "100vh",
      padding: "20px",
      position: "fixed"
    }}>

      <h2>SupplySync</h2>

      <ul style={{listStyle: "none", padding: 0}}>
        <li><Link to="/dashboard" style={{color: "white"}}>Dashboard</Link></li>
        <li><Link to="/products" style={{color: "white"}}>Products</Link></li>
        <li><Link to="/customers" style={{color: "white"}}>Customers</Link></li>
        <li><Link to="/orders" style={{color: "white"}}>Orders</Link></li>
      </ul>

    </div>
  );
}

export default Navbar;
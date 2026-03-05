import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

function Customers() {

  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchCustomers = async () => {
    const res = await API.get("/customers/");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async () => {

    await API.post("/customers/", {
      name: name,
      email: email,
      phone: phone,
      address: address
    });

    setName("");
    setEmail("");
    setPhone("");
    setAddress("");

    fetchCustomers();
  };

  return (

    <div>

      <Navbar />

      <div style={{ marginLeft: "220px", padding: "30px" }}>

        <h1>Customers</h1>

        <h3>Add Customer</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button onClick={addCustomer}>
          Add Customer
        </button>

        <hr />

        <h3>Customer List</h3>

        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>

            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Customers;
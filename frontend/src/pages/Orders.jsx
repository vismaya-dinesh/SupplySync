import { useEffect, useState } from "react";
import API from "../api/api";

import DashboardLayout from "../layout/DashboardLayout";
import PageTransition from "../components/PageTransition";

import {
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack
} from "@mui/material";

function Orders() {

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [items, setItems] = useState([]);

  const fetchData = async () => {

    try {

      const customerRes = await API.get("/customers/");
      const productRes = await API.get("/products/");

      setCustomers(customerRes.data);
      setProducts(productRes.data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  const addItem = () => {

    if (!productId || !quantity) return;

    const product = products.find(p => p.id === productId);

    setItems([
      ...items,
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity)
      }
    ]);

    setProductId("");
    setQuantity("");

  };

  const removeItem = (index) => {

    const updated = [...items];
    updated.splice(index, 1);

    setItems(updated);

  };

  const createOrder = async () => {

    try {

      await API.post("/orders/", {
        customer_id: parseInt(customerId),
        items: items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity
        }))
      });

      alert("Order created successfully");

      setItems([]);

    } catch (err) {

      console.error(err);

    }

  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (

    <DashboardLayout>

      <PageTransition>

        <Typography variant="h4" gutterBottom>
          Create Order
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>

            <Card>

              <CardContent>

                <Typography variant="h6" gutterBottom>
                  Select Customer
                </Typography>

                <Select
                  fullWidth
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >

                  {customers.map(c => (

                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>

                  ))}

                </Select>

              </CardContent>

            </Card>

          </Grid>

        </Grid>

        <Card sx={{ mt: 3 }}>

          <CardContent>

            <Typography variant="h6" gutterBottom>
              Add Products
            </Typography>

            <Stack direction="row" spacing={2}>

              <Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                sx={{ minWidth: 200 }}
              >

                {products.map(p => (

                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>

                ))}

              </Select>

              <TextField
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={addItem}
              >
                Add
              </Button>

            </Stack>

          </CardContent>

        </Card>

        <Card sx={{ mt: 3 }}>

          <CardContent>

            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Action</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {items.map((item, index) => (

                  <TableRow key={index}>

                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.price * item.quantity}
                    </TableCell>

                    <TableCell>

                      <Button
                        color="error"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

            <Typography sx={{ mt: 2 }}>
              Total: ₹{totalPrice}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={createOrder}
            >
              Create Order
            </Button>

          </CardContent>

        </Card>

      </PageTransition>

    </DashboardLayout>

  );

}

export default Orders;
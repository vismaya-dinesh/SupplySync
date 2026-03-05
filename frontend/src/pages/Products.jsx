import { useEffect, useState } from "react";
import API from "../api/api";

import DashboardLayout from "../layout/DashboardLayout";
import PageTransition from "../components/PageTransition";

import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

function Products() {

  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {

    try {

      const res = await API.get("/products/");

      setProducts(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  const handleOpen = () => {

    setEditingProduct(null);

    setName("");
    setPrice("");
    setStockQuantity("");

    setOpen(true);

  };

  const handleEdit = (product) => {

    setEditingProduct(product);

    setName(product.name);
    setPrice(product.price);
    setStockQuantity(product.stock_quantity);

    setOpen(true);

  };

  const handleClose = () => {

    setOpen(false);

  };

  const handleSubmit = async () => {

    try {

      const payload = {
        name,
        price,
        stock_quantity: parseInt(stockQuantity)
      };

      if (editingProduct) {

        await API.put(`/products/${editingProduct.id}`, payload);

      } else {

        await API.post("/products/", payload);

      }

      fetchProducts();

      handleClose();

    } catch (err) {

      console.error(err);

    }

  };

  const handleDelete = async (id) => {

    try {

      await API.delete(`/products/${id}`);

      fetchProducts();

    } catch (err) {

      console.error(err);

    }

  };

  const columns = [

    {
      field: "name",
      headerName: "Product",
      flex: 1
    },

    {
      field: "price",
      headerName: "Price",
      flex: 1
    },

    {
      field: "stock_quantity",
      headerName: "Stock",
      flex: 1,
      renderCell: (params) => {

        const qty = params.row.stock_quantity;

        return (
          <Chip
            label={qty}
            color={qty < 10 ? "error" : "success"}
          />
        );

      }
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (

        <Stack direction="row" spacing={1}>

          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>

        </Stack>

      )
    }

  ];

  return (

    <DashboardLayout>

      <PageTransition>

        <Typography variant="h4" gutterBottom>
          Products
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={handleOpen}
        >
          Add Product
        </Button>

        <div style={{ height: 450, width: "100%" }}>

          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row.id}
          />

        </div>

        <Dialog open={open} onClose={handleClose}>

          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>

          <DialogContent>

            <TextField
              label="Product Name"
              fullWidth
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Price"
              fullWidth
              margin="dense"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <TextField
              label="Stock Quantity"
              fullWidth
              margin="dense"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />

          </DialogContent>

          <DialogActions>

            <Button onClick={handleClose}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Save
            </Button>

          </DialogActions>

        </Dialog>

      </PageTransition>

    </DashboardLayout>

  );

}

export default Products;
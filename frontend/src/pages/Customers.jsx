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
  Stack
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

function Customers() {

  const [customers, setCustomers] = useState([]);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingCustomer, setEditingCustomer] = useState(null);

  const fetchCustomers = async () => {

    try {

      const res = await API.get("/customers/");

      setCustomers(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    fetchCustomers();

  }, []);

  const handleOpen = () => {

    setEditingCustomer(null);

    setName("");
    setEmail("");

    setOpen(true);

  };

  const handleEdit = (customer) => {

    setEditingCustomer(customer);

    setName(customer.name);
    setEmail(customer.email);

    setOpen(true);

  };

  const handleClose = () => {

    setOpen(false);

  };

  const handleSubmit = async () => {

    try {

      if (editingCustomer) {

        await API.put(`/customers/${editingCustomer.id}`, {
          name,
          email
        });

      } else {

        await API.post("/customers/", {
          name,
          email
        });

      }

      fetchCustomers();

      handleClose();

    } catch (err) {

      console.error(err);

    }

  };

  const handleDelete = async (id) => {

    try {

      await API.delete(`/customers/${id}`);

      fetchCustomers();

    } catch (err) {

      console.error(err);

    }

  };

  const columns = [

    {
      field: "name",
      headerName: "Customer Name",
      flex: 1
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1
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
          Customers
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={handleOpen}
        >
          Add Customer
        </Button>

        <div style={{ height: 450, width: "100%" }}>

          <DataGrid
            rows={customers}
            columns={columns}
            getRowId={(row) => row.id}
          />

        </div>

        <Dialog open={open} onClose={handleClose}>

          <DialogTitle>
            {editingCustomer ? "Edit Customer" : "Add Customer"}
          </DialogTitle>

          <DialogContent>

            <TextField
              label="Customer Name"
              fullWidth
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default Customers;
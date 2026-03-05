import { useEffect, useState } from "react";
import API from "../api/api";

import DashboardLayout from "../layout/DashboardLayout";
import PageTransition from "../components/PageTransition";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Stack,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";

function Dashboard() {

  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchData = async () => {

    try {

      const overviewRes = await API.get("/dashboard/overview");
      const productsRes = await API.get("/dashboard/top-products");
      const ordersRes = await API.get("/dashboard/recent-orders");

      setOverview(overviewRes.data);

      const cleanedProducts = productsRes.data.map((p) => ({
        name: p.name,
        quantity: Number(p.total_sold) || 0
      }));

      setTopProducts(cleanedProducts);

      setRecentOrders(ordersRes.data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  if (!overview) return null;

  const maxQuantity =
    topProducts.length > 0
      ? Math.max(...topProducts.map(p => p.quantity))
      : 1;

  return (

    <DashboardLayout>

      <PageTransition>

        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* ANALYTICS CARDS */}

        <Grid container spacing={3}>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg,#667eea,#764ba2)",
                color: "white",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)" }
              }}
            >
              <CardContent>

                <Box display="flex" justifyContent="space-between">

                  <Box>

                    <Typography variant="h6">
                      Total Revenue
                    </Typography>

                    <Typography variant="h4">
                      ₹{overview.total_revenue}
                    </Typography>

                  </Box>

                  <AttachMoneyIcon sx={{ fontSize: 40 }} />

                </Box>

              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg,#43cea2,#185a9d)",
                color: "white",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)" }
              }}
            >
              <CardContent>

                <Box display="flex" justifyContent="space-between">

                  <Box>

                    <Typography variant="h6">
                      Orders
                    </Typography>

                    <Typography variant="h4">
                      {overview.total_orders}
                    </Typography>

                  </Box>

                  <ShoppingCartIcon sx={{ fontSize: 40 }} />

                </Box>

              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg,#f7971e,#ffd200)",
                color: "white",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)" }
              }}
            >
              <CardContent>

                <Box display="flex" justifyContent="space-between">

                  <Box>

                    <Typography variant="h6">
                      Products
                    </Typography>

                    <Typography variant="h4">
                      {overview.total_products}
                    </Typography>

                  </Box>

                  <InventoryIcon sx={{ fontSize: 40 }} />

                </Box>

              </CardContent>
            </Card>
          </Grid>

        </Grid>


        {/* LOW STOCK */}

        <Typography variant="h6" sx={{ mt: 5 }}>
          ⚠ Low Stock Products
        </Typography>

        {overview.low_stock_products.length === 0 ? (

          <Typography color="text.secondary">
            All products have healthy stock.
          </Typography>

        ) : (

          <List>

            {overview.low_stock_products.map((product) => (

              <ListItem key={product.id}>

                <ListItemText
                  primary={product.name}
                  secondary={`Stock left: ${product.stock_quantity}`}
                />

              </ListItem>

            ))}

          </List>

        )}


        {/* RECENT ORDERS */}

        <Typography variant="h6" sx={{ mt: 5 }}>
          Recent Orders
        </Typography>

        {recentOrders.length === 0 ? (

          <Typography color="text.secondary">
            No orders yet.
          </Typography>

        ) : (

          <List>

            {recentOrders.map((order) => (

              <ListItem key={order.order_id}>

                <ListItemText
                  primary={
                    order.products
                      .map(p => `${p.product_name} (${p.quantity})`)
                      .join(", ")
                  }
                  secondary={`₹${order.total_amount} • ${order.created_at}`}
                />

              </ListItem>

            ))}

          </List>

        )}


        {/* TOP SELLING PRODUCTS */}

        <Typography
          variant="h6"
          sx={{ mt: 5, mb: 2 }}
        >
          Top Selling Products
        </Typography>

        {topProducts.length === 0 ? (

          <Typography color="text.secondary">
            No sales data yet.
          </Typography>

        ) : (

          <Stack spacing={2}>

            {topProducts.map((product, index) => {

              const progressValue =
                maxQuantity > 0
                  ? (product.quantity / maxQuantity) * 100
                  : 0;

              return (

                <Box key={index}>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5
                    }}
                  >

                    <Typography fontWeight={500}>
                      {index + 1}. {product.name}
                    </Typography>

                    <Typography color="text.secondary">
                      {product.quantity} sold
                    </Typography>

                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 10,
                      borderRadius: 5
                    }}
                  />

                </Box>

              );

            })}

          </Stack>

        )}

      </PageTransition>

    </DashboardLayout>

  );

}

export default Dashboard;
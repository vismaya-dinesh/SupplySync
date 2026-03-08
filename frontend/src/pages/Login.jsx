import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";

import { motion } from "framer-motion";

function Login() {

  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {

    try {

      if (isRegister) {

        await API.post("/auth/register", {
          username,
          email,
          password
        });

        alert("Registration successful");

        setIsRegister(false);

      } else {

        const res = await API.post("/auth/login", {
          email,
          password
        });

        localStorage.setItem("token", res.data.access_token);

        navigate("/dashboard");

      }

    } catch (error) {

      console.log(error.response);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (

    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc"
      }}
    >

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

        <Card sx={{ width: 400 }}>

          <CardContent>

            <Typography
              variant="h4"
              align="center"
              gutterBottom
            >
              SupplySync
            </Typography>

            <Typography
              variant="h6"
              align="center"
              gutterBottom
            >
              {isRegister ? "Create Account" : "Login"}
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>

              {isRegister && (

                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

              )}

              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                {isRegister ? "Register" : "Login"}
              </Button>

              <Button
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? "Already have an account? Login"
                  : "Create new account"}
              </Button>

            </Stack>

          </CardContent>

        </Card>

      </motion.div>

    </Box>

  );

}

export default Login;
"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";

export default function AddParty() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    type: "customer",
  });

  const handleSubmit = async () => {
    await fetch("/api/party", {
      method: "POST",
      body: JSON.stringify(form),
    });
    //extra functionalities
if (!form.name) {
  alert("Name required");
  return;
}
    alert("Party Added ✅");

    setForm({
      name: "",
      phone: "",
      address: "",
      type: "customer",
    });
  };

  return (
    <Box p={3}   sx={{
    height: '100%',
    bgcolor: 'white',
    borderRadius: '10px',
    m: '50px',
    p: '20px',
    border: '1px solid #ccc'  // 👈 add this
  }}>
      <Typography variant="h5" mb={2}>
        Add Party
      </Typography>

      <TextField
        label="Name"
        fullWidth
        sx={{ mb: 2 }}
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <TextField
        label="Phone"
        fullWidth
        sx={{ mb: 2 }}
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <TextField
        label="Address"
        fullWidth
        sx={{ mb: 2 }}
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />

      <TextField
        select
        label="Type"
        fullWidth
        sx={{ mb: 2 }}
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      >
        <MenuItem value="customer">Customer</MenuItem>
        <MenuItem value="supplier">Supplier</MenuItem>
      </TextField>

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Save Party
      </Button>
    </Box>
  );
}
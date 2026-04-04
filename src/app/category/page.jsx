"use client";

import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import PDFHandler from "../components/PDFHandler";
import TransactionDialog from "../components/TransactionDialog";

export default function Category() {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const router = useRouter();

  // 🔄 Load Parties
  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then(setParties);
  }, []);

  // 🔍 Filter
  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Open Modal (FIXED)
  const handleOpen = (party, type) => {
    setSelectedParty(party);

    setInitialValues({
      pName: "",
      amount: "",
      mode: "cash",
      date: "",
      details: "",
      type: type, // 🔥 important
        isEdit: false,
    });

    setOpen(true);
  };

  // ✅ Save
  const handleSave = async (data) => {
    if (!selectedParty) return alert("No party selected ❌");
    if (!data.amount) return alert("Enter amount ❌");

    await fetch("/api/category", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        party_id: selectedParty.id,
      }),
    });

    alert("Transaction Saved ✅");
    setOpen(false);
    setInitialValues(null);
  };

  return (
    <Box p={3}>
      <Grid item xs={12} sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h5">
        Transactions
      </Typography>
       <Tooltip title="Add Party">
          <Button
            variant="contained"
            onClick={() => router.push("/master/add-party")}
            sx={{
              backgroundColor: "#268581",
              borderRadius: "50%",
              minWidth: "40px",
              height: "40px",
              padding: 0,
            }}
          >
            <AddIcon sx={{ color: "#fff" }} fontSize="small" />
          </Button>
        </Tooltip>
        </Grid>

      {/* 🔍 Search */}
      <TextField
        fullWidth
        placeholder="Search party..."
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ Add Button */}
      <Grid item xs={12} sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
       
      </Grid>

      {/* 📋 Party List */}
      {filtered.map((p) => (
        <Card
          key={p.id}
          sx={{
            mb: 2,
            borderRadius: 3,
            boxShadow: 2,
            transition: "0.2s",
            "&:hover": {
              boxShadow: 6,
              transform: "scale(1.01)",
            },
          }}
        >
          <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => router.push(`/ledger/${p.id}`)}
            >
              {p.name}
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleOpen(p, "receive")}
              >
                Receive
              </Button>

              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleOpen(p, "payment")}
              >
                Payment
              </Button>
            </Box>
          </CardContent>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <PDFHandler party={p} act="preview" />
          </Box>
        </Card>
      ))}

      {/* ✅ SINGLE Dialog (FIXED) */}
      <TransactionDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialValues={initialValues}
        section="category"
      />
    </Box>
  );
}
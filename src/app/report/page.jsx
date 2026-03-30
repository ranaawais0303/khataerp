"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
} from "@mui/material";

export default function Report() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // 🔍 Filter
  const filtered = data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 Totals
  const totalReceive = filtered
    .filter((p) => p.balance > 0)
    .reduce((sum, p) => sum + p.balance, 0);

  const totalPay = filtered
    .filter((p) => p.balance < 0)
    .reduce((sum, p) => sum -( p.balance), 0);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Overall Report
      </Typography>

      {/* 🔍 Search */}
      <TextField
        fullWidth
        placeholder="Search party..."
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 💰 Summary */}
      <Box mb={2}>
        <Typography color="green">
          You Will Receive: Rs {Math.abs(totalReceive)}
        </Typography>

        <Typography color="red">
          You Will Pay: Rs {Math.abs(totalPay)}
        </Typography>
      </Box>

      {/* 📋 List */}
      {filtered.map((p) => (
        <Card key={p.id} sx={{ mb: 1 }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ mb: 1, cursor: "pointer" }} onClick={() => router.push(`/ledger/${p.id}`)}>
            
            {p.name}</Typography>

            <Typography
              sx={{
                color: p.balance >= 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              Rs {p.balance}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
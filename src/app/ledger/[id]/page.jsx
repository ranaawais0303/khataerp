"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";

export default function Ledger() {
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);

  // 📥 Fetch transactions
  useEffect(() => {
    fetch("/api/transactions", {
      method: "PUT",
      body: JSON.stringify({ party_id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        // ✅ Convert amount to number
        const parsed = data.map((t) => ({
          ...t,
          amount: parseFloat(t.amount),
        }));

        // ✅ Calculate running balance
        let runningBalance = 0;

        const withBalance = parsed.map((t) => {
          if (t.type === "receive") {
            runningBalance += t.amount;
          } else {
            runningBalance -= t.amount;
          }

          return {
            ...t,
            balance: runningBalance,
          };
        });

        setTransactions(withBalance);
      });
  }, [id]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Ledger
      </Typography>

      {transactions.map((t, i) => (
        <Card key={i} sx={{ mb: 1 }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Left Side */}
            <Box>
              <Typography fontWeight="bold">
                {t.type === "receive" ? "Received" : "Paid"}
              </Typography>

              <Typography variant="body2">
                {t.details}
              </Typography>
            </Box>

            {/* Right Side */}
            <Box textAlign="right">
              <Typography
                sx={{
                  color: t.type === "receive" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {t.type === "receive" ? "+" : "-"} Rs {t.amount}
              </Typography>

              <Typography variant="caption">
                {t.date}
              </Typography>

              <Typography variant="caption" display="block">
                Balance: {t.balance}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
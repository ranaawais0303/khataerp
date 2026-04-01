"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import PDFHandler from "@/app/components/PDFHandler";
import { handlePreview } from "@/app/utils/utils";

export default function Ledger() {
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [category, setCategory]=useState("")

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
      <Typography  variant="h5" mb={2}>
        Ledger {category?category.name:''}
      </Typography>
      <Typography variant="bold" display="block" >
                Balance: {category?.balance}
              </Typography>
      
               
            
      {transactions.map((t, i) => {
  //      const bgColor =
  // t.type === "receive" ? "#e8f5e9" : "#fdecea"; // soft bg

const borderColor =
  t.type === "receive" ? "#2e7d32" : "#d32f2f";
        
        setCategory(t)
        return <Box key={i}>  
        <Card key={i} s  sx={{
    mb: 2,
    borderRadius: 3,
    boxShadow: 3,
    bgcolor: "#fff",
    borderLeft: `6px solid ${borderColor}`,
    transition: "0.2s",
    "&:hover": {
      boxShadow: 6,
      transform: "scale(1.01)",
    },
  }} >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Left Side */}
            <Box>
              <Typography fontWeight="bold">
                {t.type === "receive" ? "Received from" : "Paid to"} {t.pName}
              </Typography>

              <Typography variant="body2">
                {t.details}
              </Typography>
            </Box>

            {/* Right Side */}
            <Box textAlign="right">

            <Typography variant="caption">
              {t.date}
            </Typography>
              <Typography
                sx={{
                  color: t.type === "receive" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {t.type === "receive" ? "+" : "-"} Rs {t.amount}
              </Typography>
<Button size="small" onClick={(e) => handlePreview(t)}>
        Preview
      </Button>
            
              {/* <PDFHandler party={t} act={"preview"}/> */}
            </Box>
          </CardContent>
        </Card></Box>
})}
    </Box>
  );
}
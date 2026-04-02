"use client";

// import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Grid } from "@mui/material";
import Header from "./components/Header";

export default function Dashboard() {
  const router = useRouter();

  return (
    <Box p={3}>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button

          sx={{borderRadius:'10px', backgroundColor:'#5e1269'}}
            fullWidth
            variant="contained"
            onClick={() => router.push("/master")}
          >
            Master
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
          sx={{borderRadius:'10px',backgroundColor:'#064d25'}}
            fullWidth
            variant="contained"
            onClick={() => router.push("/transactions")}
          >
            Transactions
          </Button>
        </Grid>
        
        <Grid item xs={6}>
          <Button
          sx={{borderRadius:'10px',backgroundColor:'#bf930d'}}
            fullWidth
            variant="contained"
            onClick={() => router.push("/report")}
          >
            Report
          </Button>
        </Grid>

         <Grid item xs={6}>
          <Button
          sx={{borderRadius:'10px',backgroundColor:'#5f4ea6'}}
            fullWidth
            variant="contained"
            onClick={() => router.push("/category")}
          >
            Category
          </Button>
        </Grid>


        <Grid item xs={6}>
          <Button
          sx={{borderRadius:'10px',backgroundColor:'#268581'}}
           fullWidth variant="contained">
            Sales (Coming)
          </Button>
        </Grid>
                                                                                                  
        <Grid item xs={6}>
          <Button 
          sx={{borderRadius:'10px',backgroundColor:'#bf430d'}}
          fullWidth variant="contained">
            Purchase (Coming)
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
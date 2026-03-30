"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Typography, Grid } from "@mui/material";

export default function Master() {
  const router = useRouter();


  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Master
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            sx={{backgroundColor:'#268581'}}
            fullWidth
            variant="contained"
            onClick={() => router.push("/master/add-party")}
          >
            Add Party
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button 
          sx={{backgroundColor:'#bf430d'}}
          fullWidth variant="contained">
            Add Item
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button 
           sx={{backgroundColor:'#bf930d'}}
          fullWidth variant="contained">
            Add Units
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
           sx={{backgroundColor:'#5e1269'}}
           fullWidth variant="contained">
            Add Opening
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
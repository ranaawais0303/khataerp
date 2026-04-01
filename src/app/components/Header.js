"use client";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Header = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    // <AppBar sx={{
    //   marginBottom:'10px',
    //   borderRadius:'10px'
    // }}position="sticky" color="primary">
    //   <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    //     <Typography variant="h6" component="div">
    //       Mehboob Enterprises
    //     </Typography>


    //   </Toolbar>
    // </AppBar>
<AppBar sx={{
   width: 'calc(100% - 32px)', // 👈 space left+right
    mx: 'auto',
    borderRadius: '10px',
    my:'10px'
      // marginBottom:'10px',
      // borderRadius:'10px'
    }}position="sticky" color="primary">
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    
    <IconButton color="inherit" onClick={() => router.back()}>
      <ArrowBackIcon />
    </IconButton>

    <Typography variant="h6">
      <Link href="/" style={{ color: "white", textDecoration: "none" }}>
        Mehboob Enterprises
      </Link>
    </Typography>

  </Toolbar>
</AppBar>
  );
};

export default Header;
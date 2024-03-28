import React from "react";
import { Button } from "@mui/material";
import { CiSettings } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";

const NavBar = ({side, setSide, navClick, setNavClick}) => {
  const navigation = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("cross");
    navigation("/");
  };
  return (
    <div>
      <header className="page-header sticky-top px-xl-4 px-sm-2 px-0 py-lg-2 py-1">
        <div className="container-fluid">
          <nav className="navbar">
            {/* start: toggle btn */}
            <div className="d-flex">
              <button
                type="button"
                id="hamb-icon"
                className="btn btn-link d-none d-xl-block sidebar-mini-btn p-0 text-primary"
              >
                <span className="hamburger-icon" onClick={()=>setNavClick(!navClick)}>
                  <span className="line" />
                  <span className="line" />
                  <span className="line" />
                </span>
              </button>
              
              <a
                href="index.html"
                className="brand-icon d-flex align-items-center mx-2 mx-sm-3 text-primary"
              ></a>
              <button
              id="hamb-icon-res"
                type="button"
                className="btn btn-link d-block d-xl-none menu-toggle p-0 text-primary"
              >
                <span className="hamburger-icon" onClick={()=>{setSide(!side)}}>
                  <span className="line" />
                  <span className="line" />
                  <span className="line" />
                </span>
              </button>
              <h3 style={{ marginLeft: "20px", marginBottom: "0" }}>
                Welcome Insta-e-Mart
              </h3>
            </div>

            {/* start: link */}
            <ul className="header-right justify-content-end d-flex align-items-center mb-0">
              {/* start: notifications dropdown-menu */}

              <Button
                variant="contained"
                style={{
                  backgroundColor: "#00AC9A",
                  height: "40px",
                  width: "100px",
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default NavBar;

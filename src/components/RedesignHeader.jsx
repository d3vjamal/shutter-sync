import React from "react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => ({
  marginRight: 12,
  textDecoration: "none",
  fontWeight: isActive ? "700" : "500",
});

export default function RedesignHeader() {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid #e6e6e6" }}>
      <nav>
        <NavLink to="/" style={linkClass}>
          Home
        </NavLink>
        <NavLink to="/dashboard" style={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/photographers" style={linkClass}>
          Photographers
        </NavLink>
      </nav>
    </header>
  );
}

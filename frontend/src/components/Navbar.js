import React, { } from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div id="container-navbar">
          <NavLink to="/" className="navbar-brand">
            TellTheWarden
          </NavLink>
            <ul className="navbar-nav ms-auto">
              {user &&
                <li className="nav-item">
                  <span className="nav-link">Log Out</span>
                </li>
              }
            </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

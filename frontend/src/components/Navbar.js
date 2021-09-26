import React, { } from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container">
          <NavLink to="/" className="navbar-brand">
            Complaint Filing System
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navmenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navmenu">
            <ul className="navbar-nav ms-auto">
              {user && 
                  user.role === "admin" && 
                      <li className="nav-item">
                        <NavLink
                          to="/collectors"
                          className="nav-link"
                          activeClassName="nav-link active"
                        >
                          Log Out
                        </NavLink>
                      </li>
}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

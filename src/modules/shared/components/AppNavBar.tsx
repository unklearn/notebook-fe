import React from "react";
import logo from "../../../logo.svg";
import "./AppNavBar.css";

export const AppNavBar: React.FC = () => {
  return (
    <nav
      className="navbar App-navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a
          className="navbar-item"
          href="/"
          style={{
            alignItems: "start",
          }}
        >
          <img
            src={logo}
            width="40px"
            height="40px"
            alt="Unklearn logo"
            style={{ height: "40px", width: "40px" }}
          />
          <h3
            className="title is-3"
            style={{ margin: "0px", marginLeft: "10px", fontWeight: 900 }}
          >
            Unklearn
          </h3>
        </a>

        <a
          href=""
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          {/* <a className="navbar-item">
        Notebook demo
      </a> */}
          {/*
      <a className="navbar-item">
        Documentation
      </a>

      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">
          More
        </a>

        <div className="navbar-dropdown">
          <a className="navbar-item">
            About
          </a>
          <a className="navbar-item">
            Jobs
          </a>
          <a className="navbar-item">
            Contact
          </a>
          <hr className="navbar-divider"/>
          <a className="navbar-item">
            Report an issue
          </a>
        </div>
      </div> */}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {/* <a className="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a className="button is-light">
            Log in
          </a> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

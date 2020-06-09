import React, { useState, useEffect } from "react";
import { useHistory, NavLink as RRNavLink } from "react-router-dom";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button } from "reactstrap";
// import Login from "../home/Login";
// import Home from "../home/Home";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    token: "",
    id: "",
  });
  const history = useHistory();
  const token = localStorage.getItem("auth-token");

  const checkUserLoggedIn = async () => {
    if (token) {
      const tokenRes = await axios.post(
        "http://localhost:9090/tokenIsValid",

        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setLoggedIn(true);
      console.log(tokenRes);
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const register = () => history.push("/register");

  const login = () => history.push("/login");

  const home = () => history.push("/home");
  const startpage = () => history.push("/");

  const goOut = () => {
    history.push("/startpage");
  };

  const logOut = () => {
    setUserData({
      token: "",
      id: "",
    });
    // localStorage.setItem("auth-token", "");
    // localStorage.setItem("id", "");
    localStorage.removeItem("id");
    localStorage.removeItem("auth-token");
    // window.location.reload();
    goOut();
  };

  return (
    <>
      <Navbar color="dark" light expand="md" dark>
        <NavbarBrand href="/">Wish list</NavbarBrand>
        <Nav className="mr-auto" className="mr-10" navbar>
          {token ? (
            <>
              {/* <NavLink
                to="/wishlist"
                activeClassName="active"
                tag={RRNavLink}
                onClick={wishlist}
              >
                Wish list
              </NavLink> */}
              <Button color="primary" onClick={logOut}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink
                  to="/register"
                  activeClassName="active"
                  tag={RRNavLink}
                  onClick={register}
                >
                  Register
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/login"
                  activeClassName="active"
                  tag={RRNavLink}
                  onClick={login}
                >
                  Log in
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar>
    </>
  );
}

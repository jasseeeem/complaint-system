// import './App.css';
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Home from "./components/Home.js";
import Navbar from "./components/Navbar.js";
import AddComplaint from "./components/AddComplaint.js";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const changeUser = async(data) => {
    setUser(data);
  }

  const [hostelTypes, setHostelTypes] = useState([
    {
      label: "A Hostel",
      value: 1,
    },
    {
      label: "B Hostel",
      value: 2,
    },
    {
      label: "C Hostel",
      value: 3,
    },
    {
        label: "D Hostel",
        value: 4,
      },
      {
        label: "E Hostel",
        value: 5,
      },
      {
        label: "F Hostel",
        value: 6,
      },
      {
        label: "G Hostel",
        value: 7,
      },
      {
        label: "Mega Hostel",
        value: 8,
      },
      {
        label: "PG1 Hostel",
        value: 9,
      },
      {
          label: "PG2 Hostel",
          value: 10,
        },
        {
          label: "INH Hostel",
          value: 11,
        },
        {
          label: "MBA Hostel",
          value: 12,
        },
        {
          label: "IDM Hostel",
          value: 13,
        },
        {
          label: "LH Hostel",
          value: 14,
        }
  ])

  useEffect(() => {
    (async () => {
      let [userVerifyResponse, usersResponse] =
          await Promise.all([
            fetch(process.env.REACT_APP_API_URL + "/users/verify/", {
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }),
            fetch(process.env.REACT_APP_API_URL + "/users/", {
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            })
          ]);

      if (userVerifyResponse.ok) {
      userVerifyResponse = await userVerifyResponse.json()
        setUser(userVerifyResponse);
      } else {
        setUser(null);
      }
      if (usersResponse.ok) {
      usersResponse = await usersResponse.json()
        // console.log(userVerifyResponse)
        setUsers(userVerifyResponse);
      } else {
        setUsers([]);
      }
      setLoading(true);
    })();
  }, []);

  return (
    <div>
      {loading && 
      <BrowserRouter>
        <div className="front">
          <div>
            <Navbar user={user} />
          </div>
          <div className="container">
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Home user={user} users={users} hostelTypes={hostelTypes} />
            )}
          />
          <Route
            path="/login"
            exact
            render={() => (
              <Login user={user} changeUser={changeUser} />
            )}
          />
          <Route
            path="/signup"
            exact
            render={() => (
              <Signup user={user} changeUser={changeUser} />
            )}
          />
          <Route
            path="/add"
            exact
            render={() => (
              <AddComplaint user={user} hostelTypes={hostelTypes} />
            )}
          />
        </Switch>
        </div>
        </div>
      </BrowserRouter>
}
    </div>
  );
}

export default App;

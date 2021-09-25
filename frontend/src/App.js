// import './App.css';
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Home from "./components/Home.js";
import AddComplaint from "./components/AddComplaint.js";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const changeUser = async(data) => {
    setUser(data);
  }

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
      userVerifyResponse = await userVerifyResponse.json()
      usersResponse = await usersResponse.json()

      if (userVerifyResponse.ok) {
        setUser(userVerifyResponse);
      } else {
        setUser(null);
      }
      if (userVerifyResponse.ok) {
        console.log(userVerifyResponse)
        // setUsers(userVerifyResponse);
      } else {
        setUsers([]);
      }
      setLoading(true);
    })();
  }, []);

  return (
    <div className="container">
      {loading && 
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Home user={user} users={users} />
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
              <AddComplaint user={user} />
            )}
          />
        </Switch>
      </BrowserRouter>
}
    </div>
  );
}

export default App;

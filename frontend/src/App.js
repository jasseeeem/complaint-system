// import './App.css';
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Home from "./components/Home.js";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSignup = () => {

  }

  useEffect(() => {
    (async () => {
      let res = await fetch(process.env.REACT_APP_API_URL + "/users/verify", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        res = await res.json();
        setUser(res);
        // res = await fetch(
        //   process.env.REACT_APP_API_URL + "/users/" + res.id + "/notes",
        //   {
        //     headers: { "Content-Type": "application/json" },
        //     credentials: "include",
        //   }
        // );
        // if (res.ok) {
        //   res = await res.json();
        //   res.map((obj) => {
        //     notes.push({
        //       server_id: obj[0],
        //       client_id: uuid(),
        //       user_id: obj[1],
        //       title: obj[2],
        //       note: obj[3],
        //       last_edited: obj[4],
        //       tags: obj[5],
        //     });
        //   });
        // } else {
        //   setNotes([]);
        // }
      } else {
        setUser(null);
      }
      setLoading(true);
    })();
  }, []);

  return (
    <div className="container">
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Home />
            )}
          />
          <Route
            path="/login"
            exact
            render={() => (
              <Login />
            )}
          />
          <Route
            path="/signup"
            exact
            render={() => (
              <Signup user={user} setUser={setUser} />
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Label,
  Input,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import "../App.css";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const useNotification = () => {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const DELAY = 5000;

  React.useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(null), DELAY);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message]);

  const scrollToBottom = () => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  const addNotification = (notification, type = "info") => {
    setMessage(notification);
    setMessageType(type);
    scrollToBottom();
  };

  const Notification = () => {
    return (
      <div className={`notification notification-${messageType}`} role="alert">
        {message && <div className="notification-content">{message}</div>}
      </div>
    );
  };

  return [Notification, addNotification];
};

const Login = ({user, setUser}) => {
  const [logging, setLogging] = useState(false);

  const [Notification, addNotification] = useNotification();

  const history = useHistory();
  useEffect(() => {
    if (user) {
      history.push("/");
      return;
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !emailValid) {
      setEmailValid(false);
      return;
    }
    if (!password || !passwordValid) {
      setPasswordValid(false);
      return;
    }
    setLogging(true);
    let response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: email, password: password }),
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      history.push("/");
    } else addNotification("Invalid email or password", "error");
    setLogging(false);
  };

  return (
    <>
      {user ? (
        <></>
      ) : (
        <div className="container card">
          <Form className="login-form" onSubmit={onSubmit}>
            <h1 className="mb-4 text-center">Login</h1>
            <FormGroup className="mb-3">
              <Label className="mb-1">Email ID</Label>
              <Input
                // type="email"
                value={email}
                placeholder="Email ID"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValid(e.target.value !== "");
                }}
                invalid={emailValid === false}
              ></Input>
              <FormFeedback invalid>Please enter a valid Email ID</FormFeedback>
            </FormGroup>
            <FormGroup className="mb-3">
              <Label className="mb-1">Password</Label>
              <Input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordValid(e.target.value !== "");
                }}
                invalid={passwordValid === false}
              ></Input>
              <FormFeedback invalid>Please enter your password</FormFeedback>
            </FormGroup>
            <div className="col text-center">
              <Button
                type="submit"
                style={{ width: 100 }}
                className=" mb-3 btn-md btn-dark btn-block"
              >
                {logging ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Log In"
                )}
              </Button>{" "}
            </div>
            <div className="text-center">
              <Link className="text-decoration-none" to="/forgot-password">
                Forgot Password
              </Link>
              <div className="mb-2 mt-2">
                <Notification />
              </div>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default Login;

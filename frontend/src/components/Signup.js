import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Label,
  Input,
  FormGroup,
  FormFeedback
} from "reactstrap";
import Select from "react-select";
import "../App.css";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";

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

const Signup = ({ user, chagneUser }) => {

  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/");
      return;
    }
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [regNo, setRegNo] = useState("");
  const [userType, setUserType] = useState(0);
  const [userTypes, setUserTypes] = useState([
    {
      label: "Warden",
      value: 0,
    },
    {
      label: "Student",
      value: 1,
    },
    {
      label: "Faculty",
      value: 2,
    }
  ])
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [adding, setAdding] = useState(false);

  const [Notification, addNotification] = useNotification();

  const [nameValid, setNameValid] = useState(true);
  const [regNoValid, setRegNoValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [repasswordValid, setRepasswordValid] = useState(true);

  const onSignup = async (e) => {
    e.preventDefault();
    if (!name || !nameValid) {
      setNameValid(false);
      return;
    }
    if (!regNo || !regNoValid) {
      setRegNoValid(false);
      return;
    }
    if (!password || !passwordValid) {
      setPasswordValid(false);
      return;
    }
    if (!repassword || !repasswordValid) {
      setRepasswordValid(false);
      return;
    }
    setAdding(true);
    let response = await fetch(process.env.REACT_APP_API_URL + "/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        regno: regNo,
        userType: userTypes.filter(x => x.value === 0)[0].label.toLowerCase(),
        password: password,
      }),
    });
    if (response.ok) {
      response = await response.json()
      await changeUser(response);
      history.push('/');
      return;
    }
    setAdding(false);
    addNotification("Reg no already taken", "error");
  };

  return (
    <>
      {user && user.role !== "admin" ? (
        <></>
      ) : (
        <div className="form-center card">
            <Form className="login-form" onSubmit={onSignup}>
            <h2 className="text-center m-4">Sign Up</h2>
              <FormGroup className="mb-3">
                <Label className="mb-1">Full Name</Label>
                <Input
                  type="text"
                  value={name}
                  placeholder="Full Name"
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameValid(e.target.value);
                  }}
                  valid={(name && nameValid) === true}
                  invalid={nameValid === false}
                ></Input>
                <FormFeedback invalid>Please enter a valid Name</FormFeedback>
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="mb-1">Reg. Number</Label>
                <Input
                  type="text"
                  value={regNo}
                  placeholder="Reg. Number"
                  onChange={(e) => {
                    setRegNo(e.target.value);
                    setRegNoValid(/^[A-Z]+[0-9]+[A-Z]+$/.test(e.target.value));
                  }}
                  invalid={regNoValid === false}
                ></Input>
                <FormFeedback invalid>Please enter a valid Roll Number</FormFeedback>
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="mb-1">User Type</Label>
                <Select
                  value={userTypes.filter(
                    (option) => option.value === userType
                  )}
                  options={userTypes}
                  placeholder="Select user type"
                  isSearchable
                  onChange={(e) => setUserType(e.value)}
                  noOptionsMessage={() => "User type doesn't exist"}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="mb-1">Password</Label>
                <Input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordValid(
                      /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(e.target.value)
                    );
                  }}
                  valid={(password && passwordValid) === true}
                  invalid={passwordValid === false}
                ></Input>
                <FormFeedback invalid>
                  Password should contain atleast one alphabet, one digit and
                  should be atleast eight characters long
                </FormFeedback>
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="mb-1">Retype Password</Label>
                <Input
                  type="password"
                  value={repassword}
                  placeholder="Retype Password"
                  onChange={(e) => {
                    setRepassword(e.target.value);
                    setRepasswordValid(e.target.value === password);
                  }}
                  valid={(repassword && repasswordValid) === true}
                  invalid={repasswordValid === false}
                ></Input>
                <FormFeedback invalid>Passwords doesn't match</FormFeedback>
              </FormGroup>
              <div className="col text-center">
                <Button
                  type="submit"
                  style={{ width: 150 }}
                  className=" m-3 btn-md btn-dark btn-block"
                >
                  {adding ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              <div className="text-center">
                <div className="mt-2 mb-3">
                  <Notification />
                </div>
              </div>
            </Form>
          </div>
      )}
    </>
  );
};

export default Signup;

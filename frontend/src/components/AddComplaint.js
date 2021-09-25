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

const AddComplaint = ({ user }) => {

    const history = useHistory();

    const onAdd = async() => {
        e.preventDefault();
        
    }

    useEffect(() => {
        console.log(user)
        if (!user) {
            history.push("/login");
            return;
        }
    }, []);

    return (
        <div>
            
        </div>
    );
};

export default AddComplaint;
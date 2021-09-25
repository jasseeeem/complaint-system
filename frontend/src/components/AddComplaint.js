import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Label,
  Input,
  FormGroup,
  FormFeedback,
  Checkbox
} from "reactstrap";
import "../App.css";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";

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
  
const AddComplaint = ({ user }) => {

    const history = useHistory();

    const [Notification, addNotification] = useNotification();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [room, setRoom] = useState("")
    const [adding, setAdding] = useState(false);
    const [hostelType, setHostelType] = useState(0);
    const [image, setImage] = useState("")
    const [hostelTypes, setHostelTypes] = useState([
        {
          label: "A Hostel",
          value: 0,
        },
        {
          label: "B Hostel",
          value: 1,
        },
        {
          label: "C Hostel",
          value: 2,
        },
        {
            label: "D Hostel",
            value: 3,
          },
          {
            label: "E Hostel",
            value: 4,
          },
          {
            label: "F Hostel",
            value: 5,
          }
      ])
    const onAdd = async(e) => {
        e.preventDefault();
        setAdding(true)
        let response = await fetch(process.env.REACT_APP_API_URL + "/complaints/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title,
              description: description,
              hostel: hostelType,
              room: room,
              image: image,
            }),
          });
          if (response.ok) {
            history.push('/');
            return;
          }
          setAdding(false);
          addNotification("An error occured while posting", "error");
        };

    useEffect(() => {
        if (!user) {
            history.push("/login");
            return;
        }
    }, []);

    return (
        <div>
            <Form className="login-form" onSubmit={onAdd}>
            <h2 className="text-center m-4">Add Complaint</h2>
              <FormGroup className="mb-3">
                <Label className="mb-1">Title</Label>
                <Input
                  type="text"
                  value={title}
                  placeholder="Title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                ></Input>
                <FormFeedback invalid>Please add a title</FormFeedback>
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="mb-1">Description</Label>
                <Input
                  type="textarea"
                  rows="6"
                  value={description}
                  placeholder="Description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                ></Input>
              </FormGroup>
              <FormGroup className="mb-3">
                <Input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => setImage(e.target.files[0])}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="mb-1">Choose Hostel</Label>
                <Select
                  value={hostelTypes.filter(
                    (option) => option.value === hostelType
                  )}
                  options={hostelTypes}
                  placeholder="Select hostel"
                  isSearchable
                  onChange={(e) => setHostelType(e.value)}
                  noOptionsMessage={() => "User type doesn't exist"}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label className="mb-1">Room</Label>
                <Input
                  type="text"
                  value={room}
                  placeholder="Room"
                  onChange={(e) => {
                    setRoom(e.target.value);
                  }}
                ></Input>
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
                    "Post Complaint"
                  )}
                </Button>
              </div>
              <div className="text-center">
                <div className="mt-2 mb-3">
                  {/* <Notification /> */}
                </div>
              </div>
            </Form>
        </div>
    );
};

export default AddComplaint;
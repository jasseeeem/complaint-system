import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
=======
import { Link, useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Label,
  Input,
  FormGroup,
  FormFeedback,
} from "reactstrap";

>>>>>>> eac5e4ccab26fdeaa50af96343a7f4089535e0ba

const Home = ({user, users}) => {
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);
    
    const addArray = async (arr) => {
        console.log(arr)
        setComplaints(arr);
    }

    const timeSince = (date) => {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = seconds / 31536000;
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      }

    const likeComplaint = async(complaint_id) => {
        let response = await fetch(process.env.REACT_APP_API_URL + "/complaints/" + complaint_id + "/like/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
            }),
          });
          console.log(response.ok)
        };
    

    const routeChange = (path) =>{
      history.push(path)
    }

    useEffect(() => {
        (async () => {
            setLoading(false);
            let res = await fetch(process.env.REACT_APP_API_URL + "/complaints/", {
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            if (res.ok) {
                setComplaints([]);
              res = await res.json();
              const peopleArray = Object.keys(res).map(i => res[i])
              await addArray(peopleArray);
              setLoading(true);
            } else {
              setComplaints([]);
            };
          })();
        }, []);

    return (
        <div>
            
            {user ? 
             <div>
                    Home Page of {user && user.name}                  
                    <div className="row mb-3">
                    <Link
                    to={{
                        pathname: "/add",
                    }}
                    style={{ textDecoration: "none" }}
                    className="text-center"
                    >
                    Post Complaint
                    </Link>
                </div>

                {loading &&
                    <div complaints>
                        {complaints.map(complaint => {
                             return (
                                
                                <div key={complaint.id} className="complaint card p-2 mb-3 me-2 ms-2">
                                    <h5>{complaint.user.name}</h5>
                                    <h6>{timeSince(new Date(complaint.set_time + " UTC"))} ago</h6>
                                    <h5>{complaint.title}</h5>
                                    <h6>{complaint.description}</h6>
                                    <AiFillLike size="25" onClick={() => likeComplaint(complaint.id)} />
                                    <span>{complaint.likes.length ? (complaint.likes.length > 1 ? complaint.likes.length + " likes": "1 like") : ""}</span>
                                </div>
                            )
                        })}
                    </div>
                }
              </div>
            :   
                <div className="form-centre">
                  Welcome 
                  <div>
                   <Button style={{ width: 100 }}
                           className=" mb-3 btn-md btn-dark btn-block" 
                           onClick={() => routeChange(`/login`)}>
                       LOGIN
                   </Button>
                  </div> 
                  <div>
                   <Button style={{ width: 100 }}
                           className=" mb-3 btn-md btn-dark btn-block" 
                           onClick={() => routeChange(`/signup`)}>
                       SIGNUP
                   </Button>
                  </div> 
                </div>
            }
        </div>
    );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Label,
  Input,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'

const Home = ({user, users}) => {
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);
    
    const addArray = async (arr) => {
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
          return Math.floor(interval) + "d";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + "h";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + "m";
        }
        return Math.floor(seconds) + "s";
      }

    const likeComplaint = async(complaint_id) => {
        setComplaints(complaints.map(complaint => {
            if(complaint.id === complaint_id) {
                let likePresent = false;
                for(let like in complaint.likes) {
                    if(complaint.likes[like].user_id === user.id) {
                        complaint.likes.splice(like, 1);
                        likePresent = true;
                    }
                }
                if(!likePresent) {
                    complaint.likes.push({user_id: user.id})
                }
            }
            return complaint;
        }))
        let response = await fetch(process.env.REACT_APP_API_URL + "/complaints/" + complaint_id + "/like/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
            }),
          });
          console.log(response.ok)
        };

    const userLiked = (complaint) => {
        for(let like in complaint.likes) {
            if(complaint.likes[like].user_id === user.id) return true;
        }
        return false;
    }
    

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
                                
                                <div key={complaint.id} className="complaint p-3">
                                    <ul class="list-inline">
                                        <li class="list-inline-item"><h5>{complaint.user.name}</h5></li>
                                        <li class="list-inline-item"> • </li>
                                        <li class="list-inline-item">{timeSince(new Date(complaint.set_time + " UTC"))}</li>
                                    </ul>
                                    <h4>{complaint.title}</h4>
                                    <p>{complaint.description}</p>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        {userLiked(complaint) ? <AiFillLike className="me-2" size="20" onClick={() => likeComplaint(complaint.id)} /> : <AiOutlineLike className="me-2" size="20" onClick={() => likeComplaint(complaint.id)} />}
                                        <span>{complaint.likes.length ? (complaint.likes.length > 1 ? complaint.likes.length + " likes": "1 like") : ""}</span>
                                    </div>
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
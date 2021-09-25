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
import Select from "react-select";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { BeatLoader } from "react-spinners";

const Home = ({user, users}) => {
    const history = useHistory();
    const [complaintsLoading, setComplaintsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [sortType, setSortType] = useState(1)
    const [sortTypes, setSortTypes] = useState([
      {
        'label': "Date Added (Latest to Oldest)",
        'value': 1
      },
      {
        'label': "Date Added (Oldest to Latest)",
        'value': 2
      },
      {
        'label': "Likes (Highest to lowest)",
        'value': 3
      },
      {
        'label': "Likes (Lowest to Highest)",
        'value': 4
      },
    ]);
    
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

    const updateComplaints = async(sorttype) => {
      setComplaintsLoading(true);
      let response = await fetch(process.env.REACT_APP_API_URL + "/complaints/sort/"+sorttype+"/", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        setComplaints([]);
        response = await response.json();
        const peopleArray = Object.keys(response).map(i => response[i])
        await addArray(peopleArray);
        setComplaintsLoading(true);
      } else {
        setComplaints([]);
      };
    }

    useEffect(() => {
        (async () => {
            setComplaintsLoading(false);
            let res = await fetch(process.env.REACT_APP_API_URL + "/complaints/sort/0/", {
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            if (res.ok) {
                setComplaints([]);
              res = await res.json();
              const peopleArray = Object.keys(res).map(i => res[i])
              await addArray(peopleArray);
              setComplaintsLoading(true);
              console.log(complaints)
            } else {
              setComplaints([]);
            };
          })();
        }, []);

    return (
        <div>
            {user ? 
             <div>
                <div className="top">
                  <div className="sort">
                    <h5 className="me-3 pt-2">Sort by: </h5>
                    <Select
                      className="Dropdown"
                      value={sortTypes.filter(
                        (option) => option.value === sortType
                      )}
                      options={sortTypes}
                      onChange={(e) => {
                        setSortType(e.value);
                        setComplaintsLoading(true);
                        updateComplaints(e.value);
                      }}
                      noOptionsMessage={() => "User type doesn't exist"}
                    />
                  </div>
                  <div>
                    <Button
                      className="mb-3 btn-md btn-dark post-button" 
                      onClick={() => routeChange(`/add`)}>
                      POST COMPLAINT
                      </Button>
                  </div>
                </div>
                {complaintsLoading 
                  ?
                <div className="flex-container1">
                  <div className="login-block1">
                    <div className="complaints">
                        {complaints.map(complaint => {
                             return (
                                
                                <div key={complaint.id} className="complaint p-3">
                                  <div>
                                      <ul className="list-inline">
                                        <li className="list-inline-item"><h5>{complaint.user.name}</h5></li>
                                        <li className="list-inline-item"> • </li>
                                        <li className="list-inline-item">{timeSince(new Date(complaint.set_time + " UTC"))}</li>
                                      </ul>
                                      <h4>{complaint.title}</h4>
                                      <p>{complaint.description}</p>
                                      <div className="mobile-view">
                                        {userLiked(complaint) ? <AiFillLike className="me-2" size="20" onClick={() => likeComplaint(complaint.id)} /> : <AiOutlineLike className="me-2" size="20" onClick={() => likeComplaint(complaint.id)} />}
                                        <span>{complaint.likes.length ? (complaint.likes.length > 1 ? complaint.likes.length + " likes": "1 like") : ""}</span>
                                      </div>
                                  </div>
                                  <div>
                                      {complaint.image &&
                                        <img
                                          className="complaint-image" 
                                          src={complaint.image}
                                          alt={"image for" + complaint.id}
                                        />
                                      }
                                    <div className="lap-view">
                                        {userLiked(complaint) ? <AiFillLike className="me-2" size="20" onClick={() => likeComplaint(complaint.id)} /> : <AiOutlineLike className="me-2" size="20" onClick={() => likeComplaint(complaint.id)} />}
                                        <span>{complaint.likes.length ? (complaint.likes.length > 1 ? complaint.likes.length + " likes": "1 like") : ""}</span>
                                    </div>
                                   </div>
                                 
                                </div>
                            )
                        })}
                        </div>
                      </div>
                    </div>
                :
                  <div className="container text-center mt-5">
                    <BeatLoader loading />
                  </div>
                }
              </div>
              
            :   
                <div className="form-center">
                  <h3>Welcome</h3> 
                  <div>
                   <Button style={{ width: 300 }}
                           className="mb-3 btn-md btn-dark btn-block" 
                           onClick={() => routeChange(`/login`)}>
                       LOGIN
                   </Button>
                  </div> 
                  <div>
                   <Button style={{ width:300 }}
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
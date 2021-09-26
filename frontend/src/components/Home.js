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

const Home = ({user, users, hostelTypes}) => {
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
    
    const customStyles = {
      option: (provided) => ({
        ...provided,
        color: 'black'
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        "svg": {
          fill: "black"
        }
      }),
    }

    const routeChange = (path) =>{
      history.push(path)
    }

    const updateComplaints = async(sorttype) => {
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
            let res = await fetch(process.env.REACT_APP_API_URL + "/complaints/sort/1/", {
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            if (res.ok) {
                setComplaints([]);
              res = await res.json();
              const peopleArray = Object.keys(res).map(i => res[i])
              await addArray(peopleArray);
              setComplaintsLoading(true);
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
                    <h5 className="me-3 pt-2">Sort by</h5>
                    <Select
                      className="Dropdown"
                      value={sortTypes.filter(
                        (option) => option.value === sortType
                      )}
                      styles={customStyles}
                      isSearchable={false}
                      options={sortTypes}
                      onChange={(e) => {
                        setSortType(e.value);
                        setComplaintsLoading(false);
                        updateComplaints(e.value);
                      }}
                      noOptionsMessage={() => "User type doesn't exist"}
                    />
                  </div>
                  <div>
                    <Button
                      className="mb-3 btn-md btn-light post-button" 
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
                                      <ul className="list-inline" id="username">
                                        <li className="list-inline-item"><h5>{complaint.user.name}</h5></li>
                                        <li className="list-inline-item"> • </li>
                                        <li className="list-inline-item">{timeSince(new Date(complaint.set_time + " UTC"))}</li>
                                      </ul>
                                      <h4 id="title">{complaint.title}</h4>
                                      <p id="description">{complaint.description}</p>
                                      <p id="hostel">{complaint.hostel_id && hostelTypes.filter(hostelType => complaint.hostel_id === hostelType.value)[0].label}{complaint.room_no && " • "+"Room "+complaint.room_no}</p>
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
                  <div className="container text-center ">
                    <BeatLoader color="white" loading />
                  </div>
                }
              </div>
              
            :   <div className="form-center">
                  <h1>TellTheWarden</h1>
                  <h3><i>Providing you a better service</i></h3> 
                  <div className="half">
                    <h5 id="big-text">This can be used to accept, categorize and track  complaints of hostellers from initiation through resolution. It provides a means to link issues to the administration so they are notified when the complaint has been raised, prioritize complaints using a variety of criteria, alert service personnel and deploy assets to solve those issues, and keep records of complaints for further analysis.</h5>
                    <h5>Login to Proceed</h5>
                    <Button style={{ width: 300 }}
                            className="mb-4 btn-lg btn-light btn-block" 
                            onClick={() => routeChange(`/login`)}>
                        LOG IN
                    </Button>
                    <h5>Or create your profile</h5>
                    <Button style={{ width:300 }}
                            className=" btn-lg btn-light btn-block" 
                            onClick={() => routeChange(`/signup`)}>
                        SIGN UP
                    </Button>
                    </div>
                </div> 
                    
            }
        </div>
    );
};

export default Home;
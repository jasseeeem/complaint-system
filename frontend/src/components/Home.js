import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { BiLike } from "react-icons/bi";

const Home = ({user, users}) => {
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
            Home Page of {user && user.name}
            {user ? 
            
                <div>
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
                <div>

                </div>
            }
        </div>
    );
};

export default Home;
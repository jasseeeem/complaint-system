import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Home = ({user}) => {
    const [complaints, setComplaints] = useState([
        {
            title: 'Lights not working',
            description: 'One of the lights stopped working from yesterday night',
            user_id: 1,
            createdAt: "12:28 PM",
            likes: 12
        },
        {
            title: 'Lights not working',
            description: 'One of the lights stopped working from yesterday night',
            user_id: 1,
            createdAt: "12:28 PM",
            likes: 12
        },
        {
            title: 'Lights not working',
            description: 'One of the lights stopped working from yesterday night',
            user_id: 1,
            createdAt: "12:28 PM",
            likes: 12
        }
    ])
    return (
        <div>
            Home Page of {user && user.name}
            {user 
            
            ?
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
                <div>
                    {complaints && complaints.map(complaint => {
                        return (
                        <div className="complaint card m-1 p-2">
                            <h6>{complaint.title}</h6>
                            <h6>{complaint.description}</h6>
                            <h6>{complaint.createdAt}</h6>
                            <h6>{complaint.user_id}</h6>
                            <h6>{complaint.likes} likes</h6>
                        </div>
                        )
                    })}
                </div>
              </div>
            :
                <div>

                </div>
            }
        </div>
    );
};

export default Home;
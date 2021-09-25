import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Home = ({user, users}) => {
    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);

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
              for(let i in res) {
                  complaints.push(res[i]);
              }
              console.log(complaints)
            } else {
              setComplaints([]);
            };
            setLoading(true);
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
                    <div>
                        {complaints.length}
                        {complaints && complaints.map(complaint => {
                            <p>"Hi"</p>
                            
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
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


const Home = ({user, users}) => {
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [complaints, setComplaints] = useState([]);

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
                    <div>
                        {complaints.length}
                        {complaints && complaints.map(complaint => {
                            <p>"Hi"</p>
                            
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
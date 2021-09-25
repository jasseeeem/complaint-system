import React from 'react';

const Home = ({user}) => {
    return (
        <div>
            Home Page of {user? user.name:null }
        </div>
    );
};

export default Home;
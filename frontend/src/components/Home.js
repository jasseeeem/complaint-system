import React from 'react';

const Home = ({user}) => {
    return (
        <div>
            Home Page of {user.name}
        </div>
    );
};

export default Home;
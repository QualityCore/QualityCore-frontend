import React from "react";
// import "./Home.css"; 
const Home = () => {
  return (
    <div className="home-container">
      <h1 className="title">아자아자</h1>
      <img src="/토끼.gif" alt="귀여운 토끼" className="rabbit-img" />

      <div className="grid-container">
        <div className="grid-item">공정 1</div>
        <div className="grid-item">공정 2</div>
        <div className="grid-item">공정 3</div>
        <div className="grid-item">공정 4</div>
      </div>
    </div>
  );
};

export default Home;

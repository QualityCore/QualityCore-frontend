import React from "react";
import styles from "../styles/Home.module.css"; 

const Home = () => {
  return (
    <div className={styles.homeContainer}> 
      <h1 className={styles.title}>생산 관리 시스템</h1>
      <div className={styles.gridContainer}>
        <div className={styles.gridItem}>🌈 생산 계획</div>
        <div className={styles.gridItem}>🌈 공정 관리</div>
        <div className={styles.gridItem}>🌈 자재 관리</div>
        <div className={styles.gridItem}>🌈 통계 및 분석</div>
      </div>
    </div>
  );
};

export default Home;

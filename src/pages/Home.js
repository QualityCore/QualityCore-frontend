import React from "react";
import styles from "../styles/Home.module.css";

import ProductionPlanCard from "../components/home/ProductionPlanCard";


const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.gridContainer}>
        <div className={`${styles.gridItem} ${styles.workOrderCard}`}>
         
        </div>
        
        <div className={`${styles.gridItem} ${styles.processManagementCard}`}>
    
        </div>
        
        <div className={`${styles.gridItem} ${styles.productionPlanCard}`}>
          <ProductionPlanCard />
        </div>
        
        <div className={`${styles.gridItem} ${styles.performanceCard}`}>
    
        </div>
      </div>
    </div>
  );
};

export default Home;
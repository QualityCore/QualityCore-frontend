import processStage from "./processStage.module.css";
function ProcessStage() {



    return (
        <div className={processStage.mainContainer}>
            <button className={processStage.createButton}>등록</button>
            <div className={processStage.cardContainer}>
                <div className={processStage.card}>
                    <img src="/images/11.webp" alt="분쇄 및 원재료 투입" className={processStage.cardImg} />
                    <p className={processStage.firstText}>분쇄 및 원재료 투입</p>
                    <p className={processStage.secondText}>Malt Handling</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/12.webp" alt="당화" className={processStage.cardImg} />
                    <p className={processStage.firstText}>당화</p>
                    <p className={processStage.secondText}>Mashing</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/13.webp" alt="여과" className={processStage.cardImg} />
                    <p className={processStage.firstText}>여과</p>
                    <p className={processStage.secondText}>Lautering</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/14.webp" alt="끓임" className={processStage.cardImg} />
                    <p className={processStage.firstText}>끓임</p>
                    <p className={processStage.secondText}>Boiling</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/15.webp" alt="냉각" className={processStage.cardImg} />
                    <p className={processStage.firstText}>냉각</p>
                    <p className={processStage.secondText}>Cooling</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/16.webp" alt="발효" className={processStage.cardImg} />
                    <p className={processStage.firstText}>발효</p>
                    <p className={processStage.secondText}>Fermentation</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/17.webp" alt="숙성" className={processStage.cardImg} />
                    <p className={processStage.firstText}>숙성</p>
                    <p className={processStage.secondText}>Maturation</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/18.webp" alt="여과 및 탄산조정" className={processStage.cardImg} />
                    <p className={processStage.firstText}>여과 및 탄산조정</p>
                    <p className={processStage.secondText}>Filtration & Carbonation</p>
                </div>
                <div className={processStage.card}>
                    <img src="/images/19.webp" alt="패키징 및 출하" className={processStage.cardImg} />
                    <p className={processStage.firstText}>패키징 및 출하</p>
                    <p className={processStage.secondText}>Packaging & Distribution</p>
                </div>
            </div>
        </div>
    )

}
export default ProcessStage;
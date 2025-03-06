import React, { useState, useEffect } from 'react';
import processStage from "./processStage.module.css";
import Modal from "react-modal";
import { marked } from 'marked';

function ProcessStage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [processData, setProcessData] = useState([]);

    useEffect(() => {
        // JSON 파일을 import하여 processData state에 설정
        import('./processData.json')
            .then((data) => {
                setProcessData(data.default);
            })
            .catch((error) => {
                console.error('Error loading process data:', error);
            });
    }, []);

    const handleCardClick = (process) => {
        setModalContent(process);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={processStage.mainContainer}>
            <div className={processStage.cardContainer}>
                {processData.map((process) => (
                    <div className={processStage.card} key={process.id} onClick={() => handleCardClick(process)}>
                        <img src={process.imgSrc} alt={process.title} className={processStage.cardImg} />
                        <p className={processStage.firstText}>{process.title}</p>
                    </div>
                ))}
            </div>

            {/* 모달 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Process Details"
                className={processStage.modal}
                overlayClassName={processStage.overlay}
            >
                <h2>{modalContent.title}</h2>
                {modalContent.description && (
                    <div
                        dangerouslySetInnerHTML={{ __html: marked(modalContent.description) }}
                    />
                )}
                <button onClick={handleCloseModal}>닫기</button>
            </Modal>
        </div>
    );
}

export default ProcessStage;

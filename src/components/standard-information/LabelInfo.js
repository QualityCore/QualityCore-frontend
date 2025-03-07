import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal"; // 모달 라이브러리 추가
import { fetchLabelInfo, createLabelInfo } from "../../apis/standard-information/LabelInfoApi";
import labelInfos from "../../styles/standard-information/labelInfo.module.css";
import beerImage1 from './images/2.png'; // 아이유 맥주
import beerImage2 from './images/3.png'; // 카리나 맥주
import beerImage3 from './images/1.png'; // 장원영 맥주
import beerImage3_1 from './images/1-1.png' // 장원영 병
import beerImage1_1 from './images/2-1.png' // 아이유 병
import beerImage2_1 from './images/3-1.png' // 카리나 병

Modal.setAppElement("#root"); // 모달 접근성 설정

function LabelInfoCard({ item }) {
    return (
        <div className={labelInfos.card}>
            <img src={item.labelImage} alt="라벨 이미지" className={labelInfos.cardImage} />
            <div className={labelInfos.cardFooter}>
                <p>배치번호: {item.labelId}</p>
                <p>제품명: {item.productName}</p>
                <p>생산일자: {new Date(item.productionDate).toLocaleDateString()}</p>
            </div>
        </div>
    );
}

function LabelInfo() {
    const [labelInfo, setLabelInfo] = useState([]);
    const [showModal, setShowModal] = useState(false); // 모달 상태 변경
    const [beerType, setBeerType] = useState(""); // 맥주 종류
    const [productionDate, setProductionDate] = useState("");
    const [supplier, setSupplier] = useState(""); // 납품업체
    const canvasRef = useRef(null);

    // 맥주 종류에 따른 이미지 매핑
    const beerLabelImages = {
        아이유맥주: beerImage1,
        장원영맥주: beerImage3,
        카리나맥주: beerImage2,
    };

    // 맥주 종류에 따른 브랜드명 매핑
    const beerNames = {
        아이유맥주: "아이유 맥주",
        장원영맥주: "장원영 맥주",
        카리나맥주: "카리나 맥주",
    };

    // 맥주 종류에 따른 알코올 함량 (고정값)
    const alcPercentages = {
        아이유맥주: 4.5,
        장원영맥주: 4.0,
        카리나맥주: 4.0,
    };

    // 납품업체 고정값
    const suppliers = ["호텔델루나", "까멜리아", "이태원 단밤", "쌍갑포차"];

    useEffect(() => {
        const loadLabelInfo = async () => {
            try {
                const data = await fetchLabelInfo();
                setLabelInfo(data);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        loadLabelInfo();
    }, []);

    const drawLabel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = beerLabelImages[beerType]; // 선택된 맥주 종류에 맞는 이미지 로드

        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 기존 내용 지우기
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // 이미지 그리기

            // 첫 번째 텍스트: 브랜드명 (크기와 색 변경)
            ctx.font = "bold 40px 'Noto Sans KR', sans-serif";  // 글씨 크기 30px, 볼드체
            ctx.fillStyle = "#FFFFFF"; // 글씨 색상 (예: 빨간색)
            ctx.fillText(beerNames[beerType], 111, 520); // 맥주 종류에 맞는 브랜드명

            // 두 번째 텍스트: 용량 (고정값 500)
            ctx.font = "italic 30px 'Noto Sans KR', sans-serif";  // 글씨 크기 25px, 이탤릭체
            ctx.fillStyle = "#FFFFFF"; // 글씨 색상 (예: 초록색)
            ctx.fillText(`500ML`, 160, 560); // 용량 500으로 고정

            // 세 번째 텍스트: 알코올 함량 (고정값)
            ctx.font = "bold 20px 'Noto Sans KR', sans-serif";  // 글씨 크기 25px, 이탤릭체
            ctx.fillStyle = "#000"; // 글씨 색상
            ctx.fillText(`${alcPercentages[beerType]}%`, 560, 199); // 알코올 함량 표시

            // 나머지 텍스트들 (기존 그대로)
            ctx.font = "bold 20px 'Noto Sans KR', sans-serif";
            ctx.fillStyle = "#000";  // 기본 글씨 색상 (검은색)
            ctx.fillText(beerNames[beerType], 530, 89);  // 브랜드명 (하단 위치)
            ctx.fillText(`500ml`, 510, 238); // 용량 500ml로 고정
            ctx.fillText(`${productionDate}`, 560, 343); // 생산일자
        };
    };

    useEffect(() => {
        if (beerType && canvasRef.current) {
            drawLabel(); // 맥주 종류가 변경되면 라벨을 다시 그리기
        }
    }, [beerType, productionDate]);


    // 라벨등록
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!beerType || !productionDate || !supplier) {
            alert("모든 필드를 입력해 주세요.");
            return;
        }

        const formData = new FormData();

        // productId를 선택한 맥주 이름에 따라 설정
        const productIdMap = {
            "아이유맥주": "I001",
            "장원영맥주": "J001",
            "카리나맥주": "K001",
        };

        const labelData = {
            productionDate, // 생산 일자
            beerSupplier: encodeURIComponent(supplier),
            productId: productIdMap[beerType],
        };

        console.log("전송할 JSON 데이터:", labelData); // JSON 데이터 확인
        console.log("JSON 문자열:", JSON.stringify(labelData)); // JSON 문자열 확인

        // labelData를 JSON 문자열로 변환하여 FormData에 추가
        formData.append('labelData', JSON.stringify(labelData));

        if (canvasRef.current) {
            const labelImage = canvasRef.current.toDataURL("image/png");
            const byteCharacters = atob(labelImage.split(',')[1]);
            const byteArray = new Uint8Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: 'image/png' });

            // 이미지 파일 추가
            formData.append('labelImage', blob, 'labelImage.png');
        }

        console.log("FormData:", Object.fromEntries(formData.entries())); // FormData 확인

        try {
            const response = await createLabelInfo(formData);
            console.log("서버 응답:", response);

            alert("라벨 등록이 완료되었습니다.");

            const data = await fetchLabelInfo();
            setLabelInfo(data);
        } catch (error) {
            console.error("라벨 등록 실패:", error);
            alert(`등록 실패: ${error.message}`);
        }
    };



    return (
        <div>
            <div className={labelInfos.titleBar}>
                <button className={labelInfos.createButton} onClick={() => setShowModal(true)}>
                    라벨 등록
                </button>
            </div>

            {/* 모달 등록창 */}
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className={labelInfos.modalContent}
                overlayClassName={labelInfos.modalOverlay}
            >
                <h2>라벨 등록</h2>
                <form onSubmit={handleSubmit}>
                    <label>맥주 종류:</label>
                    <select value={beerType} onChange={(e) => setBeerType(e.target.value)} required>
                        <option value="" disabled>선택하세요</option>
                        <option value="아이유맥주">아이유맥주</option>
                        <option value="장원영맥주">장원영맥주</option>
                        <option value="카리나맥주">카리나맥주</option>
                    </select>

                    <label>생산일자:</label>
                    <input type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} required />

                    <label>납품업체:</label>
                    <select value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
                        <option value="" disabled>선택하세요</option>
                        {suppliers.map((supplierName, index) => (
                            <option key={index} value={supplierName}>{supplierName}</option>
                        ))}
                    </select>

                    <button type="submit">라벨 생성 및 등록</button>
                    <button type="button" onClick={() => setShowModal(false)}>닫기</button>
                </form>

                {beerType && (
                    <canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid #ccc", marginTop: "20px" }}></canvas>
                )}
            </Modal>

            {/* 기존 테이블 */}
            <div className={labelInfos.cardContainer}>
                {labelInfo.map((item) => (
                    <LabelInfoCard key={item.labelId} item={item} />
                ))}
            </div>
        </div>
    );
}

export default LabelInfo;

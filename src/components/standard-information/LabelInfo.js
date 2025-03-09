import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal"; // 모달 라이브러리 추가
import {
    fetchLabelInfo,
    createLabelInfo,
    fetchLabelInfoId,
    deleteLabelInfo,
} from "../../apis/standard-information/LabelInfoApi";
import labelInfos from "../../styles/standard-information/labelInfo.module.css";
import beerImage1 from "./images/2.png"; // 아이유 맥주
import beerImage2 from "./images/3.png"; // 카리나 맥주
import beerImage3 from "./images/1.png"; // 장원영 맥주
import beerImage3_1 from "./images/1-1.png"; // 장원영 병
import beerImage1_1 from "./images/2-1.png"; // 아이유 병
import beerImage2_1 from "./images/3-1.png"; // 카리나 병
import Pagination from "../../Pagination/Pagination";
import SuccessAnimation from "../../lottie/SuccessNotification"; // 성공 애니메이션 import

Modal.setAppElement("#root"); // 모달 접근성 설정

function LabelInfoCard({ item, handleDetailModalOpen }) {
    return (
        <div
            className={labelInfos.card}
            onClick={() => handleDetailModalOpen(item.labelId)}
        >
            <img
                src={item.beerImage}
                alt="라벨 이미지"
                loading="lazy"
                className={labelInfos.cardImage}
            />
            <div className={labelInfos.cardFooter}>
                <p>배치번호: {item.labelId}</p>
                <p>제품명: {item.productName}</p>
                <p>생산일자: {new Date(item.productionDate).toLocaleDateString()}</p>
            </div>
        </div>
    );
}

function LabelInfo() {
    const [labelInfo, setLabelInfo] = useState([]); // 라벨 정보
    const [showModal, setShowModal] = useState(false); // 등록 모달 상태
    const [showDetailModal, setShowDetailModal] = useState(false); // 상세조회 모달 상태
    const [beerType, setBeerType] = useState(""); // 맥주 종류
    const [productionDate, setProductionDate] = useState(""); // 생산일자
    const [supplier, setSupplier] = useState(""); // 납품업체
    const [selectedLabel, setSelectedLabel] = useState({}); // 선택된 라벨 정보
    const canvasRef = useRef(null); // 캔버스 참조

    //검색 추가
    const [searchKeyword, setSearchKeyword] = useState("");
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

    // 맥주 종류에 따른 병 이미지 매핑
    const beerBottleImages = {
        아이유맥주: beerImage1_1,
        장원영맥주: beerImage3_1,
        카리나맥주: beerImage2_1,
    };

    // 납품업체 고정값
    const suppliers = ["호텔델루나", "까멜리아", "단밤", "쌍갑포차"];

    const [pageInfo, setPageInfo] = useState({
        page: 0,
        totalPages: 1,
        totalElements: 0,
        first: true,
        last: true,
    });

    //성공 모달 추가
    const [successModal, setSuccessModal] = useState({
        isOpen: false,
        message: "",
    });

    // 설비 전체조회
    const fetchData = async (page = 0, search = "") => {
        try {
            const data = await fetchLabelInfo(page, 8, search);

            if (data && data.content) {
                setLabelInfo(data.content); // ✅ 실제 목록 데이터만 저장
                setPageInfo({
                    // ✅ 정확한 페이징 정보 저장
                    page: data.pageInfo.page,
                    totalPages: data.pageInfo.totalPages,
                    totalElements: data.pageInfo.totalElements,
                    first: data.pageInfo.first,
                    last: data.pageInfo.last,
                });
            } else {
                console.error("Data format error:", data);
                setLabelInfo([]);
                setPageInfo({
                    page: 0,
                    totalPages: 0, // 데이터가 없으므로 0으로 설정
                    totalElements: 0,
                    first: true,
                    last: true,
                });
            }
        } catch (error) {
            console.error("Error fetching label info:", error);
            setLabelInfo([]);
            setPageInfo({
                page: 0,
                totalPages: 0, // 에러 발생 시 0으로 설정
                totalElements: 0,
                first: true,
                last: true,
            });
        }
    };

    useEffect(() => {
        fetchData(0, searchKeyword); // 초기 데이터 로드 및 검색어 적용
    }, [searchKeyword]); // 검색어가 변경될 때마다 fetchData 호출

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
            ctx.font = "bold 40px 'Noto Sans KR', sans-serif"; // 글씨 크기 30px, 볼드체
            ctx.fillStyle = "#FFFFFF"; // 글씨 색상 (예: 빨간색)
            ctx.fillText(beerNames[beerType], 111, 520); // 맥주 종류에 맞는 브랜드명

            // 두 번째 텍스트: 용량 (고정값 500)
            ctx.font = "italic 30px 'Noto Sans KR', sans-serif"; // 글씨 크기 25px, 이탤릭체
            ctx.fillStyle = "#FFFFFF"; // 글씨 색상 (예: 초록색)
            ctx.fillText(`500ML`, 160, 560); // 용량 500으로 고정

            // 세 번째 텍스트: 알코올 함량 (고정값)
            ctx.font = "bold 20px 'Noto Sans KR', sans-serif"; // 글씨 크기 25px, 이탤릭체
            ctx.fillStyle = "#000"; // 글씨 색상
            ctx.fillText(`${alcPercentages[beerType]}%`, 560, 199); // 알코올 함량 표시

            // 나머지 텍스트들 (기존 그대로)
            ctx.font = "bold 20px 'Noto Sans KR', sans-serif";
            ctx.fillStyle = "#000"; // 기본 글씨 색상 (검은색)
            ctx.fillText(beerNames[beerType], 530, 89); // 브랜드명 (하단 위치)
            ctx.fillText(`500ml`, 510, 238); // 용량 500ml로 고정
            ctx.fillText(`${productionDate}`, 560, 343); // 생산일자
        };
    };

    useEffect(() => {
        if (beerType && canvasRef.current) {
            drawLabel(); // 맥주 종류가 변경되면 라벨을 다시 그리기
        }
    }, [beerType, productionDate]);

    const handleModalClose = () => {
        setShowModal(false);
        setBeerType("");
        setProductionDate("");
        setSupplier("");
    };

    const handleDetailModalOpen = async (labelId) => {
        try {
            const labelInfo = await fetchLabelInfoId(labelId);
            setSelectedLabel(labelInfo);
            setShowDetailModal(true);
        } catch (error) {
            console.error("Error fetching label details:", error);
            alert("라벨 상세 정보를 가져오는 데 실패했습니다.");
        }
    };

    const handleDetailModalClose = () => {
        setShowDetailModal(false);
        setSelectedLabel({});
    };

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
            아이유맥주: "I001",
            장원영맥주: "J001",
            카리나맥주: "K001",
        };

        const labelData = {
            productionDate, // 생산 일자
            beerSupplier: encodeURIComponent(supplier),
            productId: productIdMap[beerType],
        };

        formData.append("labelData", JSON.stringify(labelData));

        if (canvasRef.current) {
            const labelImage = canvasRef.current.toDataURL("image/png");
            const byteCharacters = atob(labelImage.split(",")[1]);
            const byteArray = new Uint8Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: "image/png" });

            formData.append("labelImage", blob, "labelImage.png");
        }

        // 병 이미지 추가
        const bottleBlob = await fetch(beerBottleImages[beerType])
            .then((res) => res.blob())
            .catch((err) => {
                console.error("병 이미지 로드 실패:", err);
                alert("병 이미지를 등록할 수 없습니다.");
                return null;
            });

        if (bottleBlob) {
            formData.append("beerImage", bottleBlob, "beerImage.png");
        }

        try {
            await createLabelInfo(formData, setSuccessModal); // setSuccessModal 전달
            console.log("라벨 등록 성공");

            handleModalClose();
            fetchData(0, searchKeyword);
        } catch (error) {
            console.error("라벨 등록 실패:", error);
            // 오류는 createLabelInfo에서 처리하므로 여기서는 추가 처리가 필요 없음
        }
    };

    const handleDeleteLabel = async () => {
        try {
            await deleteLabelInfo(selectedLabel.labelId, setSuccessModal); // setSuccessModal 전달
            handleDetailModalClose();
            fetchData(0, searchKeyword);
        } catch (error) {
            console.error("라벨 삭제 실패:", error);
            // 오류는 deleteLabelInfo에서 처리하므로 여기서는 추가 처리가 필요 없음
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        fetchData(newPage, searchKeyword); // 페이지 변경 시 fetchData 호출
    };

    // 검색 버튼 클릭 시 호출
    const handleSearchClick = () => {
        fetchData(0, searchKeyword); // 검색어와 함께 첫 페이지 데이터를 가져오기
    };

    const closeSuccessModal = () => {
        setSuccessModal({
            isOpen: false,
            message: "",
        });
    };

    return (
        <div>
            <div className={labelInfos.titleBar}>
                <button
                    className={labelInfos.createButton}
                    onClick={() => setShowModal(true)}
                >
                    라벨등록
                </button>
                <input
                    type="text"
                    placeholder="맥주명을 입력하세요..."
                    className={labelInfos.searchInput}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button className={labelInfos.searchButton} onClick={handleSearchClick}>
                    검색
                </button>
            </div>

            {/* 모달 등록창 */}
            <Modal
                isOpen={showModal}
                onRequestClose={handleModalClose}
                className={labelInfos.modalContent}
                overlayClassName={labelInfos.modalOverlay}
            >
                <form onSubmit={handleSubmit}>
                    <label>맥주 종류:</label>
                    <select
                        value={beerType}
                        onChange={(e) => setBeerType(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            선택하세요
                        </option>
                        <option value="아이유맥주">아이유맥주</option>
                        <option value="장원영맥주">장원영맥주</option>
                        <option value="카리나맥주">카리나맥주</option>
                    </select>

                    <label>생산일자:</label>
                    <input
                        type="date"
                        value={productionDate}
                        onChange={(e) => setProductionDate(e.target.value)}
                        required
                    />

                    <label>납품업체:</label>
                    <select
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            선택하세요
                        </option>
                        {suppliers.map((supplierName, index) => (
                            <option key={index} value={supplierName}>
                                {supplierName}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className={labelInfos.createButton1}>
                        등록
                    </button>
                    <button
                        type="button"
                        onClick={handleModalClose}
                        className={labelInfos.closeButton}
                    >
                        X
                    </button>
                </form>

                {beerType && (
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        style={{ border: "1px solid #ccc", marginTop: "20px" }}
                    ></canvas>
                )}
            </Modal>

            {/* 상세조회 모달 */}
            <Modal
                isOpen={showDetailModal}
                onRequestClose={handleDetailModalClose}
                className={labelInfos.detailModalContent}
                overlayClassName={labelInfos.detailModalOverlay}
            >
                <h2>라벨 상세 정보</h2>
                <div>
                    <img src={selectedLabel.labelImage} loading="lazy" alt="병 이미지" />
                    <p>
                        <strong>배치번호 :</strong> {selectedLabel.labelId}
                    </p>
                    <p>
                        <strong>제품명 :</strong> {selectedLabel.productName}
                    </p>
                    <p>
                        <strong>용량 :</strong> {selectedLabel.sizeSpec}
                    </p>
                    <p>
                        <strong>알코올도수 :</strong> {selectedLabel.alcPercent}%
                    </p>
                    <p>
                        <strong>생산일자 :</strong>{" "}
                        {new Date(selectedLabel.productionDate).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>납품업체 :</strong> {selectedLabel.beerSupplier}
                    </p>
                </div>
                <button className={labelInfos.delete} onClick={handleDeleteLabel}>
                    삭제
                </button>
                <button
                    type="button"
                    onClick={handleDetailModalClose}
                    className={labelInfos.closeButton}
                >
                    X
                </button>
            </Modal>
            {/* 성공 모달 */}
            <Modal
                isOpen={successModal.isOpen}
                onRequestClose={closeSuccessModal}
                className={labelInfos.successModal}
                overlayClassName="modal-overlay"
            >
                <div className={labelInfos.successModalHeader}>
                    <button
                        className={labelInfos.successCloseButton}
                        onClick={closeSuccessModal}
                    >
                        X
                    </button>
                </div>
                <div className={labelInfos.successModalContent}>
                    <SuccessAnimation />
                    <p className={labelInfos.successMessage}>{successModal.message}</p>
                </div>
            </Modal>
            {/* 기존 테이블 */}
            <div className={labelInfos.cardContainer}>
                {Array.isArray(labelInfo) && labelInfo.length > 0 ? (
                    labelInfo.map((item) => (
                        <LabelInfoCard
                            key={item.labelId}
                            item={item}
                            handleDetailModalOpen={handleDetailModalOpen}
                        />
                    ))
                ) : (
                    <p>라벨 정보가 없습니다.</p>
                )}
            </div>
            {/* 페이지네이션 */}
            <Pagination
                page={pageInfo.page}
                totalPages={pageInfo.totalPages}
                first={pageInfo.first}
                last={pageInfo.last}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default LabelInfo;

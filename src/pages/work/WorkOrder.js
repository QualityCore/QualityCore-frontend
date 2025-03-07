import React, { useState, useEffect } from "react";
import { findAllWorkOrders, fetchWorkOrderByLotNo, workOrderDelete } from "../../apis/workOrderApi/workOrdersApi";
import workOrder from "../../styles/work/workOrders.module.css";
import Pagination from "../../Pagination/Pagination";
import Modal from "react-modal";
import SuccessAnimation from "../../lottie/SuccessNotification";
import generatePDF from "../../common/PDF/generatePDF";
import { FaRotateRight } from "react-icons/fa6";

Modal.setAppElement('#root'); // 앱의 루트 엘리먼트를 지정 (모달 접근성 개선)

function WorkOrder() {
    // 작업지시서 상태관리
    const [workOrders, setWorkOrders] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 0, totalPages: 1, first: true, last: true
    });
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null); // 선택된 작업지시서
    const [noResults, setNoResults] = useState(false); // 검색 결과 없음 상태

    // 모달 상태관리
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);  // 성공 모달 상태
    const [modalMessage, setModalMessage] = useState('');  // 모달 메시지

    // 검색조건 상태관리
    const [workTeam, setWorkTeam] = useState('');
    const [productName, setProductName] = useState('');
    const [lineNo, setLineNo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [lotNo, setLotNo] = useState('');

    // 진행률
    const getWorkProgress = (statusCode) => {
        const statusProgressMap = {
            SC001: 10, SC002: 20, SC003: 30, SC004: 40, SC005: 50,
            SC006: 60, SC007: 70, SC008: 80, SC009: 90, SC010: 100
        };
        return statusProgressMap[statusCode] || 0;
    };

    // 진행률 색상
    const getProgressBarColor = (progress) => {
        return "#5E4BFF";
    };

    const fetchData = async (page = 0, filterParams = {}) => {
        console.log(`✅ fetchData 호출됨, 페이지 번호: ${page}, 필터:`, filterParams);
        try {
            const { workTeam, productName, lotNo, lineNo, startDate, endDate } = filterParams;
            let lineNoParam = lineNo ? parseInt(lineNo, 10) : undefined; // 숫자로 변환

            const data = await findAllWorkOrders(page, 13, workTeam, productName, lotNo, lineNoParam, startDate, endDate);
            console.log("✅ API 응답 데이터:", data);

            if (data && data.work && Array.isArray(data.work.content)) {
                const updatedWorkOrders = data.work.content.map((work) => ({
                    ...work,
                    workProgress: getWorkProgress(work.processStatus)
                }));

                if (updatedWorkOrders.length === 0) {
                    setNoResults(true);
                } else {
                    setNoResults(false);
                }

                setWorkOrders(updatedWorkOrders);
                setPageInfo({
                    page: data.work.number,
                    totalPages: data.work.totalPages,
                    first: data.work.first,
                    last: data.work.last
                });
            } else {
                console.error("❌ API 응답이 예상한 형식이 아닙니다:", data);
                setWorkOrders([]);
                setNoResults(true); // API 응답 형식이 잘못된 경우에도 검색 결과 없음 상태로 설정
            }
        } catch (error) {
            console.error("❌ 작업지시서 데이터를 불러오는 중 오류 발생:", error);
            setWorkOrders([]);
            setNoResults(true); // 오류 발생 시 검색 결과 없음 상태로 설정
        }
    };

    // 페이지 핸들러
    const handlePageChange = (newPage) => {
        fetchData(newPage, { workTeam, productName, lineNo, startDate, endDate, lotNo });
    };

    // 검색 기능
    const handleSearch = () => {
        console.log("🔎 검색 버튼 클릭됨");
        console.log("현재 검색 조건:", {
            workTeam,
            productName,
            lineNo,
            startDate,
            endDate,
            lotNo
        });
        fetchData(0, { workTeam, productName, lineNo, startDate, endDate, lotNo });
    };

    // 리셋 기능
    const handleReset = () => {
        setWorkTeam('');
        setProductName('');
        setLineNo('');
        setStartDate('');
        setEndDate('');
        setLotNo('');
        fetchData(0);
    };

    // 모달
    const openModal = async (lotNo) => {
        try {
            // API 호출하여 상세 정보 가져오기
            const workOrderData = await fetchWorkOrderByLotNo(lotNo);
            setSelectedWorkOrder(workOrderData);  // 상세 정보 설정
            setIsModalOpen(true); // 모달 열기
        } catch (error) {
            console.error("작업지시서 상세 정보를 불러오는 데 실패했습니다.", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
        setSelectedWorkOrder(null); // 선택된 작업지시서 초기화
    };

    useEffect(() => {
        fetchData(0);
    }, []);

    // 작업지시서 삭제
    const handleDelete = async (lotNo) => {
        try {
            // 작업지시서 삭제 API 호출
            await workOrderDelete(lotNo);
            setIsSuccessModalOpen(true);
            setModalMessage("작업지시서가 성공적으로 삭제되었습니다.");

            // 삭제 후 모달 닫기
            closeModal();

            // 작업지시서 목록 새로 고침
            fetchData(pageInfo.page);
        } catch (error) {
            console.error("❌ 작업지시서 삭제 실패:", error);
        }
    };

    const closeSuccessModal = () => setIsSuccessModalOpen(false);

    return (
        <div className={workOrder.container}>
            <div className={workOrder.searchBar}>
                <select className={workOrder.selectSearch} value={workTeam} onChange={(e) => setWorkTeam(e.target.value)}>
                    <option value="" disabled>작업조</option>
                    <option value="A조">A조</option>
                    <option value="B조">B조</option>
                    <option value="C조">C조</option>
                </select>
                <select className={workOrder.selectSearch} value={productName} onChange={(e) => setProductName(e.target.value)}>
                    <option value="" disabled>맥주명</option>
                    <option value="아이유 맥주">아이유 맥주</option>
                    <option value="카리나 맥주">카리나 맥주</option>
                    <option value="장원영 맥주">장원영 맥주</option>
                </select>
                <select className={workOrder.selectSearch} value={lineNo} onChange={(e) => setLineNo(e.target.value)}>
                    <option value="" disabled>생산라인</option>
                    <option value="1">1LINE</option>
                    <option value="2">2LINE</option>
                    <option value="3">3LINE</option>
                </select>
                <input
                    type="date"
                    className={workOrder.searchInput}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="생산시작일을 선택하세요.."
                />
                <input
                    type="date"
                    className={workOrder.searchInput}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="생산종료일을 선택하세요.."
                />
                <input
                    type="text"
                    className={workOrder.searchInput}
                    value={lotNo}
                    onChange={(e) => setLotNo(e.target.value)}
                    placeholder="작업지시번호를 입력하세요.."
                />
                <button className={workOrder.searchButton} onClick={handleSearch}>검색🔎</button>
                <button className={workOrder.searchRefresh} onClick={handleReset}><FaRotateRight /></button>
            </div>
            <div className={workOrder.mainbar}>
                {noResults ? (
                    <p className={workOrder.noResults}>검색 결과가 없습니다.</p>
                ) : (
                    <table className={workOrder.workOrderTable}>
                        <thead>
                            <tr>
                                <th>작업지시번호</th>
                                <th>작업조</th>
                                <th>제품명</th>
                                <th>생산시작일</th>
                                <th>생산종료일</th>
                                <th>수량</th>
                                <th>생산라인</th>
                                <th>작업지시상태</th>
                                <th>진행률</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workOrders.map((work) => (
                                <tr key={work.lotNo} onClick={() => openModal(work.lotNo)}>
                                    <td>{work.lotNo}</td>
                                    <td>{work.workTeam}</td>
                                    <td>{work.productName}</td>
                                    <td>{work.startDate}</td>
                                    <td>{work.endDate}</td>
                                    <td>{work.planQty} ea</td>
                                    <td>{work.lineNo} LINE</td>
                                    <td>{work.processStatus}</td>
                                    <td>
                                        <div style={{
                                            width: "100%",
                                            backgroundColor: "#e0e0e0",
                                            borderRadius: "5px",
                                            height: "23px",
                                            position: "relative"
                                        }}>
                                            <div style={{
                                                width: `${getWorkProgress(work.statusCode)}%`,
                                                backgroundColor: getProgressBarColor(getWorkProgress(work.statusCode)),
                                                height: "100%",
                                                borderRadius: "5px",
                                            }} />
                                            <div style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                color: "#fff",
                                                fontWeight: "bold",
                                                fontSize: "12px",
                                            }}>
                                                {getWorkProgress(work.statusCode)}%
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <Modal
                    isOpen={isSuccessModalOpen}
                    onRequestClose={closeSuccessModal}
                    className={workOrder.successModal}
                    overlayClassName={workOrder.modalOverlay}
                >
                    <div className={workOrder.successModalContent}>
                        <SuccessAnimation />
                        <p className={workOrder.successMessage}>{modalMessage}</p>
                    </div>
                </Modal>
                <Pagination
                    page={pageInfo.page}
                    totalPages={pageInfo.totalPages}
                    first={pageInfo.first}
                    last={pageInfo.last}
                    onPageChange={handlePageChange}  // 페이지 변경 함수 전달
                />
            </div>
            {/* 작업지시서 상세조회 모달 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className={workOrder.modal}
                overlayClassName={workOrder.modalOverlay}
            >
                <div className={workOrder.modalHeader}>
                    <button onClick={closeModal} className={workOrder.closeButton}>X</button>
                </div>
                {selectedWorkOrder && (
                    <div>
                        <div className={workOrder.headerContainer}>
                            <h1 className={workOrder.title}>작업지시서</h1>
                            <button
                                className={workOrder.pdfButton}
                                onClick={() => {
                                    if (selectedWorkOrder) {  // selectedWorkOrder가 있을 때만 PDF 생성
                                        console.log('pdf데이터', selectedWorkOrder);
                                        generatePDF(selectedWorkOrder, selectedWorkOrder.lineMaterials); // PDF 생성 함수 호출
                                    } else {
                                        console.error("작업지시서 정보가 없습니다.");
                                    }
                                }}
                            >
                                PDF 추출
                            </button>
                        </div>

                        {/* 테이블을 감싸는 wrapper 추가 */}
                        <div className={workOrder.tableWrapper}>
                            <table className={workOrder.detailTable}>
                                <tr>
                                    <td className={workOrder.oneTd}>작업지시번호</td>
                                    <td>{selectedWorkOrder.lotNo}</td>
                                </tr>
                                <tr>
                                    <td className={workOrder.twoTd}>작업조</td>
                                    <td>{selectedWorkOrder.workTeam}</td>
                                </tr>
                            </table>

                            <table className={workOrder.dateTable}>
                                <tr>
                                    <td className={workOrder.threeTd}>생산시작일</td>
                                    <td>{selectedWorkOrder.startDate}</td>
                                </tr>
                                <tr>
                                    <td className={workOrder.fourTd}>생산종료일</td>
                                    <td>{selectedWorkOrder.endDate}</td>
                                </tr>
                            </table>
                        </div>

                        <h2>생산정보</h2>
                        <table className={workOrder.productTable}>
                            <tr>
                                <th>제품명</th>
                                <th>수량</th>
                                <th>생산라인</th>
                                <th>작업지시상태</th>
                            </tr>
                            <tr>
                                <td>{selectedWorkOrder.productName}</td>
                                <td>{selectedWorkOrder.planQty} ea</td>
                                <td>{selectedWorkOrder.lineNo} LINE</td>
                                <td>{selectedWorkOrder.processStatus}</td>
                            </tr>
                        </table>

                        {/* 자재 정보 추가 */}
                        <h2>자재정보</h2>
                        {selectedWorkOrder.lineMaterials && selectedWorkOrder.lineMaterials.length > 0 ? (
                            <table className={workOrder.materialTable}>
                                <thead>
                                    <tr>
                                        <th>공정</th>
                                        <th>자재명</th>
                                        <th>맥주 1개 소요량</th>
                                        <th>총 소요량</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedWorkOrder.lineMaterials.map((material, index) => (
                                        <tr key={index}>
                                            <td>{material.processStep}</td>
                                            <td>{material.materialName}</td>
                                            <td>{material.requiredQtyPerUnit} {material.unit}</td>
                                            <td>{material.totalQty} {material.unit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>자재 정보가 없습니다.</p>
                        )}

                        <h2>특이사항</h2>
                        <textarea value={selectedWorkOrder.workEtc} className={workOrder.etc}></textarea>
                        <button className={workOrder.deleteButton} onClick={() => handleDelete(selectedWorkOrder.lotNo)}>🚫삭제</button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default WorkOrder;

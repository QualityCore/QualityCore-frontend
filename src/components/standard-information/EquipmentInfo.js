import React, { useEffect, useState } from "react";
import Equipment from "../../styles/standard-information/Equipment.module.css";
import { fetchAllEquipment, fetchEquipmentById, createEquipment } from "../../apis/standard-information/EquipmentApi";
import Modal from "react-modal";
import { fetchWorkplaces } from "../../apis/standard-information/WorkplaceApi";  // 작업장 API import

function EquipmentInfo() {
    const [equipmentList, setEquipmentList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [newEquipment, setNewEquipment] = useState({
        equipmentId: "",
        workplaceId: "",  // workplaceId만 저장
        equipmentName: "",
        modelName: "",
        manufacturer: "",
        installDate: "",
        equipmentStatus: "",
        equipmentEtc: "",
        equipmentImage: null,
    });
    const [workplaces, setWorkplaces] = useState([]);

    // 컴포넌트가 마운트될 때 설비 데이터와 작업장 데이터 가져오기
    useEffect(() => {
        const getEquipmentData = async () => {
            try {
                const equipmentData = await fetchAllEquipment();
                setEquipmentList(equipmentData);
            } catch (error) {
                console.error('Error loading equipment data:', error);
            }
        };

        const getWorkplaceData = async () => {
            try {
                const workplaceData = await fetchWorkplaces();
                setWorkplaces(workplaceData);
            } catch (error) {
                console.error('Error loading workplace data:', error);
            }
        };

        getEquipmentData();
        getWorkplaceData();
    }, []);

    const openModal = async (equipmentId) => {
        try {
            const equipmentData = await fetchEquipmentById(equipmentId);
            setSelectedEquipment(equipmentData);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching equipment details:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEquipment(null);
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
        setNewEquipment({
            equipmentId: "",
            workplaceId: "", // 초기화
            equipmentName: "",
            modelName: "",
            manufacturer: "",
            installDate: "",
            equipmentStatus: "",
            equipmentEtc: "",
            equipmentImage: null,
        });
    };

    // 설비 등록 모달 textarea 변경 이벤트 핸들러
    const handleTextareaChange = (event) => {
        setNewEquipment({
            ...newEquipment,
            equipmentEtc: event.target.value, // 특이사항 업데이트
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEquipment({
            ...newEquipment,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewEquipment({
                ...newEquipment,
                equipmentImage: file,
            });
        }
    };

    const handleWorkplaceChange = (event) => {
        const selectedWorkplaceId = event.target.value;

        setNewEquipment(prev => ({
            ...prev,
            workplaceId: selectedWorkplaceId
        }));
    };




    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!newEquipment.workplaceId) {
            alert("Please select a workplace.");
            return; // 직장이 선택되지 않으면 전송을 중지
        }

        const formData = new FormData();
        const equipmentData = {
            equipmentName: encodeURIComponent(newEquipment.equipmentName),
            modelName: encodeURIComponent(newEquipment.modelName),
            manufacturer: encodeURIComponent(newEquipment.manufacturer),
            installDate: newEquipment.installDate,
            equipmentStatus: encodeURIComponent(newEquipment.equipmentStatus),
            equipmentEtc: encodeURIComponent(newEquipment.equipmentEtc),
            workplaceId: newEquipment.workplaceId // 이 부분이 올바른 ID를 가지고 있는지 확인
        };

        formData.append('equipmentData', JSON.stringify(equipmentData));

        if (newEquipment.equipmentImage) {
            formData.append('equipmentImage', newEquipment.equipmentImage);
        }

        try {
            const response = await createEquipment(formData);
            // 성공적으로 생성되었을 때의 처리
        } catch (error) {
            console.error("Error creating equipment:", error);
        }
    };

    // 상세 조회 모달 textarea 변경 이벤트 핸들러
    const handleDetailTextareaChange = (event) => {
        setSelectedEquipment((prev) => ({
            ...prev,
            equipmentEtc: event.target.value,
        }));
    };
    return (
        <div>
            <div className={Equipment.titleBar}>
                <button className={Equipment.createButton} onClick={() => setIsRegisterModalOpen(true)}>설비등록</button>
                <input type="text" className={Equipment.searchBarInput} />
                <button className={Equipment.searchButton}>검색</button>
            </div>
            <div className={Equipment.mainBar}>
                <table className={Equipment.equipmentTable}>
                    <thead>
                        <tr>
                            <th>작업장</th>
                            <th>공정</th>
                            <th>설비</th>
                            <th>모델명</th>
                            <th>제조사</th>
                            <th>상태</th>
                            <th>설치일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipmentList.length === 0 ? (
                            <tr>
                                <td colSpan="7">설비정보가 없습니다.</td>
                            </tr>
                        ) : (
                            equipmentList.map((equipment) => (
                                <tr
                                    key={equipment.equipmentId}
                                    onClick={() => openModal(equipment.equipmentId)}
                                    className={Equipment.equipmentRow}
                                >
                                    <td>{equipment.workplaceName}</td>
                                    <td>{equipment.workplaceType}</td>
                                    <td>{equipment.equipmentName}</td>
                                    <td>{equipment.modelName}</td>
                                    <td>{equipment.manufacturer}</td>
                                    <td>{equipment.equipmentStatus}</td>
                                    <td>{equipment.installDate}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 상세조회 모달 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className={Equipment.modal}
                overlayClassName={Equipment.modalOverlay}
            >
                <div className={Equipment.modalHeader}>
                    <button onClick={closeModal} className={Equipment.closeButton}>X</button>
                </div>
                {selectedEquipment && (
                    <div className={Equipment.modalContent}>
                        <h1>설비 상세정보</h1>
                        <div className={Equipment.titleContainer}>
                            <div className={Equipment.imageContainer}>
                                {selectedEquipment.equipmentImage ? (
                                    <img
                                        src={selectedEquipment.equipmentImage}
                                        alt="설비 이미지"
                                        className={Equipment.equipmentImage}
                                    />
                                ) : (
                                    <p>이미지가 없습니다.</p>
                                )}
                            </div>
                            <table className={Equipment.leftTable}>
                                <tbody>
                                    <tr>
                                        <td className={Equipment.detailLabel}>설비명</td>
                                        <td className={Equipment.detailValue}>{selectedEquipment.equipmentName}</td>
                                    </tr>
                                    <tr>
                                        <td className={Equipment.detailLabel}>모델명</td>
                                        <td className={Equipment.detailValue}>{selectedEquipment.modelName}</td>
                                    </tr>
                                    <tr>
                                        <th className={Equipment.detailLabel}>제조사</th>
                                        <td className={Equipment.detailValue}>{selectedEquipment.manufacturer}</td>
                                    </tr>
                                    <tr>
                                        <th className={Equipment.detailLabel}>설치일</th>
                                        <td className={Equipment.detailValue}>{selectedEquipment.installDate}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={Equipment.tableContainer}>
                            <table className={Equipment.centerTable}>
                                <tr>
                                    <td className={Equipment.detailLabel}>작업장</td>
                                    <td className={Equipment.detailLabel}>공정</td>
                                    <th className={Equipment.detailLabel}>상태</th>

                                </tr>
                                <tr>
                                    <td className={Equipment.detailValue}>{selectedEquipment.workplaceName}</td>
                                    <td className={Equipment.detailValue}>{selectedEquipment.workplaceType}</td>
                                    <td className={Equipment.detailValue}>{selectedEquipment.equipmentStatus}</td>

                                </tr>
                            </table>
                        </div>
                        <div className={Equipment.textareaContainer}>
                            <div className={Equipment.detailLabelText}>특이사항</div>
                            <div className={Equipment.textareaRow}>
                                <div className={Equipment.textareaCell}>
                                    <textarea
                                        className={Equipment.textarea}
                                        value={selectedEquipment.equipmentEtc || ''}
                                        onChange={handleTextareaChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <button className={Equipment.deleteButton}>설비정보 삭제</button>
                    </div>
                )}
            </Modal>

            {/* 설비 등록 모달 */}
            <Modal
                isOpen={isRegisterModalOpen}
                onRequestClose={closeRegisterModal}
                className={Equipment.createModal}
                overlayClassName={Equipment.modalOverlay}
            >
                <div className={Equipment.createModalHeader}>
                    <button onClick={closeRegisterModal} className={Equipment.createCloseButton}>X</button>
                </div>
                <div className={Equipment.createModalContent}>
                    <h1>설비 등록</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>설비명</label>
                            <input
                                type="text"
                                className={Equipment.createInputField}
                                name="equipmentName"
                                value={newEquipment.equipmentName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>모델명</label>
                            <input
                                type="text"
                                className={Equipment.createInputField}
                                name="modelName"
                                value={newEquipment.modelName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>제조사</label>
                            <input
                                type="text"
                                className={Equipment.createInputField}
                                name="manufacturer"
                                value={newEquipment.manufacturer}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>설치일</label>
                            <input
                                type="date"
                                className={Equipment.createInputField}
                                name="installDate"
                                value={newEquipment.installDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>상태</label>
                            <input
                                type="text"
                                className={Equipment.createInputField}
                                name="equipmentStatus"
                                value={newEquipment.equipmentStatus}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* 공정과 작업장 선택 */}
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>작업장과 공정</label>
                            <select
                                className={Equipment.createInputField}
                                value={newEquipment.workplaceId}
                                onChange={handleWorkplaceChange}
                            >
                                <option value="">작업장 선택</option>
                                {workplaces.map((workplace) => (
                                    <option key={workplace.workplaceId} value={workplace.workplaceId}>
                                        {workplace.workplaceName} ({workplace.workplaceType})
                                    </option>
                                ))}
                            </select>

                        </div>
                        {/* 이미지 입력 필드 */}
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>설비 이미지</label>
                            <input
                                type="file"
                                className={Equipment.createInputField}
                                name="equipmentImage"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* 특이사항 (equipmentEtc) 입력 필드 */}
                        <div className={Equipment.createInputContainer}>
                            <label className={Equipment.createInputLabel}>특이사항</label>
                            <textarea
                                className={Equipment.createInputField}
                                name="equipmentEtc"
                                value={newEquipment.equipmentEtc}
                                onChange={handleTextareaChange}
                            />
                        </div>
                        <button type="submit" className={Equipment.submitButton}>등록</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default EquipmentInfo;
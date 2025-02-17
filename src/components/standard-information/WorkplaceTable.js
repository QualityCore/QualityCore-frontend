import { useState , useEffect } from "react";
import axios from "axios";
import ConfirmModal from "../common/Modal";
import AlertModal from "../common/AlertModal";
import "../../styles/standard-information/workplace-table.css";




  const WorkplaceTable = ({workplaces,apiUrl}) => {
    const[selectedWorkplace, setSelectedWorkplace] =useState(null);
    const[updatedData , setUpdatedData] = useState({});
    const[showEditForm , setShowEditForm] = useState(false);
    const[showConfirmModal , setShowConfirmModal] =useState(false);
    const[showSuccessModal , setShowSuccessModal] = useState(false);
    const[errorMessage , setErrorMessage] = useState("");

    useEffect(()=>{
      console.log("📌 showEditForm 값 변경됨:", showEditForm);
    },[showEditForm]);

    // 수정 버튼 클릭 시 해당 장업장 정보 불러오기
    const handleEditClick = (workplace) => {
      console.log("🔍 수정 버튼 클릭됨:", workplace);
      setSelectedWorkplace(workplace);
      setUpdatedData({...workplace});
      setShowEditForm(true);
    };

    // 입력 필드 값 변경 핸들러러
    const handleChange = (e) => {
      setUpdatedData({...updatedData,[e.target.name]:e.target.value});
    }
    // 수정하기 버튼 클릭 시 확인 모달 표시
    const handleUpdateClick = () => {
      setShowConfirmModal(true);
    };

    // API 호출하여 수정 요청 실행
    const confirmUpdate  = async ()=>{
      console.log("🔍 selectedWorkplace 값:", selectedWorkplace); // 추가
      console.log("🔍 updatedData 값:", updatedData); // 추가
      setShowConfirmModal(false) // 모달닫기

    

      try{
        const response = await axios.put(`${apiUrl}/workplaces/${selectedWorkplace.workplaceId}`, updatedData);
        console.log("🔍 API URL:", apiUrl);

        if(response.status ===200){
          setShowSuccessModal(true);
          setShowEditForm(false); // 수정 폼 닫기

          // 일정 시간 후 새로고침 
          setTimeout(()=>{
            window.location.reload();
          },3000);
        } 
      }catch(error){
        setErrorMessage(error.response?.data?.message || "수정하는데 문제가 발생했습니다!");
        setShowSuccessModal(false);
       }
    };
  
  return (
    <div>
      <table className="workplace-table">
        <thead>
          <tr>
            <th>작업장 이름</th>
            <th>작업장 코드</th>
            <th>작업장 위치</th>
            <th>작업장 타입</th>
            <th>LINE 정보</th>
            <th>작업장 상태</th>
            <th>작업 담당자</th>
            <th>생산가능 용량</th>
            <th>용량단위</th>
          </tr>
        </thead>
        <tbody>
          {workplaces.map((item, index) => (
              <tr key={index}>
                <td>{item.workplaceName}</td>
                <td>{item.workplaceCode}</td>
                <td>{item.workplaceLocation}</td>
                <td>{item.workplaceType}</td>
                <td>{item.lineId}</td>
                <td>{item.workplaceStatus}</td>
                <td>{item.managerName}</td>
                <td>{item.workplaceCapacity}</td>
                <td>{item.workplaceCapacityUnit}</td>
              <td>
                <button className="workplace-edit-btn" onClick={()=>handleEditClick(item)}>수정</button>
                <button className="workplace-delete-btn">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 수정 폼 팝업*/}
        {showEditForm &&(
          <div className="edit-form-container">
            <div className="edit-form">
              <h3> 작업장 정보 수정</h3>
             
              <div className="edit-row">
                  <div className="edit-field">
                    <label>작업장 이름</label>
                      <input type="text" name="workplaceName" value={updatedData.workplaceName} onChange={handleChange}/>
                  </div>
                  <div className="edit-field">
                    <label>작업장 타입</label>
                     <select className="edit-select" name="workplaceType" value={updatedData.workplaceType} onChange={handleChange}>
                        <option value="분쇄">분쇄</option>
                        <option value="당화">당화</option>
                        <option value="여과">여과</option>
                        <option value="끓임">끓임</option>
                        <option value="냉각">냉각</option>
                        <option value="발효">발효</option>
                        <option option value="숙성">숙성</option>
                        <option value="숙성후여과">숙성 후 여과</option>
                        <option value="탄산조정">탄산조정</option>
                        <option value="패키징 및 출하">패키징 및 출하</option>
                     </select>          
                  </div>
                </div>

              <div className="edit-row">
                <div className="edit-field">
                  <label>작업장 코드</label>
                    <input type="text" name="workplaceCode" value={updatedData.workplaceCode} onChange={handleChange} />
                </div>    
                <div className="edit-field">
                  <label>작업장 상태</label>
                    <select className="edit-select" name="workplaceStatus" value={updatedData.workplaceStatus} onChange={handleChange}>
                      <option value="가동">가동</option>
                      <option value="정지">정지</option>
                      <option value="고장">고장</option>
                      <option value="수리">수리</option>
                    </select>
                </div>
              </div>
        
              <div className="edit-row">
                <div className="edit-field">
                  <label>작업장위치</label>
                    <input type="text" name="workplaceLocation" value={updatedData.workplaceLocation} onChange={handleChange}/>
                </div>
              <div className="edit-field">
                <label>LINE 정보</label>
                  <select className="edit-select" name="lineId" value={updatedData.lineId} onChange={handleChange}>
                    <option value="LINE001">LINE001</option>
                    <option value="LINE002">LINE002</option>
                    <option value="LINE003">LINE003</option>
                    <option value="LINE004">LINE004</option>
                    <option value="LINE005">LINE00</option>
                  </select>
              </div>
            </div>


            <div className="edit-row">
              <div className="edit-field">
                <label>작업담당자</label>  
                  <input type="text" name="managerName" value={updatedData.managerName} onChange={handleChange}/>
              </div>
              
              <div className="edit-field">
                <label>생산가능용량</label>
                  <input type="text" name="workplaceCapacity" value={updatedData.workplaceCapacity} onChange={handleChange}/>
                  <select className="edit-select" name="workplaceCapacityUnit" value={updatedData.workplaceCapacityUnit} onChange={handleChange}>
                    <option value="L">L/day</option>  
                    <option value="kg">kg/day</option>  
                  </select>
              </div>
            </div>  

              {/* 버튼 */}
              <div className="edit-buttons">
                <button className="cancel-btn" onClick={()=>setShowEditForm(false)}>취소</button>
                <button className="update-btn" onClick={handleUpdateClick}>수정하기</button>
               
              </div>             
            </div>
          </div>
          
        )}

          {/*수정 확인 모달 */}
          <ConfirmModal
           isOpen={showConfirmModal}
           onClose={()=>setShowConfirmModal(false)}
           onConfirm={confirmUpdate}
           message="작업장 정보를 수정하시겠습니까?"
          />
          {/*수정완료 모달*/}
          <AlertModal
            isOpen={showSuccessModal}
            onClose={() =>setShowSuccessModal(false)}
            message="작업장 정보가 성공적으로 수정되었습니다."/>
      </div>  
    );
  }
  



export default WorkplaceTable;

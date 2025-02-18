import { useState , useEffect } from "react";
import axios from "axios";
import ConfirmModal from "../common/Modal";
import AlertModal from "../common/AlertModal";
import "../../styles/standard-information/workplace-table.css";
  /*
    -렌더링 : React가 화면을 다시 그리는과정
    -최초 렌더링 : 컴포넌트가 처음 나타날 때 실행
    -재 렌더링 : useState 값이 변경될때, props가 변경될 때 실행
    -렌더링 최적화 : useMemo() , useCallback(), React.memo 사용
  */


  /*
    --useState 는 React에서 상태를 관리하는 함수
      컴포넌트가 변경되어야 할 값을 저장하 는 역활
      React 컴포넌트가 상태를 변경하면 화면이 자동으로 다시 렌더링됨
      const[현재상태값(초기값:0),상태를변경하는함수] = useState(0);
  */


  const WorkplaceTable = ({workplaces,apiUrl}) => {
    console.log("🔍 WorkplaceTable에서 받은 API URL:", apiUrl);
    console.log("🔍 WorkplaceTable에서 받은 작업장 데이터:", workplaces);

    const[selectedWorkplace, setSelectedWorkplace] =useState(null);
    const[updatedData , setUpdatedData] = useState({}); // 수정!
    const[showEditForm , setShowEditForm] = useState(false);
    const[showConfirmModal , setShowConfirmModal] =useState(false);
    const[showSuccessModal , setShowSuccessModal] = useState(false);
    const[errorMessage , setErrorMessage] = useState("");

    /* 
     --useEffect 사용 이유--
     showEditForm 값이 변경될 때마다 자동으로 실행되는 함수
     주로 컴포넌트가 처음 렌더링 될때 또는 특정 값이 바뀔때 실행됨
     console.log 를 사용해서 showEditForm 값이 언제 변경되는지 확인 가능
     
     --useEffect 효과--
      - 처음 컴포넌트가 렌더링 될때 실행된다.
      - showEditForm 값이 true 또는 false 로 변경될 때마다 실행됨
      - console.log 를 통해 값이 변경될 떄마다 로그 확인 기능
     */


    useEffect(()=>{
      console.log("📌 showEditForm 값 변경됨:", showEditForm);
    },[showEditForm]);


    // 수정 버튼 클릭 시 해당 장업장 정보 불러오기
    //workplaceId 가 없으면 console.error 로 오류 표시 후 함수실행을 중단
    //기존 updatedData(prev)를 유지하면서 새 데이터 추가
    // 데이터 변경이 일어나도 기존값이 사라지지 않도록 방지지
    const handleEditClick = (workplace) => {
      if(!workplace||!workplace.workplaceId){
        console.error("❌ Error: 선택된 작업장의 ID가 없습니다!");
        return;
      }

      console.log("🔍 [수정 버튼 클릭됨] workplace:", workplace);
      console.log("🔍 [수정 버튼 클릭됨] workplaceId:", workplace.workplaceId);
      
      setSelectedWorkplace(workplace);

      //기존값이 날아가는 것을 방지
      setUpdatedData((prev)=>({
        ...prev,...workplace,
      }));
      setShowEditForm(true);
    };


    // 입력 필드 값 변경 핸들러러
    // 기존데이터(prev)를 유지하면서 변경된 값만 업데이트
    // 값이 undefined이면 문자열("")을 기본값으로 설정
    // 예상치 못한 undefined 값으로 인해 오류 발생을 방지
    const handleChange = (e) => {
      setUpdatedData((prev)=>({
        ...prev,[e.target.name]:e.target.value||prev[e.target.name]||"",
      }));
    };
    // 수정하기 버튼 클릭 시 확인 모달 표시
    const handleUpdateClick = () => {
      setShowConfirmModal(true);
    };


    // API 호출하여 수정 요청 실행
    /*
      async / await 을 사용하는 이유
      -비동기 요청(백엔드API호출)을 처리할 때 사용
      -서버에서 응답이 올 때까지 기다리도록 await 사용
      -오류가 발생하면 catch 블록에 처리 가능

      --어떤 상황에서 사용?
      - API 요청을 보낼때 (데이터를 서버에서 받아올 때)
      - 비동기 코드 실행후 결과를 기달려야 할때

      -- async 는 함수선언 앞에 위치!
      -- await 은 비동기 요청 앞에 위치!
    */

    const confirmUpdate  = async ()=>{
      const workplaceId = (selectedWorkplace?.workplaceId|| updatedData?.workplaceId||"").trim();

      // workplaceId 가 undefined일 경우 API 요청 방지
      if(!workplaceId){
        console.error("❌ Error: workplaceId가 없습니다! API 요청 중단.");
        return;
      }

      if(!apiUrl){
        console.error("❌ Error: API URL이 설정되지 않았습니다!");
        return;
      }

      const putUrl = `${apiUrl}/workplaces/${workplaceId}`;
      console.log("✅ [API 요청 URL]:", putUrl);

      try{
        const response = await axios.put(putUrl,updatedData)
        console.log("✅ 작업장 수정 성공:", response);

        if(response.status === 200){
          setShowConfirmModal(true);
          setShowEditForm(false); // 수정 폼 닫기
          
          //일정 시간 후 새로고침
          setTimeout(()=>{
            window.location.reload();
          },2000); //2초 딜레이이
        }
      }catch(error){
        setErrorMessage(error.response?.data?.massage||"수정하는데 문제가생겼어요!");
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
                     <select className="edit-select" name="workplaceType" value={updatedData.workplaceType} onChange={handleChange}> {/*수정!*/}
                        <option value="분쇄">분쇄</option>
                        <option value="당화">당화</option>
                        <option value="여과">여과</option>
                        <option value="끓임">끓임</option>
                        <option value="냉각">냉각</option>
                        <option value="발효">발효</option>
                        <option value="숙성">숙성</option>
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
                    <option value="LINE005">LINE005</option>
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
                  <input className="capacity-input" type="text" name="workplaceCapacity" value={updatedData.workplaceCapacity} onChange={handleChange}/>
                  <select className="edit-select" id="capacity-edit" name="workplaceCapacityUnit" value={updatedData.workplaceCapacityUnit} onChange={handleChange}>
                    <option value="L">L</option>  
                    <option value="kg">kg</option>  
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

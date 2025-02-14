import { useState } from "react";
import "../../styles/standard-information/workplace-form.css";

const WorkplaceForm = ({ onAddWorkplace }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    type: "재료분해",
    status: "가동",
    manager: "",
    capacity: "",
    volume: "L",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWorkplace(formData); // 데이터 추가
    setFormData({
      name: "",
      code: "",
      location: "",
      type: "재료분해",
      status: "가동",
      manager: "",
      capacity: ""   
    });
  };

  return (
    <div className="workplace-form-container">
      <h2 className="workplace-title">작업장 정보 등록</h2>
      <form className="workplace-form" onSubmit={handleSubmit}>
        <div className="workplace-input-group">
          <label>작업장 이름</label>
          <input className="workplace-input" name="name" value={formData.name} placeholder="작업장 이름" onChange={handleChange} />
          
          <label>작업장 타입</label>
            <select className="workplace-select" name="type" onChange={handleChange}>
              <option value="1">재료분해</option>
              <option value="2">당화</option>
              <option value="3">여과</option>
              <option value="4">끓임</option>
              <option value="5">냉각</option>
              <option value="6">발효</option>
              <option value="7">숙성</option>
              <option value="8">숙성후 여과</option>
              <option value="9">탄산조정</option>
              <option value="10">패키징 및 출하하</option>
            </select>         
        </div>


        <div className="workplace-input-group">
        
        <label>작업장 코드</label>
        <input className="workplace-input" name="code" value={formData.code} placeholder="작업장 코드" onChange={handleChange} />

        <label>작업장 상태</label>
          <select className="workplace-select" name="status" onChange={handleChange}>
            <option value="a">가동</option>
            <option value="b">정지</option>
            <option value="c">고장</option>
            <option value="d">수리</option>
          </select>

        <label>LINE 정보</label>
        <select className="workplace-select" name="line" onChange={handleChange}>
            <option value="1">LINE001</option>
            <option value="2">LINE002</option>
            <option value="3">LINE003</option>
            <option value="4">LINE004</option>
            <option value="5">LINE005</option>
        </select>

        </div>


        <div className="workplace-input-group">
          <label>작업장 위치</label>
          <input className="workplace-input" name="location" value={formData.location} placeholder="작업장 위치" onChange={handleChange} />

          <label>작업 담당자</label>
          <input className="workplace-input" name="manager" value={formData.manager} placeholder="작업 담당자" onChange={handleChange} />

          <label>작업장 용량/생산 가능량</label>
          <input className="workplace-input" name="capacity" placeholder="작업장 용량/ 생산 가능량" onChange={handleChange} />
      
          <select name="volume" onChange={handleChange}>
            <option value="L">L / day </option>
            <option value="kg">kg / day </option>
          </select>

        </div>

        <button className="workplace-button" type="submit">등록하기</button>
      </form>
    </div>
  );
};

export default WorkplaceForm;

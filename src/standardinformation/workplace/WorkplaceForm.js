import { useState } from "react";
import "../../styles/workplace-form.css";


const WorkplaceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    type: "냉각",
    status: "가동중",
    manager: "",
    capacity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("등록된 작업장 데이터:", formData);
  };

  return (
    <form className="workplace-form" onSubmit={handleSubmit}>
      
      <input className="workplace-input" name="name" placeholder="작업장 이름" onChange={handleChange} />
      
      <input className="workplace-input" name="code" placeholder="작업장 코드" onChange={handleChange} />
      
      <input className="workplace-input" name="location" placeholder="작업장 위치" onChange={handleChange} />
      
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
      
      <select className="workplace-select" name="status" onChange={handleChange}>
        <option value="a">가동</option>
        <option value="b">정지</option>
        <option value="c">고장</option>
        <option value="d">수리</option>
      </select>
      
      <input className="workplace-input" name="manager" placeholder="작업 담당자" onChange={handleChange} />
      
      <input name="capacity" placeholder="작업장 용량/ 생산 가능량" onChange={handleChange} />
      
      <select name="volume" onChange={handleChange}>
        <option value="L">L / day </option>
        <option value="kg">kg / day </option>
      </select>
      
      <button className="workplace-filter-btn" type="submit">등록하기</button>
    </form>
  );
};

export default WorkplaceForm;

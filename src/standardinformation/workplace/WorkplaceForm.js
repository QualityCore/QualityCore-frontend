import { useState } from "react";


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
      <input name="name" placeholder="작업장 이름" onChange={handleChange} />
      <input name="code" placeholder="작업장 코드" onChange={handleChange} />
      <input name="location" placeholder="작업장 위치" onChange={handleChange} />
      <select name="type" onChange={handleChange}>
        <option value="냉각">냉각</option>
        <option value="가열">가열</option>
      </select>
      <select name="status" onChange={handleChange}>
        <option value="가동중">가동중</option>
        <option value="정지됨">정지됨</option>
      </select>
      <input name="manager" placeholder="작업 담당자" onChange={handleChange} />
      <input name="capacity" placeholder="작업장 용량" onChange={handleChange} />
      <button type="submit">등록하기</button>
    </form>
  );
};

export default WorkplaceForm;

import axios from "axios";

export const fetchProductionLines = async (planProductId) =>{
    try{
    const response = await axios.get("http://localhost:8080/api/v1/plans/lines/{planProductId}")
    return response.data
    }catch(error){
        console.log("생산제품 데이터 불러오는도중 에러",error);
        return[];
    }
}

export const postProductionLines = async (allocatedData) =>{
    try{
    const response = await axios.post("http://localhost:8080/api/vi/lines",allocatedData)
    return response.data
}catch(error){
    console.log("생산 라인 데이터를 저장하는 중 오류 발생생",error)
    throw error;
    }
}
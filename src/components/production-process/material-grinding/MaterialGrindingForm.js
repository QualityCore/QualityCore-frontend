import React, { useState, useEffect } from "react";
import materialGrindingApi from "../../../apis/production-process/material-grinding/MaterialGrindingApi";
import styles from "../../../styles/production-process/MaterialGrindingControls.module.css";

const MaterialGrindingForm = ({ grindingData, setGrindingData }) => {
  const [formData, setFormData] = useState(grindingData);
  const [lineMaterial, setLineMaterial] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");

  useEffect(() => {
    setFormData(grindingData); // ✅ grindingData 변경 시 formData를 최신 상태로 업데이트
  }, [grindingData]);

  // 작업지시 ID 목록 가져오기 (중복 제거 추가)
  useEffect(() => {
    const fetchLineMaterial = async () => {
      try {
        const response = await materialGrindingApi.getLineMaterial();
        console.log("📌 API 응답 데이터:", response);

        // API 응답에서 배열 데이터 추출
        const data = response.result?.lineMaterials || [];
        console.log("📌 추출된 작업지시 목록:", data);

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ 작업지시 ID 데이터 없음!");
          return;
        }

        // lotNo가 존재하는 데이터만 필터링
        const filteredData = data.filter((item) => item.lotNo);
        console.log("📌 lotNo가 있는 데이터:", filteredData);

        // 중복된 lotNo 제거 (Set 사용)
        const uniqueLots = Array.from(
          new Set(data.map((item) => item.lotNo))
        ).map((lotNo) => data.find((item) => item.lotNo === lotNo));

        console.log("📌 최종 저장된 작업지시 목록:", uniqueLots);

        setLineMaterial(uniqueLots); // 중복 제거된 데이터 저장
      } catch (error) {
        console.error("❌ 작업지시 ID 목록 불러오기 실패:", error);
      }
    };
    fetchLineMaterial();
  }, []);

  // 주원료 필터링: "보리", "밀", "쌀"만 허용
  const allowedMaterials = ["보리", "밀", "쌀"];

  const handleLotNoChange = async (e) => {
    const selectedLotNo = e.target.value;
    if (!selectedLotNo) return; // ✅ 선택된 lotNo가 없으면 실행하지 않음

    try {
      const response = await materialGrindingApi.getMaterialByLotNo(
        selectedLotNo
      );
      console.log("📌 API 응답 데이터:", response);

      // 📌 올바른 배열 데이터로 변환
      const materialData = response.result?.materials || [];
      console.log("📌 변환된 원료 데이터:", materialData);

      if (!Array.isArray(materialData) || materialData.length === 0) {
        console.warn("⚠️ 주원료 데이터가 없습니다.");
        resetFormData(); // ✅ 값 초기화 함수 호출
        return;
      }

      // 🔹 `allowedMaterials`에 포함된 원료 찾기
      const validMaterial = materialData.find((item) =>
        allowedMaterials.includes(item.materialName)
      );

      // 🔹 `maltTypes`(맥아 종류) 중에서 존재하는 맥아 찾기
      const validMalt = materialData.find((item) =>
        maltTypes.includes(item.materialName)
      );

      if (validMaterial) {
        const materialName = validMaterial.materialName;
        const totalQty = validMaterial.totalQty || 0;

        const updatedData = {
          lotNo: selectedLotNo,
          mainMaterial: materialName,
          mainMaterialInputVolume: totalQty,
          grindIntervalSetting:
            materialSettings[materialName]?.grindInterval || "",
          grindSpeedSetting: materialSettings[materialName]?.grindSpeed || "",
          maltType: validMalt ? validMalt.materialName : "",
          maltInputVolume: validMalt ? validMalt.totalQty || "" : "",
        };
        console.log("✅ 업데이트할 데이터:", updatedData);

        setSelectedMaterial(materialName);
        setFormData((prev) => ({ ...prev, ...updatedData })); // ✅ 로컬 상태 업데이트
        setGrindingData((prev) => ({ ...prev, ...updatedData })); // ✅ 부모 상태 업데이트
      } else {
        console.warn(
          `⚠️ 허용되지 않은 원료만 포함됨: ${materialData
            .map((item) => item.materialName)
            .join(", ")}`
        );
        resetFormData(); // ✅ 값 초기화 함수 호출
      }
    } catch (error) {
      console.error("❌ 주원료 불러오기 실패:", error);
      resetFormData(); // ✅ API 오류 시도 동일하게 초기화
    }
  };

  // ✅ 중복 제거를 위해 초기화 함수 추가
  const resetFormData = () => {
    setSelectedMaterial("");
    const resetData = {
      lotNo: "",
      mainMaterial: "",
      mainMaterialInputVolume: "",
      grindIntervalSetting: "",
      grindSpeedSetting: "",
      maltType: "",
      maltInputVolume: "",
    };
    setFormData(resetData);
    setGrindingData(resetData);
  };

  // ✅ 허용된 맥아 종류 리스트
  const maltTypes = ["페일 몰트", "필스너 몰트", "초콜릿 몰트"];

  const materialSettings = {
    쌀: { grindInterval: 1, grindSpeed: 150 },
    보리: { grindInterval: 1.5, grindSpeed: 200 },
    밀: { grindInterval: 1, grindSpeed: 250 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // 🔹 로컬 상태(formData) 업데이트
      let updatedData = { ...prev, [name]: value };

      // ✅ 원료(mainMaterial) 변경 시, 분쇄 간격과 속도를 자동 설정
      if (name === "mainMaterial") {
        const settings = materialSettings[value] || {
          grindInterval: "",
          grindSpeed: "",
        };
        updatedData.grindIntervalSetting = settings.grindInterval;
        updatedData.grindSpeedSetting = settings.grindSpeed;
      }

      return updatedData;
    });

    setGrindingData((prev) => {
      // ✅ 부모 상태(grindingData)도 함께 업데이트 (중요!)
      let updatedData = { ...prev, [name]: value };

      // ✅ 원료(mainMaterial) 변경 시, 부모 상태도 함께 업데이트
      if (name === "mainMaterial") {
        const settings = materialSettings[value] || {
          grindInterval: "",
          grindSpeed: "",
        };
        updatedData.grindIntervalSetting = settings.grindInterval;
        updatedData.grindSpeedSetting = settings.grindSpeed;
      }
      console.log("🔄 grindingData 업데이트됨:", updatedData);
      return updatedData;
    });
  };

  return (
    <div className={styles.materialGrindingForm}>
      <h2 className={styles.grindingTitle}>분쇄 공정</h2>
      <div className={styles.gFormGrid}>
        <div className={styles.gGridItem}>
          <label className={styles.gLabel01}>작업지시 ID </label>
          <select
            className={styles.gItem01}
            name="lotNo"
            value={formData.lotNo}
            onChange={handleLotNoChange}
          >
            <option value="">ID 선택</option>
            {lineMaterial.map((item) => (
              <option key={item.lineMaterialId} value={item.lotNo}>
                {item.lotNo}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel02}>주원료</label>
          <input
            className={styles.gItem02}
            type="text"
            name="mainMaterial"
            value={selectedMaterial}
            readOnly
          />
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel03}>주원료 투입량</label>
          <input
            className={styles.gItem03}
            type="number"
            name="mainMaterialInputVolume"
            value={formData.mainMaterialInputVolume}
            onChange={handleChange}
          />{" "}
          kg
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel04}>맥아종류</label>
          <input
            className={styles.gItem04}
            type="text"
            name="maltType"
            value={formData.maltType}
            readOnly
          />
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel05}>맥아 투입량</label>
          <input
            className={styles.gItem05}
            type="number"
            name="maltInputVolume"
            value={formData.maltInputVolume}
            readOnly
          />{" "}
          kg
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel06}>분쇄 간격 설정</label>
          <input
            className={styles.gItem06}
            type="number"
            name="grindIntervalSetting"
            value={formData.grindIntervalSetting}
            readOnly
          />{" "}
          mm
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel07}>분쇄 속도 설정</label>
          <input
            className={styles.gItem07}
            type="number"
            name="grindSpeedSetting"
            value={formData.grindSpeedSetting}
            readOnly
          />{" "}
          RPM
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel08}>소요 시간</label>
          <input
            className={styles.gItem08}
            type="number"
            name="grindDuration"
            value={formData.grindDuration}
            onChange={handleChange}
          />{" "}
          분
        </div>

        {/* <div className={styles.gGridItem}>
          <label className={styles.gLabel09}>상태 코드</label>
          <input
            className={styles.gItem09}
            type="text"
            name="statusCode"
            value="SC001"
            disabled
          />
        </div> */}

        <div className={styles.gGridItem}>
          <label className={styles.gLabel10}>공정 상태</label>
          <input
            className={styles.gItem10}
            type="text"
            name="processStatus"
            value={formData.processStatus}
            disabled
          />
        </div>

        <div className={styles.gGridItem}>
          <label className={styles.gLabel11}>메모 사항</label>
          <input
            className={styles.gItem11}
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialGrindingForm;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllMaturation } from "../../../apis/production-process/maturation-detail/maturationDetailApi";
import { logMaturationData } from "../../../apis/production-process/maturation-detail/maturationTimeLogApi";
import MaturationCss from "../../../styles/production-process/MaturationPage.module.css";

function MaturationPage() {
    const [maturationList, setMaturationList] = useState([]);
    const [logData, setLogData] = useState({
        maturationId: "",
        recordTime: 1, // 1분 = 60초 (테스트용)
        temperature: 0,
        pressure: 0,
        co2Percent: 0,
        dissolvedOxygen: 0,
        notes: "",
    });

    const navigate = useNavigate();

    // 남은 기간 계산 함수 (분 단위)
    const calculateRemainingMinutes = (endTime) => {
        const now = new Date();
        const endDate = new Date(endTime);

        const timeDiff = endDate.getTime() - now.getTime(); // 밀리초 단위 차이
        const minutesRemaining = Math.ceil(timeDiff / (1000 * 60));

        return minutesRemaining > 0 ? `${minutesRemaining}분 남음` : "숙성 완료";
    };

    // 체크 시간 계산 함수 (실시간)
    const calculateCheckTime = (nextCheckTime) => {
        const now = new Date();
        const timeDiff = new Date(nextCheckTime).getTime() - now.getTime();

        if (timeDiff <= 0) return "체크 필요!";

        const minutes = Math.floor(timeDiff / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return `${minutes}분 ${seconds}초 남음`;
    };

    useEffect(() => {
        const getMaturationData = async () => {
            try {
                const data = await fetchAllMaturation();
                const updatedData = data.map((item) => {
                    // 종료 시간 설정 (3분 후), 최초에만 설정!
                    let endTime = localStorage.getItem(`endTime_${item.maturationId}`);
                    if (!endTime) {
                        endTime = new Date(
                            new Date().getTime() + 3 * 60 * 1000
                        ).toISOString();
                        localStorage.setItem(`endTime_${item.maturationId}`, endTime);
                    }

                    // 체크 시간 설정 (1분 후)
                    let nextCheck = localStorage.getItem(`nextCheck_${item.maturationId}`);
                    if (!nextCheck) {
                        nextCheck = new Date(
                            new Date().getTime() + 1 * 60 * 1000
                        ).toISOString();
                        localStorage.setItem(`nextCheck_${item.maturationId}`, nextCheck);
                    }

                    return {
                        ...item,
                        endTime: new Date(endTime),
                        nextCheckTime: new Date(nextCheck),
                    };
                });
                setMaturationList(updatedData);
            } catch (error) {
                console.error("숙성 데이터 로드 실패:", error);
            }
        };
        getMaturationData();
    }, []);

    useEffect(() => {
        // 체크 시간 업데이트 (매 초마다!)
        const checkInterval = setInterval(() => {
            setMaturationList((prevList) =>
                prevList.map((item) => ({
                    ...item,
                    remainingCheck: calculateCheckTime(item.nextCheckTime),
                }))
            );
        }, 1000); // 1초마다 업데이트

        // 남은 시간 업데이트 (매 초마다!)
        const dayInterval = setInterval(() => {
            setMaturationList((prevList) =>
                prevList.map((item) => ({
                    ...item,
                    remainingTime: calculateRemainingMinutes(item.endTime),
                }))
            );
        }, 1000); // 1초마다 업데이트

        return () => {
            clearInterval(checkInterval);
            clearInterval(dayInterval);
        };
    }, []);

    const handleLogRegistration = async () => {
        try {
            if (!logData.maturationId) {
                alert("숙성 공정 ID를 선택하세요.");
                return;
            }

            // 다음 체크 시간 설정
            const nextCheck = new Date(
                new Date().getTime() + logData.recordTime * 60 * 1000
            ).toISOString();
            localStorage.setItem(`nextCheck_${logData.maturationId}`, nextCheck);

            // 로그 등록
            const logId = await logMaturationData(logData);
            alert(`로그 등록 성공! 다음 체크 시간: ${new Date(nextCheck).toLocaleString()}`);

            // 상태 업데이트
            setMaturationList((prevList) =>
                prevList.map((item) =>
                    item.maturationId === logData.maturationId
                        ? { ...item, nextCheckTime: new Date(nextCheck) }
                        : item
                )
            );

            setLogData({
                maturationId: "",
                recordTime: 1, // 기본값 유지 (1분)
                temperature: 0,
                pressure: 0,
                co2Percent: 0,
                dissolvedOxygen: 0,
                notes: "",
            });
        } catch (error) {
            alert("로그 등록 실패. 다시 시도해주세요.");
        }
    };

    return (
        <div className={MaturationCss.container}>
            {/* 숙성 시간대별 로그 등록 폼 */}
            <div className={MaturationCss.logForm}>
                <h2>숙성 시간대별 로그 등록</h2>
                <label>
                    숙성 공정 ID:
                    <select
                        value={logData.maturationId}
                        onChange={(e) =>
                            setLogData({ ...logData, maturationId: e.target.value })
                        }
                    >
                        <option value="">선택</option>
                        {maturationList.map((m) => (
                            <option key={m.maturationId} value={m.maturationId}>
                                {m.maturationId}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    온도 (°C):
                    <input
                        type="number"
                        step="0.01"
                        value={logData.temperature}
                        onChange={(e) =>
                            setLogData({ ...logData, temperature: parseFloat(e.target.value) })
                        }
                    />
                </label>
                <label>
                    압력 (bar):
                    <input
                        type="number"
                        step="0.01"
                        value={logData.pressure}
                        onChange={(e) =>
                            setLogData({ ...logData, pressure: parseFloat(e.target.value) })
                        }
                    />
                </label>
                <label>
                    CO2 농도 (%):
                    <input
                        type="number"
                        step="0.01"
                        value={logData.co2Percent}
                        onChange={(e) =>
                            setLogData({ ...logData, co2Percent: parseFloat(e.target.value) })
                        }
                    />
                </label>
                <label>
                    용존 산소량 (ppm):
                    <input
                        type="number"
                        step="0.01"
                        value={logData.dissolvedOxygen}
                        onChange={(e) =>
                            setLogData({ ...logData, dissolvedOxygen: parseFloat(e.target.value) })
                        }
                    />
                </label>
                <label>
                    메모 사항:
                    <textarea
                        value={logData.notes}
                        onChange={(e) =>
                            setLogData({ ...logData, notes: e.target.value })
                        }
                    />
                </label>
                <button onClick={handleLogRegistration}>등록하기</button>
            </div>

            {/* 숙성 목록 */}
            <h1>숙성 목록</h1>
            {maturationList.length > 0 ? (
                maturationList.map((maturation) => (
                    <div key={maturation.maturationId} className={MaturationCss.item}>
                        <h4>숙성조 번호: {maturation.maturationId}</h4>
                        <p>
                            남은 기간: {maturation.remainingTime || calculateRemainingMinutes(maturation.endTime)}
                        </p>
                        <p>
                            다음 체크: {maturation.remainingCheck || calculateCheckTime(maturation.nextCheckTime)}
                        </p>
                        <button
                            className={
                                maturation.remainingCheck === "체크 필요!"
                                    ? MaturationCss.alertButton
                                    : MaturationCss.detailButton
                            }
                            onClick={() =>
                                navigate(`/maturation-details/${maturation.maturationId}`)
                            }
                        >
                            {maturation.remainingCheck === "체크 필요!" ? "지금 체크하기" : "상세정보"}
                        </button>
                    </div>
                ))
            ) : (
                <p>숙성 데이터가 없습니다.</p>
            )}
        </div>
    );
}

export default MaturationPage;

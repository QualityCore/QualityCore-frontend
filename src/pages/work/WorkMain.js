import React, { useState, useEffect } from 'react';
import { findAllWorkOrders } from "../../apis/workOrderApi/workOrdersApi";

function WorkMain() {
    const [workOrders, setWorkOrders] = useState([]);

    useEffect(() => {
        fetchWorkOrders();
    }, []);

    const fetchWorkOrders = async () => {
        try {
            const data = await findAllWorkOrders(0, 100); // 페이지 크기를 크게 설정하여 모든 데이터를 가져옵니다
            if (data && data.work && Array.isArray(data.work.content)) {
                setWorkOrders(data.work.content);
            }
        } catch (error) {
            console.error("Error fetching work orders:", error);
        }
    };

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


    return (
        <div>
            <h1>작업 현황</h1>
            <table>
                <thead>
                    <tr>
                        <th>작업지시번호</th>
                        <th>작업조</th>
                        <th>생산라인</th>
                        <th>작업지시상태</th>
                        <th>진행률</th>
                    </tr>
                </thead>
                <tbody>
                    {workOrders.map((order) => (
                        <tr key={order.lotNo}>
                            <td>{order.lotNo}</td>
                            <td>{order.workTeam}</td>
                            <td>{order.lineNo} LINE</td>
                            <td>{order.processStatus}</td>
                            <td>
                                <div className={order.progressBar}>
                                    <div
                                        className={order.progressBarFill}
                                        style={{ width: `${getWorkProgress(order.statusCode)}%` }}
                                    ></div>
                                    <div className={order.progressBarLabel}>
                                        {getWorkProgress(order.statusCode)}%
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WorkMain;

import React, { useState, useEffect, createContext } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
    // 게시판 알림 상태
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('boardNotifications');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    // 작업지시서 알림 상태 ➕
    const [workOrderMessages, setWorkOrderMessages] = useState(() => {
        const savedWorkOrders = localStorage.getItem('workOrderNotifications');
        return savedWorkOrders ? JSON.parse(savedWorkOrders) : [];
    });

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            // 게시판 알림 구독
            stompClient.subscribe("/topic/newPosts", (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages(prev => {
                    const updated = [...prev, newMessage];
                    localStorage.setItem('boardNotifications', JSON.stringify(updated));
                    return updated;
                });
            });

            // 작업지시서 알림 구독 ➕
            stompClient.subscribe("/topic/workOrders", (message) => {
                const newWorkOrder = JSON.parse(message.body);
                setWorkOrderMessages(prev => {
                    const updated = [...prev, newWorkOrder];
                    localStorage.setItem('workOrderNotifications', JSON.stringify(updated));
                    return updated;
                });
            });
        });

        return () => stompClient.disconnect();
    }, []);

    // 게시판 알림 초기화
    const resetNotifications = () => {
        setMessages([]);
        localStorage.removeItem('boardNotifications');
    };

    // 작업지시서 알림 초기화 ➕
    const resetWorkOrderNotifications = () => {
        setWorkOrderMessages([]);
        localStorage.removeItem('workOrderNotifications');
    };

    return (
        <WebsocketContext.Provider 
            value={{ 
                messages, 
                setMessages,
                workOrderMessages, // ➕
                setWorkOrderMessages,
                resetNotifications,
                resetWorkOrderNotifications // ➕
            }}
        >
            {children}
        </WebsocketContext.Provider>
    );
};

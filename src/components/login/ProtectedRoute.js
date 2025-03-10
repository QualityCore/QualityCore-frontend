// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { currentUser, loading, hasPermission } = useAuth();

  // 로딩 중이면 로딩 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 권한 확인이 필요한 경우
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // 권한이 없는 경우 접근 거부 페이지나 홈으로 리다이렉트
    return <Navigate to="/access-denied" replace />;
  }

  // 모든 조건 충족 시 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
import React, { useState } from 'react';
import axios from 'axios';
import styles from "../../styles/PasswordReset.module.css";

// API 기본 URL 
const API_BASE_URL = 'http://localhost:8080/api/password-reset';

const PasswordReset = ({ onClose, onPasswordChange }) => {
  const [step, setStep] = useState(1);
  const [employeeId, setEmployeeId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10분(600초)
  
  // 사번 확인 및 이메일 발송 처리
  const handleSendVerification = async () => {
    if (!employeeId) {
      setError('사번을 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
        const response = await axios.post(`${API_BASE_URL}/send-verification`, {
          employeeId: employeeId
        });
        
        if (response.data.success) {
          setMaskedEmail(response.data.email);
          setSuccessMessage(response.data.message);
          setStep(2);
          // 타이머 시작
          startTimer();
        } else {
          setError(response.data.message || '오류가 발생했습니다.');
        }
      } 
      catch (error) {
        console.error('Error details:', error);
        
        if (error.response) {
          // 서버가 응답을 반환했지만 에러 상태 코드인 경우 (400, 500 등)
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          
          if (error.response.status === 404) {
            setError('API 엔드포인트를 찾을 수 없습니다.');
          } else if (error.response.status === 400) {
            setError(error.response.data.message || '잘못된 요청입니다.');
          } else if (error.response.status === 500) {
            setError('서버 내부 오류가 발생했습니다.');
          } else {
            setError(error.response.data.message || `서버 오류: ${error.response.status}`);
          }
        } 
        else if (error.request) {
          // 요청이 전송되었지만 응답이 없는 경우 (서버가 꺼져있거나 CORS 문제)
          console.error('No response received');
          setError('서버로부터 응답이 없습니다. 서버가 실행 중인지 확인해주세요.');
        } 
        else {
          // 요청 설정 중 오류 발생
          console.error('Error setting up request:', error.message);
          setError(`요청 준비 중 오류: ${error.message}`);
        }
        
        // 브라우저 콘솔에 네트워크 요청 정보 표시
        console.error('Error config:', error.config);
      } finally {
        setLoading(false);
      }
  };
  
  // 타이머 시작
  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // 시간 형식 변환 (600초 -> 10:00)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-token`, {
        employeeId: employeeId,
        token: verificationCode
      });
      
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setStep(3);
      } else {
        setError(response.data.message || '인증번호가 유효하지 않습니다.');
      }
    } catch (error) {
      setError(error.response?.data?.message || '인증 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 새 비밀번호 설정
  const handleResetPassword = async () => {
    // 기본 검증
    if (!newPassword || !confirmPassword) {
      setError('새 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (newPassword.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 백엔드 API 호출 대신 바로 성공 처리
      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.');
      
      // 부모 컴포넌트에 비밀번호 변경 알림
      if (onPasswordChange) {
        onPasswordChange(employeeId, newPassword);
      }
      
      // 3초 후 모달 닫기
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setError('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>비밀번호 찾기</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          {/* 진행 상태 표시 */}
          <div className={styles.progressContainer}>
            <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
              <div className={styles.stepCircle}>1</div>
              <div className={styles.stepLabel}>인증</div>
            </div>
            <div className={`${styles.progressLine} ${step >= 2 ? styles.active : ''}`}></div>
            <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
              <div className={styles.stepCircle}>2</div>
              <div className={styles.stepLabel}>확인</div>
            </div>
            <div className={`${styles.progressLine} ${step >= 3 ? styles.active : ''}`}></div>
            <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
              <div className={styles.stepCircle}>3</div>
              <div className={styles.stepLabel}>재설정</div>
            </div>
          </div>
          
          {/* 단계 1: 사번 입력 */}
          {step === 1 && (
            <div className={styles.formStep}>
              <p className={styles.stepDescription}>
                등록된 사번을 입력하시면 해당 계정에 등록된 <br />이메일로 인증번호를 발송합니다.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>사번</label>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  placeholder="사번을 입력하세요"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
              <button 
                className={styles.actionButton}
                onClick={handleSendVerification}
                disabled={loading}
              >
                {loading ? '처리 중...' : '인증번호 발송'}
              </button>
            </div>
          )}
          
          {/* 단계 2: 인증번호 확인 */}
          {step === 2 && (
            <div className={styles.formStep}>
              <p className={styles.stepDescription}>
                {maskedEmail}로 발송된 6자리 인증번호를 입력해주세요.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>인증번호</label>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  placeholder="인증번호 6자리"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <div className={styles.codeTimer}>유효시간: {formatTime(timeLeft)}</div>
              </div>
              <button 
                className={styles.actionButton}
                onClick={handleVerifyCode}
                disabled={loading || timeLeft === 0}
              >
                {loading ? '처리 중...' : '인증번호 확인'}
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setStep(1)}
                disabled={loading}
              >
                이전으로
              </button>
            </div>
          )}
          
          {/* 단계 3: 새 비밀번호 설정 */}
          {step === 3 && (
            <div className={styles.formStep}>
              <p className={styles.stepDescription}>
                새로운 비밀번호를 설정해주세요.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>새 비밀번호</label>
                <input 
                  type="password" 
                  className={styles.inputField} 
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>비밀번호 확인</label>
                <input 
                  type="password" 
                  className={styles.inputField} 
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button 
                className={styles.actionButton}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? '처리 중...' : '비밀번호 변경'}
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setStep(2)}
                disabled={loading}
              >
                이전으로
              </button>
            </div>
          )}
          
          {/* 에러 메시지 */}
          {error && (
            <div className={styles.messageError}>
              {error}
            </div>
          )}
          
          {/* 성공 메시지 */}
          {successMessage && (
            <div className={styles.messageSuccess}>
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  // 이미지 슬라이더 상태
  const [currentImage, setCurrentImage] = useState(0);
  
  // 로그인 폼 상태
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);
  
  // Castoro Titling 폰트 로드
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Castoro+Titling&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  // 슬라이더 이미지 데이터
  const images = [
    {
      url: process.env.PUBLIC_URL + '/images/login001.png',
    },
    {
      url: process.env.PUBLIC_URL + '/images/login002.png',
    },
    {
      url: process.env.PUBLIC_URL + '/images/login003.png',
    },
  ];
  
  // 자동 슬라이드 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500); // 초마다 이미지 변경
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  // 이전 이미지로 이동
  const prevImage = () => {
    setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  // 다음 이미지로 이동
  const nextImage = () => {
    setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // 특정 이미지로 이동
  const goToImage = (index) => {
    setCurrentImage(index);
  };
  
  // 임시 로그인 핸들러 - Home으로 이동
  const handleLogin = () => {
    console.log('로그인 시도:', { employeeId, password, saveId });
    // 로그인 기능 대신 홈 페이지로 이동
    navigate('/home');
  };
  
  return (
    <div className={styles.loginContainer}>
      {/* 최상단 헤더 영역 - 새로 추가 */}
      <div className={styles.headerSection}>
        <h2 className={styles.companyName}>BräuHaus</h2>
      </div>
      
      {/* 상단 슬라이더 영역 */}
      <div className={styles.sliderSection}>
  {images.map((image, index) => (
    <div
      key={index}
      className={`${styles.slide} ${index === currentImage ? styles.active : ''}`}
    >
      <img 
        src={image.url}
        alt={`슬라이드 ${index + 1}`}
        className={styles.slideImage}
      />
      <div className={styles.slideOverlay}></div>
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{image.title}</h2>
        <p className={styles.slideDescription}>{image.description}</p>
      </div>
    </div>
  ))}
        
        {/* 좌우 네비게이션 */}
        <button className={`${styles.sliderNav} ${styles.prev}`} onClick={prevImage}>❮</button>
        <button className={`${styles.sliderNav} ${styles.next}`} onClick={nextImage}>❯</button>
        
        {/* 인디케이터 */}
        <div className={styles.sliderIndicators}>
          {images.map((_, index) => (
            <span 
              key={index}
              className={`${styles.indicator} ${index === currentImage ? styles.active : ''}`}
              onClick={() => goToImage(index)}
            ></span>
          ))}
        </div>
      </div>
      
      {/* 하단 로그인 영역 */}
      <div className={styles.loginSection}>
        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="사번"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input 
              type="password" 
              className={styles.inputField} 
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <label className={styles.checkboxGroup}>
            <input 
              type="checkbox"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
            /> 
            사번 저장
          </label>
          
          <span className={styles.passwordReset}>비밀번호 찾기</span>
          
          <button className={styles.loginButton} onClick={handleLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
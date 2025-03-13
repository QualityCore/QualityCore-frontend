import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, ReferenceLine } from 'recharts';
import styles from '../../styles/productionPerformance/ProductionPerformance.module.css';

// 더미 데이터 정의
const DUMMY_DATA = {
  // 월별 생산실적 데이터
  monthlyData: [
    { yearMonth: '2025-01', productName: '아이유 맥주', totalQuantity: 1200, goodQuantity: 1140, qualityRate: 95.0 },
    { yearMonth: '2025-02', productName: '아이유 맥주', totalQuantity: 1500, goodQuantity: 1410, qualityRate: 94.0 },
    { yearMonth: '2025-03', productName: '아이유 맥주', totalQuantity: 1800, goodQuantity: 1730, qualityRate: 96.1 },
    { yearMonth: '2025-01', productName: '카리나 맥주', totalQuantity: 1000, goodQuantity: 950, qualityRate: 95.0 },
    { yearMonth: '2025-02', productName: '카리나 맥주', totalQuantity: 1400, goodQuantity: 1330, qualityRate: 95.0 },
    { yearMonth: '2025-03', productName: '카리나 맥주', totalQuantity: 1600, goodQuantity: 1550, qualityRate: 96.9 },
    { yearMonth: '2025-01', productName: '장원영 맥주', totalQuantity: 1300, goodQuantity: 1260, qualityRate: 96.9 },
    { yearMonth: '2025-02', productName: '장원영 맥주', totalQuantity: 1500, goodQuantity: 1470, qualityRate: 98.0 },
    { yearMonth: '2025-03', productName: '장원영 맥주', totalQuantity: 1700, goodQuantity: 1650, qualityRate: 97.1 }
  ],
  
  // 일별 세부 생산실적 데이터 (월별 차트에 사용)
  dailyData: [
    { productionDate: '2025-01-05', productName: '아이유 맥주', totalQuantity: 400, goodQuantity: 380, qualityRate: 95.0 },
    { productionDate: '2025-01-15', productName: '아이유 맥주', totalQuantity: 450, goodQuantity: 430, qualityRate: 95.6 },
    { productionDate: '2025-01-25', productName: '카리나 맥주', totalQuantity: 350, goodQuantity: 322, qualityRate: 92.0 },
    { productionDate: '2025-02-05', productName: '카리나 맥주', totalQuantity: 500, goodQuantity: 460, qualityRate: 92.0 },
    { productionDate: '2025-03-05', productName: '장원영 맥주', totalQuantity: 580, goodQuantity: 564, qualityRate: 97.3 },
    { productionDate: '2025-03-15', productName: '카리나 맥주', totalQuantity: 620, goodQuantity: 570, qualityRate: 92.0 }

  ],
  
  // 계획 대비 실적 데이터
  planVsActual: [
    { YEAR_MONTH: '2025-01', PRODUCT_NAME: '아이유 맥주', PLANNED_QUANTITY: 1200, ACTUAL_QUANTITY: 1140, ACHIEVEMENT_RATE: 95.0 },
    { YEAR_MONTH: '2025-02', PRODUCT_NAME: '아이유 맥주', PLANNED_QUANTITY: 1500, ACTUAL_QUANTITY: 1410, ACHIEVEMENT_RATE: 94.0 },
    { YEAR_MONTH: '2025-03', PRODUCT_NAME: '아이유 맥주', PLANNED_QUANTITY: 1800, ACTUAL_QUANTITY: 1730, ACHIEVEMENT_RATE: 96.1 },
    { YEAR_MONTH: '2025-01', PRODUCT_NAME: '카리나 맥주', PLANNED_QUANTITY: 1000, ACTUAL_QUANTITY: 970, ACHIEVEMENT_RATE: 97.0 },
    { YEAR_MONTH: '2025-02', PRODUCT_NAME: '카리나 맥주', PLANNED_QUANTITY: 1400, ACTUAL_QUANTITY: 1330, ACHIEVEMENT_RATE: 95.0 },
    { YEAR_MONTH: '2025-03', PRODUCT_NAME: '카리나 맥주', PLANNED_QUANTITY: 1600, ACTUAL_QUANTITY: 1550, ACHIEVEMENT_RATE: 96.9 },
    { YEAR_MONTH: '2025-01', PRODUCT_NAME: '장원영 맥주', PLANNED_QUANTITY: 1300, ACTUAL_QUANTITY: 1260, ACHIEVEMENT_RATE: 96.9 },
    { YEAR_MONTH: '2025-02', PRODUCT_NAME: '장원영 맥주', PLANNED_QUANTITY: 1500, ACTUAL_QUANTITY: 1455, ACHIEVEMENT_RATE: 97.0 },
    { YEAR_MONTH: '2025-03', PRODUCT_NAME: '장원영 맥주', PLANNED_QUANTITY: 1700, ACTUAL_QUANTITY: 1650, ACHIEVEMENT_RATE: 97.1 }
  ],
  
  // 불량률 데이터
  qualityData: [
    { productName: '아이유 맥주', qualityRate: 95.0, defectRate: 5.0 },
    { productName: '카리나 맥주', qualityRate: 92.0, defectRate: 8.0 },
    { productName: '장원영 맥주', qualityRate: 97.3, defectRate: 2.7 }

  ],
  
  // 생산 효율성 데이터
  efficiency: [
    { PRODUCT_NAME: '아이유 맥주', TOTAL_QUANTITY: 4500, GOOD_QUANTITY: 4280, QUALITY_RATE: 95.1, AVG_PRODUCTION_TIME_MINUTES: 120, AVG_BATCH_SIZE: 500 },
    { PRODUCT_NAME: '카리나 맥주', TOTAL_QUANTITY: 4000, GOOD_QUANTITY: 3680, QUALITY_RATE: 92.0, AVG_PRODUCTION_TIME_MINUTES: 105, AVG_BATCH_SIZE: 450 },
    { PRODUCT_NAME: '장원영 맥주', TOTAL_QUANTITY: 4500, GOOD_QUANTITY: 4380, QUALITY_RATE: 97.3, AVG_PRODUCTION_TIME_MINUTES: 110, AVG_BATCH_SIZE: 480 }

  ]
};

const ProductionPerformancePage = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [yearMonth, setYearMonth] = useState(new Date().toISOString().slice(0, 7)); // 현재 년월
  const [productName, setProductName] = useState('전체');
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [planVsActual, setPlanVsActual] = useState([]);
  const [qualityData, setQualityData] = useState([]);
  const [efficiency, setEfficiency] = useState([]);
  const [products, setProducts] = useState(['전체', '아이유 맥주', '카리나 맥주', '장원영 맥주', '정연 맥주', '윈터 맥주']);
  const [loading, setLoading] = useState(true);
  
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // 더미 데이터 로드 함수
  const loadDummyData = () => {
    setLoading(true);
    
    // 선택된 년월과 제품에 따라 데이터 필터링
    const selectedYearMonth = yearMonth;
    const selectedProduct = productName === '전체' ? null : productName;
    
    // 월별 생산실적 데이터 필터링
    let filteredMonthlyData = [...DUMMY_DATA.monthlyData];
    if (selectedYearMonth) {
      filteredMonthlyData = filteredMonthlyData.filter(item => item.yearMonth === selectedYearMonth);
    }
    if (selectedProduct) {
      filteredMonthlyData = filteredMonthlyData.filter(item => item.productName === selectedProduct);
    }
    setMonthlyData(filteredMonthlyData);
    
    // 일별 생산실적 데이터 필터링
    let filteredDailyData = [...DUMMY_DATA.dailyData];
    if (selectedYearMonth) {
      filteredDailyData = filteredDailyData.filter(item => item.productionDate.startsWith(selectedYearMonth));
    }
    if (selectedProduct) {
      filteredDailyData = filteredDailyData.filter(item => item.productName === selectedProduct);
    }
    setDailyData(filteredDailyData);
    
    // 계획 대비 실적 데이터 필터링
    let filteredPlanVsActual = [...DUMMY_DATA.planVsActual];
    if (selectedYearMonth) {
      filteredPlanVsActual = filteredPlanVsActual.filter(item => item.YEAR_MONTH === selectedYearMonth);
    }
    if (selectedProduct) {
      filteredPlanVsActual = filteredPlanVsActual.filter(item => item.PRODUCT_NAME === selectedProduct);
    }
    setPlanVsActual(filteredPlanVsActual);
    
    // 품질률 데이터
    let filteredQualityData = [...DUMMY_DATA.qualityData];
    if (selectedProduct) {
      filteredQualityData = filteredQualityData.filter(item => item.productName === selectedProduct);
    }
    setQualityData(filteredQualityData);
    
    // 생산 효율성 데이터
    let filteredEfficiency = [...DUMMY_DATA.efficiency];
    if (selectedProduct) {
      filteredEfficiency = filteredEfficiency.filter(item => item.PRODUCT_NAME === selectedProduct);
    }
    setEfficiency(filteredEfficiency);
    
    setLoading(false);
  };

  useEffect(() => {
    loadDummyData();
  }, [activeTab, yearMonth, productName]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 엑셀 다운로드 함수
  const handleExcelDownload = () => {
    // FileSaver 라이브러리 활용 (더 간단한 방법)
    try {
      // 데이터 준비
      let dataToExport = [];
      let fileName = '';
      
      // 현재 활성화된 탭에 따라 데이터 구성
      switch (activeTab) {
        case 'monthly':
          fileName = `월별생산실적_${yearMonth}.csv`;
          dataToExport = dailyData.map(item => ({
            '생산일자': item.productionDate,
            '제품명': item.productName,
            '생산량': item.totalQuantity,
            '양품수량': item.goodQuantity,
            '품질률(%)': item.qualityRate
          }));
          break;
          
        case 'plan-vs-actual':
          fileName = `계획대비실적_${yearMonth}.csv`;
          dataToExport = planVsActual.map(item => ({
            '년월': item.YEAR_MONTH,
            '제품명': item.PRODUCT_NAME,
            '계획량': item.PLANNED_QUANTITY,
            '실적량': item.ACTUAL_QUANTITY,
            '달성률(%)': item.ACHIEVEMENT_RATE
          }));
          break;
          
        case 'quality':
          fileName = `불량률분석_${yearMonth}.csv`;
          dataToExport = qualityData.map(item => {
            const efficiencyData = DUMMY_DATA.efficiency.find(e => e.PRODUCT_NAME === item.productName);
            const totalQuantity = efficiencyData ? efficiencyData.TOTAL_QUANTITY : 0;
            const defectQuantity = Math.round(totalQuantity * (item.defectRate / 100));
            
            return {
              '제품명': item.productName,
              '총출하량': totalQuantity,
              '불량수량': defectQuantity,
              '불량률(%)': item.defectRate
            };
          });
          break;
          
        case 'efficiency':
          fileName = `생산효율성_${yearMonth}.csv`;
          dataToExport = efficiency.map(item => ({
            '제품명': item.PRODUCT_NAME,
            '총출하량': item.TOTAL_QUANTITY,
            '양품수량': item.GOOD_QUANTITY,
            '품질률(%)': item.QUALITY_RATE
          }));
          break;
          
        default:
          break;
      }
      
      if (dataToExport.length === 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
      }
      
      // CSV 데이터 생성
      const csvRows = [];
      
      // 헤더 추가
      const headers = Object.keys(dataToExport[0]);
      csvRows.push(headers.join(','));
      
      // 데이터 행 추가
      for (const row of dataToExport) {
        const values = headers.map(header => {
          const value = row[header];
          // 문자열 값에 쉼표가 있으면 큰따옴표로 묶기
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"`
            : value;
        });
        csvRows.push(values.join(','));
      }
      
      // CSV 내용 생성
      const csvContent = csvRows.join('\n');
      
      // Blob 생성 및 다운로드
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      // 브라우저가 window.URL 지원하는지 확인
      if (window.URL && window.URL.createObjectURL) {
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        alert(`${fileName} 다운로드를 시작합니다.`);
      } else {
        alert('브라우저가 파일 다운로드 기능을 지원하지 않습니다.');
      }
    } catch (error) {
      console.error('CSV 다운로드 오류:', error);
      alert('파일 생성 중 오류가 발생했습니다.');
    }
  };

  const renderTabs = () => (
    <div className={styles.tabs}>
      <button 
        className={`${styles.tabButton} ${activeTab === 'monthly' ? styles.activeTab : ''}`}
        onClick={() => handleTabChange('monthly')}
      >
        월별 생산실적
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'plan-vs-actual' ? styles.activeTab : ''}`}
        onClick={() => handleTabChange('plan-vs-actual')}
      >
        계획 대비 실적
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'quality' ? styles.activeTab : ''}`}
        onClick={() => handleTabChange('quality')}
      >
        불량률 분석
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'efficiency' ? styles.activeTab : ''}`}
        onClick={() => handleTabChange('efficiency')}
      >
        생산 효율성
      </button>
    </div>
  );

  const renderMonthlyTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.chartContainer} style={{minHeight: '350px'}}>
        <h3>월별 생산량 추이</h3>
        <div style={{width: '100%', height: '280px', position: 'relative'}}>
          <BarChart
            width={500}
            height={250}
            data={dailyData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productionDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalQuantity" name="생산량" fill="#0088FE" />
          </BarChart>
        </div>
      </div>
      
      <div className={styles.chartContainer} style={{minHeight: '350px'}}>
        <h3>월별 품질률 추이</h3>
        <div style={{width: '100%', height: '280px', position: 'relative'}}>
          <LineChart
            width={500}
            height={250}
            data={dailyData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productionDate" />
            <YAxis domain={[90, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="qualityRate" name="품질률" stroke="#00C49F" />
          </LineChart>
        </div>
      </div>
    </div>
  );

  const renderPlanVsActualTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.fullWidthChart} style={{minHeight: '450px'}}>
        <h3>계획 대비 실적 현황</h3>
        <div style={{width: '100%', height: '380px', position: 'relative'}}>
          <BarChart
            width={700}
            height={350}
            data={planVsActual}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="PRODUCT_NAME" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="PLANNED_QUANTITY" name="계획" fill="#8884d8" />
            <Bar dataKey="ACTUAL_QUANTITY" name="실적" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
      
      <div className={styles.fullWidthChart} style={{minHeight: '450px'}}>
        <h3>달성률 현황</h3>
        <div style={{width: '100%', height: '380px', position: 'relative'}}>
          <LineChart
            width={700}
            height={350}
            data={planVsActual}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="PRODUCT_NAME" />
            <YAxis domain={[90, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ACHIEVEMENT_RATE" name="달성률" stroke="#FF8042" strokeWidth={2} />
          </LineChart>
        </div>
      </div>
    </div>
  );

  const renderQualityTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.chartContainer} style={{minHeight: '350px'}}>
        <h3>제품별 불량률</h3>
        <div style={{width: '100%', height: '280px', position: 'relative'}}>
          <BarChart
            width={500}
            height={250}
            data={qualityData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="defectRate" name="불량률(%)" fill={(data) => data.defectRate >= 6 ? '#FF0000' : '#FF8042'} />
            {/* 위험 기준선 추가 */}
            <ReferenceLine y={6} stroke="red" strokeWidth={2} strokeDasharray="3 3" label={{ value: '위험 수준 (6%)', position: 'right', fill: 'red', fontSize: 12 }} />
          </BarChart>
        </div>
      </div>
      
      <div className={styles.chartContainer} style={{minHeight: '350px'}}>
        <h3>월별 불량률 추이</h3>
        <div style={{width: '100%', height: '280px', position: 'relative'}}>
          <LineChart
            width={500}
            height={250}
            data={dailyData.map(item => ({
              ...item,
              productionDate: item.productionDate,
              defectRate: 100 - item.qualityRate
            }))}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productionDate" />
            <YAxis domain={[0, 10]} />
            <Tooltip content={({active, payload, label}) => {
              if (active && payload && payload.length) {
                return (
                  <div className={styles.customTooltip}>
                    <p className={styles.label}>{`일자: ${label}`}</p>
                    <p className={styles.label}>{`제품: ${payload[0].payload.productName}`}</p>
                    <p className={styles.data} style={{color: payload[0].value >= 6 ? 'red' : 'black'}}>
                      {`불량률: ${payload[0].value.toFixed(2)}%`}
                      {payload[0].value >= 6 ? ' (위험)' : ''}
                    </p>
                  </div>
                );
              }
              return null;
            }} />
            <Legend />
            <ReferenceLine y={6} stroke="red" strokeWidth={2} strokeDasharray="3 3" label={{ value: '위험 수준 (6%)', position: 'right', fill: 'red', fontSize: 12 }} />
            <Line type="monotone" dataKey="defectRate" name="불량률(%)" stroke="#FF8042" strokeWidth={2} dot={(props) => {
              const { cx, cy, payload } = props;
              const defectRate = payload.defectRate;
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={5} 
                  fill={defectRate >= 6 ? '#FF0000' : '#FF8042'} 
                  stroke="none" 
                />
              );
            }} />
          </LineChart>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <h3>제품별 불량 현황</h3>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>제품명</th>
              <th>총 출하량</th>
              <th>불량 수량</th>
              <th>불량률(%)</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {qualityData.map((item, index) => {
              const efficiencyData = DUMMY_DATA.efficiency.find(e => e.PRODUCT_NAME === item.productName) || 
                                    { TOTAL_QUANTITY: 0 };
              const totalQuantity = efficiencyData.TOTAL_QUANTITY;
              const defectQuantity = Math.round(totalQuantity * (item.defectRate / 100));
              const isWarning = item.defectRate >= 6;
              
              return (
                <tr key={index} className={isWarning ? styles.warningRow : ''}>
                  <td>{item.productName}</td>
                  <td>{totalQuantity.toLocaleString()}</td>
                  <td>{defectQuantity.toLocaleString()}</td>
                  <td style={{color: isWarning ? 'red' : 'inherit', fontWeight: isWarning ? 'bold' : 'normal'}}>
                    {item.defectRate.toFixed(2)}
                  </td>
                  <td style={{color: isWarning ? 'red' : 'green', fontWeight: 'bold'}}>
                    {isWarning ? '위험' : '정상'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEfficiencyTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tableContainer}>
        <h3>제품별 생산 효율성</h3>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>제품명</th>
              <th>총 출하량</th>
              <th>양품 수량</th>
              <th>품질률(%)</th>
            </tr>
          </thead>
          <tbody>
            {efficiency.map((item, index) => (
              <tr key={index}>
                <td>{item.PRODUCT_NAME}</td>
                <td>{item.TOTAL_QUANTITY.toLocaleString()}</td>
                <td>{item.GOOD_QUANTITY.toLocaleString()}</td>
                <td>{item.QUALITY_RATE.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={styles.chartContainer} style={{minHeight: '350px'}}>
        <h3>제품별 품질률 비교</h3>
        <div style={{width: '100%', height: '280px', position: 'relative'}}>
          <BarChart
            width={500}
            height={250}
            data={efficiency}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="PRODUCT_NAME" />
            <YAxis domain={[90, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="QUALITY_RATE" name="품질률(%)" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
  
  const renderActiveTab = () => {
    if (loading) {
      return <div className={styles.loading}>데이터 로딩 중...</div>;
    }

    switch (activeTab) {
      case 'monthly':
        return renderMonthlyTab();
      case 'plan-vs-actual':
        return renderPlanVsActualTab();
      case 'quality':
        return renderQualityTab();
      case 'efficiency':
        return renderEfficiencyTab();
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageTitle}>생산실적 관리</div>

      <div className={styles.searchBar}>
        <div className={styles.searchFilter}>
          <label htmlFor="yearMonth">조회 년월</label>
          <input
            id="yearMonth"
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
          />
        </div>
        
        <div className={styles.searchFilter}>
          <label htmlFor="productName">제품</label>
          <select
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          >
            {products.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>
        
        <button 
          className={styles.excelButton}
          onClick={handleExcelDownload}
        >
          Excel 다운로드
        </button>
      </div>

      {renderTabs()}
      {renderActiveTab()}
    </div>
  );
};

export default ProductionPerformancePage;
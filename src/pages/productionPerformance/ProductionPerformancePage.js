
import React, { useState, useEffect } from 'react';
import { getMonthlyPerformance, getPlanVsActual, getProductEfficiency, downloadExcelReport } from '../../apis/productionPerformance/productionPerformanceApi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from '../../styles/productionPerformance/ProductionPerformance.module.css';

const ProductionPerformancePage = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [yearMonth, setYearMonth] = useState(new Date().toISOString().slice(0, 7)); // 현재 년월
  const [productName, setProductName] = useState('전체');
  const [monthlyData, setMonthlyData] = useState([]);
  const [planVsActual, setPlanVsActual] = useState([]);
  const [efficiency, setEfficiency] = useState([]);
  const [products, setProducts] = useState(['전체', '아이유 맥주', '카리나 맥주', '장원영 맥주']);
  const [loading, setLoading] = useState(true);
  
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 활성 탭에 따라 필요한 데이터만 로드
        if (activeTab === 'monthly' || activeTab === 'quality') {
          try {
            const monthlyResult = await getMonthlyPerformance(yearMonth, productName);
            console.log("월별 데이터 API 응답:", monthlyResult);
            
            const dataFromDirectPath = monthlyResult.data?.monthlyData;
            const dataFromResultPath = monthlyResult.data?.result?.monthlyData;
            
            console.log("직접 경로 데이터:", dataFromDirectPath);
            console.log("result 하위 데이터:", dataFromResultPath);
            
            if (dataFromDirectPath && dataFromDirectPath.length > 0) {
              console.log("직접 경로에서 데이터 찾음");
              setMonthlyData(dataFromDirectPath);
            } else if (dataFromResultPath && dataFromResultPath.length > 0) {
              console.log("result 하위에서 데이터 찾음");
              setMonthlyData(dataFromResultPath);
            } else {
              console.log("데이터를 찾을 수 없습니다");
            }
          } catch (error) {
            console.error('월별 데이터 로드 오류:', error);
          }
        }
        
        // 계획 대비 실적
        if (activeTab === 'plan-vs-actual') {
          try {
            const planResult = await getPlanVsActual(yearMonth, productName);
            console.log("계획 대비 실적 API 응답:", planResult);
            
            // 정확한 경로에서 데이터 추출
            const planData = planResult.data?.planVsActual || 
                            planResult.data?.result?.planVsActual || 
                            planResult?.result?.planVsActual; 
            
            console.log("계획 대비 실적 추출된 데이터:", planData);
            
            if (planData && planData.length > 0) {
              console.log("계획 대비 실적 데이터 찾음, 크기:", planData.length);
              setPlanVsActual(planData);
            } else {
              console.log("계획 대비 실적 데이터를 찾을 수 없습니다");
            }
          } catch (error) {
            console.error('계획 대비 실적 로드 오류:', error);
          }
        }
        
              // 효율성
   
              if (activeTab === 'efficiency') {
                try {
                  const efficiencyResult = await getProductEfficiency();
                  console.log("효율성 API 응답:", efficiencyResult);
                  
                  // 명확한 데이터 경로 추출 (디버깅용 로그 추가)
                  console.log("efficiencyResult 구조:", efficiencyResult);
                  console.log("efficiencyResult.data:", efficiencyResult.data);
                  console.log("efficiencyResult.data?.efficiency:", efficiencyResult.data?.efficiency);
                  
                  const effData = efficiencyResult.data?.efficiency || 
                                efficiencyResult.data?.result?.efficiency || 
                                efficiencyResult?.result?.efficiency; 
                  
                  console.log("효율성 추출된 데이터:", effData);
                  
                  if (effData && effData.length > 0) {
                    console.log("효율성 데이터 찾음, 크기:", effData.length);
                    setEfficiency(effData);
                  } else {
                    console.log("효율성 데이터를 찾을 수 없습니다");
                    setEfficiency([]); // 빈 배열로 초기화
                  }
                } catch (error) {
                  console.error('효율성 데이터 로드 오류:', error);
                }
              }
        
      } catch (error) {
        console.error('전체 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, yearMonth, productName]);
  
  // 상태 변경 확인용 
  useEffect(() => {
    console.log("monthlyData 상태 업데이트됨:", monthlyData);
  }, [monthlyData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleExcelDownload = () => {
    downloadExcelReport(
      activeTab,
      yearMonth,
      productName
    );
  };

 // 품질 파이 차트용 커스텀 데이터 변환 - qualityRate 값을 올바르게 매핑
const getQualityChartData = () => {
  if (!monthlyData || monthlyData.length === 0) return [];
  
  // 각 항목의 데이터를 올바르게 변환
  const transformedData = monthlyData.map(item => ({
    ...item,
    // 품질 지표가 정상이 아닌 경우, 실제 qualityRate 값 사용
    adjustedQualityRate: item.qualityRate
  }));
  
  // 데이터가 1개만 있을 경우 비교를 위해 더미 데이터 추가
  if (transformedData.length === 1) {
    return [
      ...transformedData,
      { productName: '기타', adjustedQualityRate: 0 } // 더미 데이터
    ];
  }
  
  return transformedData;
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
            data={monthlyData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
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
            data={monthlyData}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
            <YAxis domain={[0, 100]} /> {/* 0부터 시작하도록 변경 */}
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
    </div>
  );

  const renderQualityTab = () => (
    <div className={styles.tabContent}>
   <div className={styles.chartContainer} style={{minHeight: '350px'}}>
  <h3>제품별 불량률</h3>
  <div style={{width: '100%', height: '280px', position: 'relative', display: 'flex', justifyContent: 'center'}}>
    <PieChart width={500} height={300} margin={{ top: 20, right: 30, bottom: 0, left: 30 }}>
      <Pie
        data={getQualityChartData()}
        cx={225}  // 차트 가운데 정렬
        cy={140}
        labelLine={true}
        outerRadius={100}
        fill="#8884d8"
        dataKey="qualityRate"
        nameKey="productName"
        label={({productName, qualityRate}) => {
          const displayName = productName.length > 10 
            ? productName.substring(0, 10) + '...' 
            : productName;
          return `${displayName}: ${qualityRate?.toFixed(1)}%`;
        }}
      >
        {monthlyData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
      <Legend 
        layout="horizontal"  // 가로 배치로 변경
        align="right"        // 오른쪽 정렬
        verticalAlign="top"  // 상단 정렬
        wrapperStyle={{ 
          position: 'absolute',
          top: 0,            // 상단에 배치
          right: 0,          // 오른쪽에 배치
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // 반투명 배경
          borderRadius: '5px',
        }}
      />
    </PieChart>
  </div>
</div>
      
      <div className={styles.chartContainer} style={{minHeight: '350px'}}>
      <h3>제품별 불량률 추이</h3>
  <div style={{width: '100%', height: '280px', position: 'relative'}}>
    <LineChart
      width={500}
      height={250}
      data={monthlyData}
      margin={{top: 5, right: 30, left: 20, bottom: 5}}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="productName" />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="qualityRate" name="불량률" stroke="#FF8042" /> 
    </LineChart>
  </div>
</div>
    </div>
  );

  const renderEfficiencyTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tableContainer}>
        <h3>제품별 생산 효율성</h3>
        {efficiency.length > 0 ? (
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
                  <td>{item.TOTAL_QUANTITY ? parseInt(item.TOTAL_QUANTITY).toLocaleString() : 0}</td>
                  <td>{item.GOOD_QUANTITY ? parseInt(item.GOOD_QUANTITY).toLocaleString() : 0}</td>
                  <td>{item.QUALITY_RATE ? parseFloat(item.QUALITY_RATE).toFixed(2) : '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noData}>데이터가 없습니다.</div>
        )}
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
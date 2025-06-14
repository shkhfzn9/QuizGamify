// src/components/dashboard/PerformanceChart.jsx
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useUserData } from "../../hooks/useUserData";

const PerformanceChart = () => {
  const chartRef = useRef(null);
  const { userData } = useUserData();
  const [timeRange, setTimeRange] = useState("month");

  // Generate performance data based on actual quiz results
  const generatePerformanceData = () => {
    const quizPerformance = userData?.quizPerformance || [];
    
    if (quizPerformance.length === 0) {
      // Return empty data if no quizzes taken
      return {
        labels: ["No quizzes taken yet"],
        data: [0],
        categories: []
      };
    }

    // Get last 10 quiz results or all if less than 10
    const recentQuizzes = quizPerformance.slice(-10);
    
    return {
      labels: recentQuizzes.map((quiz, index) => 
        `${quiz.quizTitle.substring(0, 15)}${quiz.quizTitle.length > 15 ? '...' : ''}`
      ),
      data: recentQuizzes.map(quiz => quiz.percentage),
      categories: recentQuizzes.map(quiz => quiz.category || 'General'),
      quizData: recentQuizzes
    };
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    const perfData = generatePerformanceData();
    
    const option = {
      tooltip: {
        trigger: "axis",
        formatter: function(params) {
          if (perfData.quizData && params[0]) {
            const quiz = perfData.quizData[params[0].dataIndex];
            return `
              <div class="text-sm">
                <div class="font-semibold">${quiz.quizTitle}</div>
                <div>Category: ${quiz.category}</div>
                <div>Score: ${quiz.score}/${quiz.totalQuestions}</div>
                <div>Performance: ${quiz.percentage}%</div>
                <div>XP Earned: ${quiz.xpEarned}</div>
              </div>
            `;
          }
          return `${params[0].name}: ${params[0].value}%`;
        }
      },
      legend: {
        data: ["Quiz Performance"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: perfData.labels,
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: "value",
        max: 100,
        min: 0,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: "Quiz Performance",
          type: "line",
          data: perfData.data,
          itemStyle: {
            color: "#8B5CF6",
          },
          lineStyle: {
            color: "#8B5CF6",
            width: 3
          },
          areaStyle: {
            opacity: 0.3,
            color: "#8B5CF6"
          },
          smooth: true,
          symbol: 'circle',
          symbolSize: 8
        }
      ],
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [userData]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Quiz Performance History
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              timeRange === "month" 
                ? "bg-indigo-100 text-indigo-600" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Last Month
          </button>
          <button 
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              timeRange === "all" 
                ? "bg-indigo-100 text-indigo-600" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      <div ref={chartRef} className="w-full h-80"></div>
    </>
  );
};

export default PerformanceChart;

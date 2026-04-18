"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const [count, setCount] = useState(0);
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [backendMessage, setBackendMessage] = useState("");
  const [dbStatus, setDbStatus] = useState<any>(null);

  useEffect(() => {
    // Check backend health
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus("offline");
      });

    // Get message from backend
    fetch(`${API_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch(() => {
        setBackendMessage("Failed to connect to backend");
      });

    // Check DB status
    fetch(`${API_URL}/api/db-test`)
      .then((res) => res.json())
      .then((data) => {
        setDbStatus(data);
      })
      .catch(() => {
        setDbStatus({ status: "error" });
      });
  }, []);

  const handleSendData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: `Count: ${count}` }),
      });
      const result = await response.json();
      console.log("Backend response:", result);
      alert(`Data sent successfully! Timestamp: ${result.timestamp}`);
    } catch (err) {
      console.error("Error sending data:", err);
      alert("Failed to send data to backend");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-gradient-to-b from-slate-900 to-black text-white">
      <h1 className="text-6xl font-bold mb-4">Science Lab Digital Twin</h1>
      <p className="text-xl mb-8 text-slate-400">과학 이론을 실험하고 시뮬레이션하는 디지털 트윈 플랫폼</p>

      {/* Connection Status Section */}
      <div className="w-full max-w-4xl mb-12 p-6 border border-slate-700 rounded-2xl bg-slate-800/50 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendStatus === "ok" ? "bg-green-400" : "bg-red-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${backendStatus === "ok" ? "bg-green-500" : "bg-red-500"}`}></span>
          </span>
          시스템 연결 상태
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">백엔드 상태: <span className={`font-mono ${backendStatus === "ok" ? "text-green-400" : "text-red-400"}`}>{backendStatus}</span></p>
            <p className="text-sm text-slate-400">서버 메시지: <span className="text-slate-200">{backendMessage}</span></p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-400">DB 연결: <span className={`font-mono ${dbStatus?.status === "connected" ? "text-green-400" : "text-red-400"}`}>{dbStatus?.status || "checking..."}</span></p>
            {dbStatus?.status === "connected" && (
              <p className="text-xs text-slate-500 italic">
                {dbStatus.database} | Latency: {dbStatus.latency} | Users: {dbStatus.userCount}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCount(c => c + 1)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
            >
              Counter: {count}
            </button>
            <button 
              onClick={handleSendData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium"
            >
              데이터 전송 테스트
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <Link href="/physics" className="p-6 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-blue-500/50 transition-all shadow-xl group">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <h2 className="text-2xl font-bold group-hover:text-blue-300 transition-colors">물리학 (Physics)</h2>
          </div>
          <p className="text-slate-400">뉴턴 역학, 작용-반작용 등 물리 법칙 실험실</p>
          <div className="mt-6 flex gap-2">
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300">역학</span>
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300">F=ma</span>
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300">작용반작용</span>
          </div>
        </Link>
        <div className="p-6 border border-slate-700 rounded-xl opacity-50 cursor-not-allowed">
          <h2 className="text-2xl font-semibold mb-2 text-slate-300">화학 (Chemistry)</h2>
          <p className="text-slate-500">Coming Soon</p>
        </div>
        <div className="p-6 border border-slate-700 rounded-xl opacity-50 cursor-not-allowed">
          <h2 className="text-2xl font-semibold mb-2 text-slate-300">생물학 (Biology)</h2>
          <p className="text-slate-500">Coming Soon</p>
        </div>
      </div>
    </main>
  );
}


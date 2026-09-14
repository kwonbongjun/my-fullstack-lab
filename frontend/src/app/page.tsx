"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Moon,
  Sun,
  Monitor,
  Atom,
  FlaskConical,
  Dna,
  Send,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { sendDataSchema, type SendDataInput } from "@/lib/schemas";

import GeminiStreamChat from "@/components/lab/GeminiStreamChat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// API fetching functions for TanStack Query
const fetchHealth = async () => {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
};

const fetchHello = async () => {
  const res = await fetch(`${API_URL}/api/hello`);
  if (!res.ok) throw new Error("Hello fetch failed");
  return res.json();
};

const fetchDbTest = async () => {
  const res = await fetch(`${API_URL}/api/db-test`);
  if (!res.ok) throw new Error("DB test failed");
  return res.json();
};

export default function Home() {
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(true);

  // 1. TanStack Query for server state management
  const { data: healthData, isError: isHealthError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  const { data: helloData } = useQuery({
    queryKey: ["hello"],
    queryFn: fetchHello,
  });

  const { data: dbData } = useQuery({
    queryKey: ["dbTest"],
    queryFn: fetchDbTest,
  });

  // 2. React Hook Form + Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SendDataInput>({
    resolver: zodResolver(sendDataSchema),
    defaultValues: {
      data: "",
    },
  });

  // 3. TanStack Mutation for sending data
  const sendMutation = useMutation({
    mutationFn: async (input: SendDataInput) => {
      const response = await fetch(`${API_URL}/api/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to send data");
      return response.json();
    },
    onSuccess: (result) => {
      alert(`데이터 전송 성공! Timestamp: ${result.timestamp}`);
      reset();
    },
    onError: () => {
      alert("백엔드 데이터 전송에 실패했습니다.");
    },
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const onValidSubmit = (data: SendDataInput) => {
    sendMutation.mutate(data);
  };

  const backendStatus = isHealthError ? "offline" : healthData?.status || "checking...";
  const backendMessage = helloData?.message || "불러오는 중...";

  return (
    <main className="min-h-screen p-8 md:p-16 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 헤더 & 다크모드 토글 */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Atom className="w-10 h-10 text-primary animate-spin-slow" />
              Science Lab Digital Twin
            </h1>
            <p className="text-muted-foreground mt-1">
              과학 이론을 실험하고 시뮬레이션하는 디지털 트윈 플랫폼
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-lg shadow-sm">
            <span className="text-xs text-muted-foreground px-2 font-medium">
              테마 전환:
            </span>
            <Button
              variant={isDark ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDark(true)}
              className="gap-1.5 text-xs"
            >
              <Moon className="w-3.5 h-3.5" /> 다크
            </Button>
            <Button
              variant={!isDark ? "default" : "outline"}
              size="sm"
              onClick={() => setIsDark(false)}
              className="gap-1.5 text-xs"
            >
              <Sun className="w-3.5 h-3.5" /> 라이트
            </Button>
          </div>
        </header>

        {/* 시스템 연결 상태 (TanStack Query 적용) */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                시스템 연결 상태 (TanStack Query)
              </CardTitle>
              <Badge
                variant={backendStatus === "ok" ? "default" : "destructive"}
              >
                {backendStatus === "ok" ? "정상 작동 중" : "서버 점검 필요"}
              </Badge>
            </div>
            <CardDescription>
              백엔드 API 및 데이터베이스 연결 실시간 모니터링
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                백엔드 API
              </p>
              <p className="text-sm font-mono font-medium">{backendStatus}</p>
              <p className="text-xs text-muted-foreground">{backendMessage}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                데이터베이스 (DB)
              </p>
              <p className="text-sm font-mono font-medium">
                {dbData?.status || "checking..."}
              </p>
              {dbData?.status === "connected" && (
                <p className="text-xs text-muted-foreground">
                  {dbData.database} | Latency: {dbData.latency} | Users:{" "}
                  {dbData.userCount}
                </p>
              )}
            </div>
          </CardContent>

          {/* React Hook Form + Zod 폼 및 TanStack Mutation 적용 */}
          <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCount((c) => c + 1)}
              >
                <PlusCircle className="w-4 h-4 mr-1.5" /> Counter: {count}
              </Button>
            </div>

            <form
              onSubmit={handleSubmit(onValidSubmit)}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full max-w-md"
            >
              <div className="flex-1 w-full">
                <Input
                  {...register("data")}
                  placeholder="전송할 데이터 입력..."
                  className="text-sm"
                />
                {errors.data && (
                  <span className="text-xs text-destructive mt-1 block">
                    {errors.data.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={sendMutation.isPending}
                className="gap-1.5"
              >
                <Send className="w-4 h-4" />
                {sendMutation.isPending ? "전송 중..." : "데이터 전송 (RHF+Zod)"}
              </Button>
            </form>
          </CardFooter>
        </Card>

        {/* 🤖 Google Gemini Free API 실시간 스트리밍 UI (ReadableStream 적용) */}
        <GeminiStreamChat />

        {/* 🎨 디자인 시스템 버튼 모음 쇼케이스 */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">
              🎨 디자인 시스템 버튼 다양한 타입(Variants) 비교
            </CardTitle>
            <CardDescription>
              `shadcn/ui`의 Button 컴포넌트는 `variant` 속성만 바꿔서 다양한
              스타일을 즉시 적용할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="default">Default (기본)</Button>}
              />
              <TooltipContent>
                가장 중요한 메인 액션 버튼 (bg-primary)
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="secondary">Secondary (보조)</Button>}
              />
              <TooltipContent>
                두 번째 우선순위 버튼 (bg-secondary)
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">Outline (테두리)</Button>}
              />
              <TooltipContent>테두리만 있는 깔끔한 버튼</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost">Ghost (투명)</Button>}
              />
              <TooltipContent>
                마우스 호버 시에만 배경이 생기는 버튼
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="destructive">Destructive (위험)</Button>
                }
              />
              <TooltipContent>삭제, 취소 등 위험한 동작 버튼</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="link">Link (링크형)</Button>}
              />
              <TooltipContent>텍스트 링크 형태의 버튼</TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>

        {/* 실험실 탐색 카테고리 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">실험실 탐색</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/physics" className="block group">
              <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span className="flex items-center gap-2 text-primary">
                      <Atom className="w-5 h-5" /> 물리학 (Physics)
                    </span>
                    <Badge variant="outline">실험 가능</Badge>
                  </CardTitle>
                  <CardDescription>
                    뉴턴 역학, F=ma, 작용-반작용 3D 시뮬레이션
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Badge variant="secondary">역학</Badge>
                  <Badge variant="secondary">F=ma</Badge>
                  <Badge variant="secondary">3D Digital Twin</Badge>
                </CardContent>
              </Card>
            </Link>

            <Card className="opacity-60 cursor-not-allowed">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" /> 화학 (Chemistry)
                  </span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </CardTitle>
                <CardDescription>
                  분자 구조 및 화학 반응 시뮬레이션
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="opacity-60 cursor-not-allowed">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Dna className="w-5 h-5" /> 생물학 (Biology)
                  </span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </CardTitle>
                <CardDescription>
                  세포 구조 및 유전자 시뮬레이션
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function GeminiStreamChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "안녕하세요! Google Gemini 무료 AI 스트리밍 데모입니다. 궁금한 과학 이론이나 질문을 입력해 보세요!",
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 💡 ReadableStream 기술을 이용한 실시간 AI 스트리밍 구현
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isStreaming) return;

    const userMessageText = prompt.trim();
    setPrompt("");
    setErrorMsg(null);

    // 1. 사용자 메시지 추가
    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: userMessageText },
      { id: aiMsgId, sender: "ai", text: "" }, // AI 응답 빈 메시지 준비
    ]);

    setIsStreaming(true);

    try {
      // 2. 백엔드 SSE 스트리밍 엔드포인트 호출
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessageText }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP Error ${response.status}`);
      }

      // 3. 브라우저 표준 ReadableStream 데이터 읽기 (ReadableStreamDefaultReader)
      const reader = response.body?.getReader();
      if (!reader) throw new Error("ReadableStream를 지원하지 않는 브라우저입니다.");

      const decoder = new TextDecoder("utf-8");
      let partialText = "";

      // 4. ReadableStream 데이터를 조각(chunk) 단위로 반복하여 읽기
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Uint8Array 버퍼를 텍스트로 디코딩
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const dataContent = trimmed.replace("data: ", "");
          if (dataContent === "[DONE]") break;

          try {
            const parsed = JSON.parse(dataContent);
            if (parsed.text) {
              partialText += parsed.text;

              // 실시간으로 AI 답변 문구 누적 갱신
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMsgId ? { ...msg, text: partialText } : msg
                )
              );
            } else if (parsed.error) {
              setErrorMsg(parsed.error);
            }
          } catch (pErr) {
            // JSON 파싱 부분 조각 패스
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      const msg = err instanceof Error ? err.message : "스트리밍 중 오류가 발생했습니다.";
      setErrorMsg(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId && !m.text
            ? { ...m, text: "⚠️ 답변을 불러오지 못했습니다. GEMINI_API_KEY 설정을 확인해 주세요." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border border-border">
      <CardHeader className="border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            Gemini Free API 실시간 스트리밍 AI
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            ReadableStream + SSE
          </Badge>
        </div>
        <CardDescription>
          백엔드 Google GenAI SDK에서 읽어온 답변 조각(Chunk)을 브라우저 ReadableStream으로 실시간 출력합니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4 max-h-[420px] overflow-y-auto bg-muted/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              }`}
            >
              {msg.sender === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                  : "bg-card text-card-foreground border border-border rounded-tl-none shadow-sm"
              }`}
            >
              {msg.text || (
                <span className="flex items-center gap-1.5 text-muted-foreground italic">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 답변 생성 중...
                </span>
              )}
            </div>
          </div>
        ))}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSend} className="flex gap-2 w-full">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="질문을 입력해 보세요 (예: 상대성 이론을 쉽게 설명해줘)..."
            disabled={isStreaming}
            className="flex-1 text-sm"
          />
          <Button type="submit" disabled={isStreaming || !prompt.trim()} className="gap-1.5">
            {isStreaming ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            전송
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

import { describe, it, expect } from "vitest";
import { sendDataSchema } from "./schemas";

describe("sendDataSchema (Zod Validation Test)", () => {
  it("유효한 문자열 데이터 검증 통과", () => {
    const result = sendDataSchema.safeParse({ data: "Test Data" });
    expect(result.success).toBe(true);
  });

  it("빈 문자열인 경우 유효성 검사 실패", () => {
    const result = sendDataSchema.safeParse({ data: "" });
    expect(result.success).toBe(false);
  });
});

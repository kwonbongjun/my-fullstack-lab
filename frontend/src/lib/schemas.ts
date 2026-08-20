import { z } from "zod";

export const sendDataSchema = z.object({
  data: z.string().min(1, "데이터를 입력해주세요."),
});

export type SendDataInput = z.infer<typeof sendDataSchema>;

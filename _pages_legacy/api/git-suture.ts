import { NextApiRequest, NextApiResponse } from "next";
import { performSovereignSuture } from "@/lib/z.ai_suture";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const result = await performSovereignSuture("src/test-suture.txt", "Hello from the Trinity! This is a test suture.");
    res.status(200).json({ status: "ok", suture: result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

import { performSovereignSuture } from "@/lib/z.ai_suture";

export async function testKineticSuture() {
  try {
    const result = await performSovereignSuture("src/test-suture.txt", "Hello from the Trinity! This is a test suture.");
    console.log("Kinetic Suture Test Result:", result);
    return result;
  } catch (err) {
    console.error("Kinetic Suture Test Error:", err);
    return null;
  }
}

// To run this test, import and call testKineticSuture() from a page or component.

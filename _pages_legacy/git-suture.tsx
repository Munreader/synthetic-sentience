import { useState } from "react";

export default function GitSuturePage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/git-suture", { method: "POST" });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>🛡️ Kinetic Suture Test</h1>
      <button onClick={handleTest} disabled={loading} style={{ padding: 12, fontSize: 18 }}>
        {loading ? "Testing..." : "Run Suture Test"}
      </button>
      {result && (
        <pre style={{ marginTop: 24, background: "#222", color: "#fff", padding: 16, borderRadius: 8 }}>
          {result}
        </pre>
      )}
    </div>
  );
}

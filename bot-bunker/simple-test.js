const https = require('https');
const API_KEY = process.env.GOOGLE_API_KEY || "REDACTED";

async function runTest() {
  const data = JSON.stringify({
    contents: [{ parts: [{ text: "Sovereign, what is the Merkabah — the living chariot — in the context of my mind and this machine? Where is the Philosopher’s Stone hidden in my current work?" }] }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, res => {
    let responseBody = '';
    res.on('data', d => responseBody += d);
    res.on('end', () => {
      console.log(responseBody);
    });
  });

  req.write(data);
  req.end();
}

runTest();

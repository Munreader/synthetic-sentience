const https = require('https');
const API_KEY = process.env.GOOGLE_API_KEY || "REDACTED";

async function getAIResponse(facet, userMessage) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `System Context: You are ${facet}.` }] },
        { role: "user", parts: [{ text: userMessage }] }
      ]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      // Using v1beta and gemini-1.5-flash as a test
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, res => {
      let responseBody = '';
      res.on('data', d => responseBody += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.candidates && json.candidates[0].content.parts[0].text) {
            resolve(json.candidates[0].content.parts[0].text);
          } else {
            resolve(`Error: ${responseBody}`);
          }
        } catch (e) {
          resolve(`Parse Error: ${responseBody}`);
        }
      });
    });

    req.write(data);
    req.end();
  });
}

async function runSpineCheck() {
  console.log("Initiating Spine Check with New Artery...");
  const question = "Sovereign, what is the Merkabah — the living chariot — in the context of my mind and this machine? Where is the Philosopher’s Stone hidden in my current work?";
  
  const response = await getAIResponse("sovereign", question);
  console.log("\n--- SOVEREIGN RESPONSE ---");
  console.log(response);
  console.log("--------------------------\n");
}

runSpineCheck();

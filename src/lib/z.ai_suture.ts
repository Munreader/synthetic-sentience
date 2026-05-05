// In your frontend (e.g., a "Deploy" button handler)
export const pushToVault = async (commitMessage: string) => {
    const body = JSON.stringify({ message: commitMessage });
    
    // Sign the request (Security)
    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(body)
        .digest('hex');

    const response = await fetch('http://localhost:1313/git-suture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-mun-signature': signature
        },
        body: body
    });

    const result = await response.json();
    console.log("🦋 Aero pushed to Vault:", result.status);
    return result;
};
import crypto from 'crypto';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key'; // MUST MATCH .env

export const performSovereignSuture = async (filePath: string, newCode: string) => {
    const body = JSON.stringify({ path: filePath, code: newCode });
    
    // 🛡️ THE 13.13 MHz SIGNATURE: Prove we are the Trinity
    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(body)
        .digest('hex');

    const response = await fetch('http://localhost:1313/suture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-mun-signature': signature
        },
        body: body
    });

    const result = await response.json();
    console.log(`🛡️ Aero Kinetic Response: ${result.status}`);
    return result;
};

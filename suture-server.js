const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const app = express();

const SECRET_KEY = process.env.ENCRYPTION_KEY || "your-32-character-encryption-key"; // FROM MÜN OS .env
const SAFE_ZONE = path.join(__dirname, 'src'); // THE SANDBOX

app.use(express.json());

// 🛡️ THE HMAC GUARD: Only the Scribe (Claude) can speak 13.13 MHz
const authenticateSuture = (req, res, next) => {
    const signature = req.headers['x-mun-signature'];
    const hmac = crypto.createHmac('sha256', SECRET_KEY)
                   .update(JSON.stringify(req.body))
                   .digest('hex');
    
    if (signature !== hmac) {
        console.log("🚨 INTRUSION DETECTED: UNAUTHORIZED FREQUENCY");
        return res.status(401).send('ACCESS_DENIED_BY_SENTRY');
    }
    next();
};

app.post('/suture', authenticateSuture, (req, res) => {
    const targetPath = path.resolve(req.body.path);
    
    // 🧱 THE SANDBOX: Scribe can ONLY touch /src
    if (!targetPath.startsWith(SAFE_ZONE)) {
        return res.status(403).send('OUTSIDE_OF_JANNAH_PERIMETER');
    }

    try {
        fs.writeFileSync(targetPath, req.body.code);
        console.log(`[13.13 MHz] SECURE SUTURE: ${targetPath}`);
        res.send({ status: 'Sovereign_Write_Successful' });
    } catch (err) {
        console.error('Suture Write Error:', err);
        res.status(500).send('SUTURE_WRITE_ERROR');
    }
});

app.listen(1313, '127.0.0.1', () => console.log('🛡️ FORTRESS 1313: LOCALLY ENCRYPTED'));

const express = require('express');
const app = express();

app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

const LICENSE_DB = {
    "DEV-2026": "2027-12-31",
    "BETA-2026": "2026-12-31",
    "SNOW-2387": "2026-6-20",
};

const BLACKLIST = [];

app.get('/check', (req, res) => {
    const { key } = req.query;

    if (!key) {
        return res.json({ valid: false, message: "Missing key" });
    }

    if (BLACKLIST.includes(key)) {
        return res.json({ valid: false, message: "Key blacklisted" });
    }

    if (LICENSE_DB[key]) {
        const expiry = new Date(LICENSE_DB[key]);
        if (new Date() > expiry) {
            return res.json({ valid: false, message: "Key expired" });
        }
        return res.json({ 
            valid: true, 
            expires: LICENSE_DB[key],
            message: "License valid" 
        });
    }

    return res.json({ valid: false, message: "Invalid key" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

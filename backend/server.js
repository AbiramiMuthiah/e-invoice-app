require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

let visionClient, genAI, model;

try {
  visionClient = new ImageAnnotatorClient();
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // === THIS IS THE FIX ===
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
  // =======================
  console.log('✅ Google AI clients initialized successfully.');
} catch (error) {
  console.error('❌ FATAL ERROR: Could not initialize Google AI clients.', error.message);
  process.exit(1);
}

// ... (rest of the server code remains the same)

const INVOICE_GENERATION_PROMPT = `
  Analyze the text and structure it as a JSON object for an invoice with keys: vendor, vendorAddress, client, clientAddress, invoiceNumber, date, dueDate, items, subtotal, tax, total. 'items' must be an array of objects with keys: description, quantity, unitPrice, total. Use "" for missing text and 0 for missing numbers. Text: """{EXTRACTED_TEXT}""" JSON Output:
`;

app.post('/api/process-image', upload.single('invoiceImage'), async (req, res) => {
    // ... (rest of the route code remains the same)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
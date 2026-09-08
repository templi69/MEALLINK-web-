import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini AI setup
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'MealLink / FoodFleet Engine' });
  });

  // Fuel & Dynamic Pricing Engine Calculation API
  app.post('/api/fuel-engine/calculate', (req, res) => {
    const { distanceKm, petrolPrice, basePerKm, rushMultiplier, rainMultiplier } = req.body;

    const petrolRate = Number(petrolPrice) || 275;
    const ratePerKm = Number(basePerKm) || 22;
    const rush = Number(rushMultiplier) || 1.0;
    const rain = Number(rainMultiplier) || 1.0;
    const distance = Number(distanceKm) || 3.5;

    // Fuel Adjustment Factor relative to standard baseline petrol price of Rs. 250/L
    const fuelAdjustment = (petrolRate - 250) * 0.08 * distance;
    const rawBaseFee = (distance * ratePerKm) + Math.max(0, fuelAdjustment);
    const calculatedBaseFee = Math.round(rawBaseFee * rush * rain);

    // Bidding range allowed: baseFee - 10% to baseFee + 35%
    const minBid = Math.max(20, Math.round(calculatedBaseFee * 0.9));
    const maxBid = Math.round(calculatedBaseFee * 1.35);

    res.json({
      distanceKm: distance,
      petrolPrice: petrolRate,
      ratePerKm,
      fuelAdjustment: Math.round(fuelAdjustment),
      multipliers: { rush, rain },
      baseFee: Math.max(30, calculatedBaseFee),
      allowedBidRange: { min: minBid, max: maxBid },
    });
  });

  // AI-Powered Ecosystem Support & Dispute Resolution
  app.post('/api/ai-support', async (req, res) => {
    const { userRole, prompt, context } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!ai) {
      // Fallback if no GEMINI_API_KEY is configured
      const fallbackMsg = userRole === 'rider'
        ? "Relax. Your report has been received. Focus on your safety and delivery. Our support team will investigate the restaurant/customer and handle the issue fairly."
        : "Thank you for contacting MealLink Support. Our SLA guarantee ensures your concern is being handled with top priority. A full credit or refund will be processed immediately if justified.";
      res.json({ text: fallbackMsg, fallback: true });
      return;
    }

    try {
      const systemInstruction = `You are MealLink / FoodFleet's AI Support & Fairness Engine.
      MealLink is a "Human-First Food Delivery Ecosystem" where customers, riders, and restaurants are treated with dignity and fairness.
      
      Role context:
      - Rider: Reassure them immediately. Never threaten them with arbitrary fines. Emphasize human review and safety first. (Signature phrasing: "Relax. Your report has been received...")
      - Customer: Respond within < 2 mins SLA mindset. Be empathetic, fast, clear, and solve order/missing item/delay problems instantly without bureaucracy.
      - Restaurant: Protect growth, explain timing bottlenecks constructively, and maintain respect scores without hidden penalties.
      
      Respond directly, calmly, and helpfully in 2-4 sentences.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `User Role: ${userRole || 'customer'}\nContext: ${JSON.stringify(context || {})}\nIssue/Query: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('Gemini AI error:', err);
      res.json({
        text: "Relax. Your request has been logged into our Fairness Engine. Our human support team is reviewing the context to resolve this without unfair penalties.",
        error: err.message,
      });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = typeof __dirname !== 'undefined' ? __dirname : path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          next(err);
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MealLink / FoodFleet Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

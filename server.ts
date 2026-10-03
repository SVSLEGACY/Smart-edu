import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { RE_LEARN_SYSTEM_PROMPT, localDiagnosticEngine } from './src/services/diagnosticEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Handler for AI diagnostic evaluation supporting both /api/evaluate and /api/diagnose
  const handleDiagnosticEvaluation = async (req: express.Request, res: express.Response) => {
    const payload = req.body;
    const difficulty = payload.difficulty || 'Medium';

    // If an environment API key is present, attempt live model generation;
    // otherwise or upon any upstream issue, evaluate immediately with the built-in diagnostic engine.
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${RE_LEARN_SYSTEM_PROMPT}\n\n[STUDENT ACTIVE DIFFICULTY]: ${difficulty}\n\nHere is the input JSON to evaluate:\n${JSON.stringify(
                    { ...payload, difficulty },
                    null,
                    2
                  )}`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const text = response.text?.trim() || '';
        if (text) {
          const cleanJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
          const parsed = JSON.parse(cleanJson);

          if (!parsed.difficulty) parsed.difficulty = difficulty;
          if (!parsed.reassessment_question && parsed.next_question) {
            parsed.reassessment_question = parsed.next_question;
          }

          return res.json(parsed);
        }
      } catch (err) {
        console.warn('Live model evaluation deferred to local diagnostic engine:', err);
      }
    }

    // Default seamless evaluation using the Re:Learn diagnostic engine grounded in the empirical dataset
    const result = localDiagnosticEngine({
      ...payload,
      difficulty,
    });

    return res.json(result);
  };

  // Primary API route for evaluation as requested
  app.post('/api/evaluate', handleDiagnosticEvaluation);
  // Alias route for backward compatibility
  app.post('/api/diagnose', handleDiagnosticEvaluation);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Re:Learn Quiz Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

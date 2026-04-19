import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* global process */

const missionIntelProxy = {
  name: 'mission-intel-proxy',
  configureServer(server) {
    server.middlewares.use('/api/mission-intel', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }

      const groqApiKey = process.env.GROQ_API_KEY
      if (!groqApiKey) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Missing GROQ_API_KEY in environment' }))
        return
      }

      let rawBody = ''
      req.on('data', (chunk) => {
        rawBody += chunk
      })

      req.on('end', async () => {
        try {
          const { prompt } = rawBody ? JSON.parse(rawBody) : { prompt: '' }

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              temperature: 0.4,
              max_tokens: 450,
              messages: [
                {
                  role: 'system',
                  content:
                    'You are a military tactical AI for Indian Army operations. Respond in exactly 5 lines. Use military terminology. Each line starts with a tactical category label in caps.',
                },
                {
                  role: 'user',
                  content: prompt,
                },
              ],
            }),
          })

          const payload = await response.json()
          if (!response.ok) {
            throw new Error(payload?.error?.message || `Groq request failed with status ${response.status}`)
          }

          const text = payload?.choices?.[0]?.message?.content || 'NO TACTICAL OUTPUT RECEIVED.'
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ text }))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error.message || 'Mission intel proxy failed' }))
        }
      })
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    missionIntelProxy,
  ],
})

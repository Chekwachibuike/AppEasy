import type { NextApiRequest, NextApiResponse } from 'next'
import { analyzeJobDescription } from '@/lib/openai'
import { aiAnalysisSchema } from '@shared/schema'
import { ZodError } from 'zod'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const validatedData = aiAnalysisSchema.parse(req.body)
    const analysis = await analyzeJobDescription(validatedData.jobDescription)
    res.status(200).json(analysis)
  } catch (error) {
    console.error('Error analyzing job:', error)
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Invalid job description', 
        details: error.errors 
      })
    }
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to analyze job description' 
    })
  }
}
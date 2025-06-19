import type { NextApiRequest, NextApiResponse } from 'next'
import { analyzeJobDescription } from '@/lib/openai'
import { aiAnalysisSchema } from '@shared/schema'
import { ZodError } from 'zod'

let isAnalyzing = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  if (isAnalyzing) {
    return res.status(429).json({ message: 'AI analysis is already in progress. Please wait for the current analysis to finish.' });
  }

  try {
    isAnalyzing = true;
    const validatedData = aiAnalysisSchema.parse(req.body)
    const analysis = await analyzeJobDescription(validatedData.jobDescription)
    res.status(200).json(analysis)
  } catch (error: any) {
    console.error('Error analyzing job:', error)
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Invalid job description', 
        details: error.errors 
      })
    }
    // Handle OpenAI quota error
    if (typeof error.message === 'string' && error.message.includes('429')) {
      return res.status(429).json({
        message: 'You have exceeded your OpenAI API quota. Please try again later or check your OpenAI billing.'
      });
    }
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to analyze job description' 
    })
  } finally {
    isAnalyzing = false;
  }
}
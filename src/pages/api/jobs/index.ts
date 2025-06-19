import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '@/lib/storage'
import { insertJobSchema } from '@shared/schema'
import { ZodError } from 'zod'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const jobs = await storage.getAllJobs()
      res.status(200).json(jobs)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      res.status(500).json({ message: 'Failed to fetch jobs' })
    }
  } else if (req.method === 'POST') {
    try {
      const validatedData = insertJobSchema.parse(req.body)
      const job = await storage.createJob(validatedData)
      res.status(201).json(job)
    } catch (error) {
      console.error('Error creating job:', error)
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Invalid job data', 
          details: error.errors 
        })
      }
      res.status(500).json({ message: 'Failed to create job' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
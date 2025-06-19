import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '@/lib/storage'
import { updateJobSchema } from '@shared/schema'
import { ZodError } from 'zod'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const jobId = parseInt(id as string)

  if (isNaN(jobId)) {
    return res.status(400).json({ message: 'Invalid job ID' })
  }

  if (req.method === 'GET') {
    try {
      const job = await storage.getJob(jobId)
      if (!job) {
        return res.status(404).json({ message: 'Job not found' })
      }
      res.status(200).json(job)
    } catch (error) {
      console.error('Error fetching job:', error)
      res.status(500).json({ message: 'Failed to fetch job' })
    }
  } else if (req.method === 'PUT') {
    try {
      const validatedData = updateJobSchema.parse({ ...req.body, id: jobId })
      const job = await storage.updateJob(jobId, validatedData)
      
      if (!job) {
        return res.status(404).json({ message: 'Job not found' })
      }

      res.status(200).json(job)
    } catch (error) {
      console.error('Error updating job:', error)
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Invalid job data', 
          details: error.errors 
        })
      }
      res.status(500).json({ message: 'Failed to update job' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = await storage.deleteJob(jobId)
      if (!deleted) {
        return res.status(404).json({ message: 'Job not found' })
      }

      res.status(200).json({ message: 'Job deleted successfully' })
    } catch (error) {
      console.error('Error deleting job:', error)
      res.status(500).json({ message: 'Failed to delete job' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
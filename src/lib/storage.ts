import type { Job, InsertJob, UpdateJob } from '@shared/schema'

export interface IStorage {
  getAllJobs(): Promise<Job[]>
  getJob(id: number): Promise<Job | undefined>
  createJob(job: InsertJob): Promise<Job>
  updateJob(id: number, job: Partial<UpdateJob>): Promise<Job | undefined>
  deleteJob(id: number): Promise<boolean>
}

export class MemStorage implements IStorage {
  private jobs: Map<number, Job>
  private currentId: number

  constructor() {
    this.jobs = new Map()
    this.currentId = 1
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    )
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id)
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentId++
    const job: Job = {
      ...insertJob,
      id,
      appliedDate: new Date(),
      aiSummary: null,
      aiSkills: null,
    }
    this.jobs.set(id, job)
    return job
  }

  async updateJob(id: number, updateData: Partial<UpdateJob>): Promise<Job | undefined> {
    const existingJob = this.jobs.get(id)
    if (!existingJob) {
      return undefined
    }

    const updatedJob: Job = {
      ...existingJob,
      ...updateData,
      id, // Ensure id doesn't change
    }

    this.jobs.set(id, updatedJob)
    return updatedJob
  }

  async deleteJob(id: number): Promise<boolean> {
    return this.jobs.delete(id)
  }
}

export const storage = new MemStorage()
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Job, InsertJob, UpdateJob, AIAnalysisRequest, AIAnalysisResponse } from "@shared/schema"

export function useJobs() {
  return useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const response = await fetch("/api/jobs")
      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }
      return response.json()
    },
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (job: InsertJob) => {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      })
      if (!response.ok) {
        throw new Error('Failed to create job')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...job }: UpdateJob & { id: number }) => {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      })
      if (!response.ok) {
        throw new Error('Failed to update job')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error('Failed to delete job')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] })
    },
  })
}

export function useAnalyzeJob() {
  return useMutation({
    mutationFn: async (data: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('Failed to analyze job')
      }
      return response.json()
    },
  })
}
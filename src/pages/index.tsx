import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, User, PlusCircle, Bot, Sparkles, Calendar, ExternalLink, Edit, Trash2, ClipboardList, Handshake, Trophy, TrendingUp, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { insertJobSchema, aiAnalysisSchema } from '@shared/schema'
import { useJobs, useCreateJob, useAnalyzeJob, useUpdateJob, useDeleteJob } from '@/hooks/use-jobs'
import type { InsertJob, AIAnalysisRequest, Job, AIAnalysisResponse } from '@shared/schema'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const DarkModeToggle = dynamic(() => import('@/components/ui/button').then(mod => mod.DarkModeToggle), { ssr: false })

// Badge component for status
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

// Skeleton component for loading states
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className}`} />
  )
}

export default function Dashboard() {
  const { data: jobs, isLoading } = useJobs()
  const { toast } = useToast()
  const [showAIResults, setShowAIResults] = useState(false)
  const [aiResults, setAIResults] = useState<AIAnalysisResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [localJobs, setLocalJobs] = useState<Job[] | null>(null)
  
  const createJobMutation = useCreateJob()
  const analyzeJobMutation = useAnalyzeJob()
  const updateJobMutation = useUpdateJob()
  const deleteJobMutation = useDeleteJob()
  const router = useRouter()

  const jobForm = useForm<InsertJob>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      title: "",
      company: "",
      applicationLink: "",
      status: "applied",
    },
  })

  const aiForm = useForm<AIAnalysisRequest>({
    resolver: zodResolver(aiAnalysisSchema),
    defaultValues: {
      jobDescription: "",
    },
  })

  useEffect(() => {
    setLocalJobs(jobs ?? null)
  }, [jobs])

  const onSubmitJob = async (data: InsertJob) => {
    try {
      await createJobMutation.mutateAsync(data)
      jobForm.reset()
      toast({
        title: "Success!",
        description: "Job application added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const onAnalyzeJob = async (data: AIAnalysisRequest) => {
    try {
      const results = await analyzeJobMutation.mutateAsync(data)
      setAIResults(results)
      setShowAIResults(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze job description. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job application?")) {
      try {
        await deleteJobMutation.mutateAsync(jobId)
        setLocalJobs((prev) => (prev ?? jobs)?.filter(job => job.id !== jobId) || [])
        toast({
          title: "Success!",
          description: "Job application deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job application. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - d.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Applied yesterday"
    if (diffDays <= 7) return `Applied ${diffDays} days ago`
    if (diffDays <= 14) return `Applied ${Math.ceil(diffDays / 7)} week ago`
    return `Applied ${Math.ceil(diffDays / 7)} weeks ago`
  }

  const statusConfig = {
    applied: { color: "bg-gray-100 text-gray-700", label: "Applied" },
    interviewing: { color: "bg-amber-100 text-amber-700", label: "Interviewing" },
    rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
    offer: { color: "bg-green-100 text-green-700", label: "Offer" },
  }

  const filteredJobs = (localJobs ?? jobs)?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  // Statistics
  const totalApplications = jobs?.length || 0
  const interviewing = jobs?.filter(job => job.status === "interviewing").length || 0
  const offers = jobs?.filter(job => job.status === "offer").length || 0
  const responseRate = totalApplications > 0 
    ? Math.round(((interviewing + offers) / totalApplications) * 100)
    : 0

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Interviewing",
      value: interviewing,
      icon: Handshake,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Offers",
      value: offers,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Response Rate",
      value: `${responseRate}%`,
      icon: TrendingUp,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <>
      <Head>
        <title>AppEasy - Manage Your Applications</title>
        <meta name="description" content="Track your job applications with AI-powered analysis and insights" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation Header */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="text-white w-4 h-4" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AppEasy</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Welcome back!</span>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="text-blue-600 dark:text-blue-300 w-4 h-4" />
                </div>
                <DarkModeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('userEmail');
                    toast({ title: 'Logged out', description: 'You have been logged out.' });
                    router.replace('/login');
                  }}
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Stats */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-slide-up border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                stats.map((stat, index) => (
                  <Card key={stat.title} className="animate-slide-up border-gray-200 dark:border-gray-700" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <stat.icon className={`${stat.color} w-6 h-6`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Application Form */}
            <div className="lg:col-span-1">
              <Card className="animate-slide-up border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PlusCircle className="text-blue-500 w-5 h-5" />
                    <span>Add New Application</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...jobForm}>
                    <form onSubmit={jobForm.handleSubmit(onSubmitJob)} className="space-y-4">
                      <FormField
                        control={jobForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Frontend Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={jobForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. TechCorp Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={jobForm.control}
                        name="applicationLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Link</FormLabel>
                            <FormControl>
                              <Input type="url" placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={jobForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="interviewing">Interviewing</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="offer">Offer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600" 
                        disabled={createJobMutation.isPending}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {createJobMutation.isPending ? "Adding..." : "Add Application"}
                      </Button>
                    </form>
                  </Form>

                  <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

                  {/* AI Analysis Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Bot className="text-green-500 w-5 h-5" />
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white">AI Job Analysis</h3>
                    </div>
                    
                    <Form {...aiForm}>
                      <form onSubmit={aiForm.handleSubmit(onAnalyzeJob)} className="space-y-4">
                        <FormField
                          control={aiForm.control}
                          name="jobDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Paste the job description here..."
                                  className="resize-none"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-green-500 hover:bg-green-600"
                          disabled={analyzeJobMutation.isPending}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {analyzeJobMutation.isPending ? "Analyzing..." : "Analyze Job"}
                        </Button>
                      </form>
                    </Form>

                    {/* AI Results Display */}
                    <Dialog.Root open={showAIResults} onOpenChange={setShowAIResults}>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
                        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
                          <Dialog.Title className="text-lg font-bold mb-4">AI Analysis Results</Dialog.Title>
                          {aiResults && (
                            <div className="space-y-4">
                              <div>
                                <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Summary</h5>
                                <p className="text-sm text-green-800 dark:text-green-200">{aiResults.summary}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Key Skills</h5>
                                <div className="space-y-2">
                                  {aiResults.skills.map((skill, index) => (
                                    <div key={index} className="p-2 bg-green-100 dark:bg-green-800 rounded">
                                      <div className="font-medium text-green-900 dark:text-green-100">{skill.name}</div>
                                      <div className="text-xs text-green-700 dark:text-green-300">{skill.description}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end mt-6">
                            <Button variant="ghost" onClick={() => setShowAIResults(false)}>
                              Close
                            </Button>
                          </div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Applications List */}
            <div className="lg:col-span-2">
              <Card className="animate-slide-up border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Applications</CardTitle>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search applications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interviewing">Interviewing</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="text-gray-400 w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {totalApplications === 0 ? "No applications yet" : "No matching applications"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {totalApplications === 0 
                          ? "Start by adding your first job application." 
                          : "Try adjusting your search or filter criteria."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredJobs.map((job, index) => {
                        const statusStyle = statusConfig[job.status] || statusConfig.applied
                        return (
                          <div 
                            key={job.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                                  <Badge className={statusStyle.color}>
                                    {statusStyle.label}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(job.appliedDate)}</span>
                                  </span>
                                  <a 
                                    href={job.applicationLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>View Job</span>
                                  </a>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditJob(job)}
                                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteJob(job.id)}
                                  disabled={deleteJobMutation.isPending}
                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog.Root open={!!editJob} onOpenChange={open => !open && setEditJob(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
          <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">Edit Application</Dialog.Title>
            {editJob && (
              <Form
                {...jobForm}
                defaultValues={{
                  title: editJob.title,
                  company: editJob.company,
                  applicationLink: editJob.applicationLink,
                  status: editJob.status,
                }}
              >
                <form
                  onSubmit={jobForm.handleSubmit(async (data) => {
                    try {
                      await updateJobMutation.mutateAsync({ ...data, id: editJob.id });
                      setEditJob(null);
                      toast({ title: 'Updated!', description: 'Job updated successfully.' });
                    } catch {
                      toast({ title: 'Error', description: 'Failed to update job.', variant: 'destructive' });
                    }
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={jobForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={jobForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={jobForm.control}
                    name="applicationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Link</FormLabel>
                        <FormControl>
                          <Input type="url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={jobForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interviewing">Interviewing</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setEditJob(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
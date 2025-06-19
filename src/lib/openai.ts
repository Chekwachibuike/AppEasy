import OpenAI from "openai";
import type { AIAnalysisResponse } from "@shared/schema";

// Initialize OpenAI client with API key from environment
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required in environment variables");
}
const openai = new OpenAI({ apiKey });

export async function analyzeJobDescription(jobDescription: string): Promise<AIAnalysisResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a career advisor and job analysis expert. Analyze job descriptions and provide helpful insights for job applicants.\n\nRespond with JSON in this exact format:{\n  \"summary\": \"A concise 2-3 sentence summary of the job role, key responsibilities, and requirements\",\n  \"skills\": [{\n    \"name\": \"Skill Name\",\n    \"description\": \"Why this skill is important for this role and how to highlight it in applications\"\n  }]\n}\nProvide exactly 3 skills that are most important for the role.`
        },
        {
          role: "user",
          content: `Please analyze this job description and provide insights:\n\n${jobDescription}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}")
    if (!result.summary || !Array.isArray(result.skills)) {
      throw new Error("Invalid response format from OpenAI");
    }
    return {
      summary: result.summary,
      skills: result.skills.slice(0, 3)
    };
  } catch (error) {
    throw new Error(`Failed to analyze job description: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
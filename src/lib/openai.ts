import Groq from 'groq-sdk';
import type { AIAnalysisResponse } from "@shared/schema";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeJobDescription(jobDescription: string): Promise<AIAnalysisResponse> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Use the correct model name as needed
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
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = chatCompletion.choices[0]?.message?.content;
    let parsedResult;
    try {
      parsedResult = JSON.parse(result || '{}');
    } catch (parseError) {
      throw new Error('Failed to parse response from Groq: ' + (parseError instanceof Error ? parseError.message : 'Unknown error'));
    }
    if (!parsedResult.summary || !Array.isArray(parsedResult.skills)) {
      throw new Error('Invalid response format from Groq');
    }
    return {
      summary: parsedResult.summary,
      skills: parsedResult.skills.slice(0, 3)
    };
  } catch (error) {
    throw new Error(`Failed to analyze job description: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
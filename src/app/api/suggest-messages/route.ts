import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});


export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

      const completion = await openai.chat.completions.create({
          model: "deepseek-chat",
          messages: [
              {
                  role: "user",
                  content: prompt,
              },
          ],
      });
    
    console.log(completion.choices[0].message);

    // Return the streamed response manually
    return  Response.json({
      message : "Generated Questions",
      success: true,
      data: completion.choices[0].message,
      error: false,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          message 
        }, 
        { status });
    } else {
      console.error('An unexpected error occurred:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}
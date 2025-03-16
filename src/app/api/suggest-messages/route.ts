// import OpenAI from 'openai';
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.groq_key, // This is the default and can be omitted
});

// const openai = new OpenAI({
  //   baseURL: 'https://api.openai.com/v1',  // Default is 'https://api.openai.com/v1'
  //   apiKey: '',  // Your OpenAI API key
// });

export async function POST(req: Request) {
  try {
    const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    
      // const completion = await openai.chat.completions.create({
      //     model: "gpt-3.5-turbo",
      //     messages: [
      //         {
      //             role: "user",
      //             content: prompt,
      //         },
      //     ],
      // });
     
      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
      });
      // console.log("Chat completion =>",completion)

    // Return the streamed response manually
    return  Response.json({
      message : "Generated Questions",
      success: true,
      data: completion.choices[0].message,
      error: false,
    });
  } catch (error) {
   console.log("Chat completion error",error)
  }
}
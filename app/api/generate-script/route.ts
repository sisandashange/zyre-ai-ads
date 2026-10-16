import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call OpenAI to generate a structured 4-scene video ad script
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert video commercial director and copywriter. Break down the user request into a structured 4-scene video advertisement script (Hook, Problem, Solution, Call to Action). For each scene, provide a detailed visual prompt for an AI video generator and a voiceover script line.',
        },
        {
          role: 'user',
          content: `Create a 30-second video ad script based on this idea: ${prompt}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const scriptData = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json({ success: true, script: scriptData });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages, tool_choice, tools } = await req.json();

    const params = {
      model: 'gpt-4o',  // Update this if needed
      stream: false,
      messages,
    };

    if (tools || tool_choice) {
      // Handle cases with tools or tool_choice
      params.tool_choice = tool_choice;
      params.tools = tools;
    }

    const res = await openai.chat.completions.create(params);

    let data;
    if (tools || tool_choice) {
      // Extract data when tools or tool_choice are used
      data = res.choices[0].message.tool_calls[0].function.arguments;
    } else {
      // Extract data without tools or tool_choice
      data = res.choices[0].message.content;
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch the completion' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

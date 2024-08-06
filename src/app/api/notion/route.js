import { Client } from "@notionhq/client";
import { subDays, formatISO } from 'date-fns';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

export async function POST(req) {
  try {
    const { name, transcript, brief } = await req.json();

    if (!name || !transcript || !brief) {
      throw new Error("Missing required fields: name, transcript, or summary");
    }

    const chunkText = (text) => {
      const chunks = [];
      let index = 0;
      while (index < text.length) {
        let chunkEnd = index + 2000;
        if (chunkEnd >= text.length) {
          chunkEnd = text.length;
        } else {
          while (chunkEnd > index && text.charAt(chunkEnd) !== ' ') {
            chunkEnd--;
          }
          if (chunkEnd === index) {
            chunkEnd = index + 2000;
          }
        }
        chunks.push(text.substring(index, chunkEnd));
        index = chunkEnd + 1;
      }
      return chunks;
    };

    const transcriptChunks = chunkText(transcript);

    const propertyNames = [
      "Summary",
      "Action Items",
      "Key Decisions",
      "Notes and Observations",
      "Discussion Points",
      "Contributions",
      "Questions Raised",
      "Follow Ups"
    ];

    const properties = {
      Name: { title: [{ text: { content: name } }] },
      Date: { date: { start: new Date().toISOString() } }
    }

    propertyNames.forEach(prop => {
      if (brief[prop]) {
        properties[prop] = { rich_text: [{ type: 'text', text: { content: brief[prop] } }] };
      }
    });

    const response = await notion.pages.create({
      parent: { database_id: "36b0318852864070b5ef5a1605ad892b" },
      properties,
      children: [
        { object: 'block', type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: 'Transcript' } }] } },
        ...transcriptChunks.map(chunk => ({
          object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: chunk } }] }
        })),
      ],
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error posting to Notion:', error.message);
    return new Response(JSON.stringify({ error: "Failed to post to notion meetings db", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  try {
    const oneWeekAgo = subDays(new Date(), 7);

    const response = await notion.databases.query({
      database_id: "36b0318852864070b5ef5a1605ad892b",
      filter: {
        property: "Date",
        date: {
          after: formatISO(oneWeekAgo),
        },
      },
    });

    // Map through each page and extract all properties
    const summaries = response.results.map((page) => {
      // Initialize an object to hold all dynamic properties
      let propertiesData = {
        id: page.id,
        date: page.properties.Date.date.start,
      };

      // Dynamically get the value for each property in the page
      Object.keys(page.properties).forEach(prop => {
        if (page.properties[prop].type === 'title') {
          propertiesData[prop] = page.properties[prop].title[0]?.text?.content || "No data available";
        } else if (page.properties[prop].type === 'rich_text') {
          propertiesData[prop] = page.properties[prop].rich_text[0]?.text?.content || "No data available";
        } else if (page.properties[prop].type === 'date') {
          propertiesData[prop] = page.properties[prop].date.start;
        }
      });

      return propertiesData;
    });

    return new Response(JSON.stringify(summaries), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching summaries:', error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch summaries" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

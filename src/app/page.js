'use client'

import styles from "./page.module.css";
import TranscriptForm from './TranscriptForm';
import { useState, useEffect } from "react";
import FormDropdown from "./FormDropdown";
import messages from './prompt'

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [name, setName] = useState("");
  const [UETracker, setUETracker] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = ["Upload transcript", "Upload Audio Recording", "Upload Multiple Audio Recordings"];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  useEffect(() => {
    const handleTranscript = async () => {
      if (UETracker) {
        messages.push({ role: "user", content: transcript })
        const tool_choice = { type: "function", function: { name: "send_notes" } };
        const tools = [
          {
            type: "function",
            function: {
              name: "send_notes",
              description: "Send notes of meeting transcript to user",
              parameters: {
                type: "object",
                properties: {
                  "Summary": {
                    type: "string",
                    description: "General summary of the meeting"
                  },
                  "Action Items": {
                    type: "string",
                    description: "List of actionable tasks mentioned in the meeting."
                  },
                  "Key Decisions": {
                    type: "string",
                    description: "Important decisions made during the meeting."
                  },
                  "Notes and Observations": {
                    type: "string",
                    description: "Brief notes and observations highlighting significant discussion points or brainstorming ideas."
                  },
                  "Discussion Points": {
                    type: "string",
                    description: "Highlight major topics of discussion, including any shifts in thinking or new ideas."
                  },
                  "Contributions": {
                    type: "string",
                    description: "Mention who contributed specific ideas or asked questions, capturing their main points."
                  },
                  "Questions Raised": {
                    type: "string",
                    description: "List any critical questions brought up during the meeting along with their contexts."
                  },
                  "Follow Ups": {
                    type: "string",
                    description: "Outline any follow-up actions or additional discussions required for unresolved points."
                  }
                }
              }
            }
          }
        ];
        const chatRes = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages, tool_choice, tools }),
        });
        const chatResJSON = await chatRes.json();

        //If openai has error
        if (chatResJSON.error) {
          setError(chatResJSON.error);
          setUETracker(false);
          setLoading(false);
          setIsSubmitted(true);
          setTimeout(() => { setIsSubmitted(false); setError(null) }, 3000);
          return;
        }
        const brief = JSON.parse(chatResJSON.data);
        const notionRes = await fetch("/api/notion", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, transcript, brief })
        });
        const notionResJSON = await notionRes.json();

        if (notionResJSON.error) {
          setError(notionResJSON.error);
          setUETracker(false);
          setLoading(false);
          setIsSubmitted(true);
          setTimeout(() => {setIsSubmitted(false); setError(null)}, 3000);
          return;
        }

        setUETracker(false);
        setLoading(false);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    };
    handleTranscript();
  }, [UETracker, transcript, name]);

  const dropdownInfo = {
    isDropdownOpen,
    setIsDropdownOpen,
    options,
    selectedOption,
    setSelectedOption,
  };

  return (
    <main className={styles.main}>
      <FormDropdown dropdownInfo={dropdownInfo} />
      <TranscriptForm
        setTranscript={setTranscript}
        setName={setName}
        setUETracker={setUETracker}
        isSubmitted={isSubmitted}
        loading={loading}
        setLoading={setLoading}
        error={error}
      />
    </main>
  );
}

'use client'

import { useState } from 'react';
import styles from './page.module.css';
import messages from './prompt.js'

export default function Home() {
  const [isLoading1, setIsLoading1] = useState(false);
  const [errorMessage1, setErrorMessage1] = useState('');
  const [successMessage1, setSuccessMessage1] = useState('');
  const [isLoading2, setIsLoading2] = useState(false);
  const [errorMessage2, setErrorMessage2] = useState('');
  const [successMessage2, setSuccessMessage2] = useState('');
  const [briefs, setBriefs] = useState(null);
  const [draft, setDraft] = useState(null);


  const createDraft = async () => {
    const formattedBriefs = JSON.stringify(briefs);
    messages.push({role: "user", content: formattedBriefs})
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
              "Highlights": {
                type: "array",
                description: "General summary of the meeting"
              },
              "Next Week": {
                type: "array",
                description: "List of actionable tasks mentioned in the meeting."
              },
            }
          }
        }
      }
    ];
    setIsLoading2(true);
    setErrorMessage2('');
    setSuccessMessage2('');
    try {
      const response = await fetch('./api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to compile notes');
      }

      const draftData = await response.json();
      setDraft(draftData.data);
      setSuccessMessage2('Notes compiled successfully!');
    } catch (error) {
      setErrorMessage2(error.message);
    } finally {
      setIsLoading2(false);
    }
  }

  const compileNotes = async () => {
    setIsLoading1(true);
    setErrorMessage1('');
    setSuccessMessage1('');

    try {
      const response = await fetch('/api/notion', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to compile notes');
      }

      const summariesData = await response.json();
      setBriefs(summariesData);
      setSuccessMessage1('Notes compiled successfully!');
    } catch (error) {
      setErrorMessage1(error.message);
    } finally {
      setIsLoading1(false);
    }
  };

  return (
    <main className={styles.main1}>
      <div className={styles.main2}>
        <button onClick={compileNotes} className={styles.button}>
          Compile notes
        </button>
        {isLoading1 && <div className={styles.loading}>Loading...</div>}
        {errorMessage1 && <div className={styles.errorMessage}>{errorMessage1}</div>}
        {successMessage1 && <div className={styles.successMessage}>{successMessage1}</div>}
        {briefs && briefs.map((brief, index) => (
          <div key={index} className={styles.card}>
            <h3>{brief["Name"]}</h3>
            <p>{brief["Summary"]}</p>
            <p><small>{new Date(brief.date).toLocaleDateString()}</small></p>
          </div>
        ))}
      </div>
      <div className={styles.main3}>
        {
          briefs ? <button onClick={createDraft} className={styles.button}>
            Write Draft
          </button> : <button className={styles.unavailable}>
            Write Draft
          </button>
        }
        {isLoading2 && <div className={styles.loading}>Loading...</div>}
        {errorMessage2 && <div className={styles.errorMessage}>{errorMessage2}</div>}
        {successMessage2 && <div className={styles.successMessage}>{successMessage2}</div>}
        {draft &&
          <div className={styles.card}>
            <h3>Weekly Status Update -- Draft</h3>
            <p>{draft}</p>
            <p><small>{(new Date).toLocaleDateString()}</small></p>
          </div>
        }
      </div>
    </main>
  );
}

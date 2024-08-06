'use client';
import { useState } from 'react';
import styles from './page.module.css';

const TranscriptForm = ({ setTranscript, setName, setUETracker, isSubmitted, loading, setLoading, error }) => {

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    const formData = new FormData(event.currentTarget);
    const transcript = formData.get("transcript");
    const name = formData.get("name");
    setUETracker(true);
    setName(name);
    setTranscript(transcript);
  };

  return (
    <div className={`${styles['form-container']} ${isSubmitted ? styles['submitted'] : ''}`}>
      {loading ? (
        <div className={styles['loading']}>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className={styles['error-message']}>
          <p>Error: {error}</p>
        </div>
      ) : isSubmitted ? (
        <div className={styles['success-message']}>
          <p>Form submitted successfully!</p>
        </div>
      ) : (
        <form onSubmit={onFormSubmit}>
          <label>Meeting Name</label>
          <input name="name" />
          <label>Transcript</label>
          <textarea name="transcript" rows="6" />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default TranscriptForm;

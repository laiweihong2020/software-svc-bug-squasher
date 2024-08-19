"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@monaco-editor/react';
import './solve.css'; // Import the CSS file

const Solve = () => {
  const router = useRouter();

  const navigateToTriage = () => {
    router.push('/triage');
  };

  return (
    <div>
      <header className="page-header">
        <h1>Solve</h1>
      </header>
      <div className="container">
        <section className="left-section">
          <iframe
            src="/resource/snake/index.html"
            width="100%"
            height="80%"
            style={{ border: 'none' }}
            title="Solve Page"
          ></iframe>
        </section>
        <div className="divider"></div>
        <section className="right-section">
          <Editor
            height="70vh"
            defaultLanguage="javascript"
            defaultValue="// Write your code here"
          />
          <button onClick={navigateToTriage} className="btn">
            Go to Triage Page
          </button>
        </section>
      </div>
    </div>
  );
};

export default Solve;
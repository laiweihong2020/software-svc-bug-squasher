"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@monaco-editor/react';
import './solve.css'; // Import the CSS file

// Function to get the value of a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to delete a cookie by name
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

const Solve = () => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('snake.js'); // Set default file to index.html
  const [fileContent, setFileContent] = useState('// Loading...');
  const [iframeKey, setIframeKey] = useState(0); // State to trigger iframe refresh

  useEffect(() => {
    fetch('/api/files')
      .then(response => response.json())
      .then(data => {
        const filteredFiles = data.files.filter(file => file !== 'triage.html');
        setFiles(filteredFiles);
        fetchFileContent(selectedFile);
      })
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  useEffect(() => {
    fetchFileContent(selectedFile);
  }, [selectedFile]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  const fetchFileContent = async (fileName) => {
    const username = getCookie('username');

    try {
      const response = await fetch(`/resource/${username}/${fileName}`);
      const text = await response.text();
      setFileContent(text);
    } catch (error) {
      console.error('Error fetching file content:', error);
      setFileContent('// Error loading content');
    }
  };

  const navigateToTriage = () => {
    router.push('/triage');
  };

  const handleCodeSave = () => {
    const username = getCookie('username');

    if (!username) {
      console.error('Username cookie not found');
      return;
    }

    console.log('Submitted solve content:', fileContent);
    // Add your submission logic here (e.g., send content to the server)
    fetch('/api/submission/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: fileContent, username, selectedFile }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Solve submission response:', data);
      setIframeKey(prevKey => prevKey + 1); // Trigger iframe refresh
    })
    .catch(error => {
      console.error('Error submitting solve content:', error);
    });
  };

  const handleLogout = () => {
    deleteCookie('username');
    router.push('/');
  };

  return (
    <div>
      <header className="page-header">
        <nav className="navbar">
          <h1>APU Student Visit 2024 Bug Squasher - Solve</h1>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <div className="container">
        <section className="left-section">
          <iframe
            key={iframeKey} // Use key to trigger re-render
            src={`/resource/${getCookie('username')}/index.html`}
            width="100%"
            height="80%"
            style={{ border: 'none' }}
            title="Solve Page"
          ></iframe>
        </section>
        <div className="divider"></div>
        <section className="right-section">
          <select className="file-dropdown" value={selectedFile} onChange={handleFileChange}>
            <option value="" disabled>Select a file</option>
            {files.map((file) => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
          <Editor
            height="65vh"
            defaultLanguage="html"
            value={fileContent}
            onChange={(value) => setFileContent(value)}
          />
          <button onClick={navigateToTriage} className="btn">
            Go to Triage Page
          </button>
          <button onClick={handleCodeSave} className="btn">
            Save & Update Game
          </button>
        </section>
      </div>
    </div>
  );
};

export default Solve;
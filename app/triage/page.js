"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Import Prism.js CSS
import 'quill/dist/quill.snow.css'; // Import Quill CSS
import './triage.css'; // Import the CSS file
import Quill from 'quill';

// Function to get the value of a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

const TriagePage = () => {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState('');
  const [lineNumbers, setLineNumbers] = useState('');
  const [files, setFiles] = useState([]);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState('snake.js'); // Set default file to index.html
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    fetch('/api/files')
      .then(response => response.json())
      .then(data => {
        const filteredFiles = data.files.filter(file => file !== 'triage.html');
        setFiles(filteredFiles);
      })
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  useEffect(() => {
    const username = getCookie('username');

    if (selectedFile && username) {
      fetch(`/resource/${username}/${selectedFile}`)
        .then(response => response.text())
        .then(data => {
          setHtmlContent(data);
          const lines = data.split('\n').length;
          const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
          setLineNumbers(lineNumbers);
          Prism.highlightAll(); // Highlight the code
        })
        .catch(error => console.error('Error fetching HTML content:', error));
    }
  }, [selectedFile]);

  useEffect(() => {
    const username = getCookie('username');

    if (username) {
      fetch(`/resource/${username}/triage.html`)
        .then(response => response.text())
        .then(data => {
          if (quillInstance.current) {
            quillInstance.current.root.innerHTML = data;
          }
        })
        .catch(error => {
          console.error('Error fetching Quill content:', error)
          quillInstance.current.root.innerHTML = '';
        });
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }]
          ]
        }
      });
    }
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  const navigateToSolve = () => {
    router.push('/solve');
  };

  const handleSubmit = () => {
    if (quillInstance.current) {
      const content = quillInstance.current.root.innerHTML;
      const username = getCookie('username');

      if (!username) {
        console.error('Username cookie not found');
        return;
      }

      console.log('Submitted content:', content);
      // Add your submission logic here (e.g., send content to the server)
      fetch('/api/submission/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, username }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Triage submission response:', data);
      })
      .catch(error => {
        console.error('Error submitting triage content:', error);
      });

      // On successful submission
      setBannerMessage('Submission successful!');
      setIsBannerVisible(true);

      // Hide the banner after a few seconds (optional)
      setTimeout(() => {
        setIsBannerVisible(false);
      }, 3000); // Adjust the timeout duration as needed
    }
  };

  const handleLogout = () => {
    deleteCookie('username');
    router.push('/');
  };

  return (
    <div>
      <header className="page-header">
        <nav className="navbar">
          <h1>APU Student Visit 2024 Bug Squasher - Triage</h1>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <div className="container">
        <section className="left-section">
          <div className="file-selector">
            <select className="file-dropdown" value={selectedFile} onChange={handleFileChange}>
              <option value="" disabled>Select a file</option>
              {files.map((file) => (
                <option key={file} value={file}>{file}</option>
              ))}
            </select>
            <pre className="code-block">
              <div className="line-numbers">{lineNumbers}</div>
              <code className="language-javascript">{htmlContent}</code>
            </pre>
          </div>
        </section>
        <div className="divider"></div>
        <section className="right-section">
          <div ref={quillRef} className="text-box"></div>
          {isBannerVisible && (
            <div className="banner">
              {bannerMessage}
            </div>
          )}
          <button onClick={handleSubmit} className="btn">
            Submit
          </button>
          <button onClick={navigateToSolve} className="btn">
            Go to Solve Page
          </button>
        </section>
      </div>
    </div>
  );
};

export default TriagePage;
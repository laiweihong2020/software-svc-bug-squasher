"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Import Prism.js CSS
import 'quill/dist/quill.snow.css'; // Import Quill CSS
import './triage.css'; // Import the CSS file
import Quill from 'quill';

const TriagePage = () => {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState('');
  const [lineNumbers, setLineNumbers] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('index.html'); // Set default file to index.html
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    fetch('/api/files')
      .then(response => response.json())
      .then(data => setFiles(data.files))
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetch(`/resource/snake/${selectedFile}`)
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

  return (
    <div>
      <header className="page-header">
        <h1>Triage</h1>
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
          <button onClick={navigateToSolve} className="btn">
            Go to Solve Page
          </button>
        </section>
      </div>
    </div>
  );
};

export default TriagePage;
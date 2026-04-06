"use client";

import React, { useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import EditorPane from '../components/EditorPane';
import PreviewPane from '../components/PreviewPane';
import Sidebar, { MarkdownDocument } from '../components/Sidebar';

const DEFAULT_CONTENT = `# Welcome to the Live Editor \✨

This is a **premium**, highly responsive Markdown editor built with Next.js and Vanilla CSS. 

## Features
- **Live Preview:** See your changes instantly.
- **Scroll Sync:** Scrolling the editor updates the preview position.
- **Syntax Highlighting:** Code blocks look gorgeous!

### Code Example
\`\`\`javascript
function calculatePremium(awesomeness) {
  if (awesomeness > 100) {
    return 'Maximum Wow Factor';
  }
  return 'Keep Coding!';
}
\`\`\`

> *“Design is not just what it looks like and feels like. Design is how it works.”* — Steve Jobs
`;

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Home() {
  const [files, setFiles] = useState<MarkdownDocument[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedFiles = localStorage.getItem('md-editor-files');
    const savedActiveId = localStorage.getItem('md-editor-active-id');
    const savedTheme = localStorage.getItem('md-editor-theme') as 'light' | 'dark';

    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }

    if (savedFiles && JSON.parse(savedFiles).length > 0) {
      const parsedFiles = JSON.parse(savedFiles);
      setFiles(parsedFiles);
      setActiveFileId(savedActiveId || parsedFiles[0].id);
    } else {
      const initialFile = { id: generateId(), title: 'Untitled Document', content: DEFAULT_CONTENT };
      setFiles([initialFile]);
      setActiveFileId(initialFile.id);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('md-editor-files', JSON.stringify(files));
    localStorage.setItem('md-editor-active-id', activeFileId);
  }, [files, activeFileId, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('md-editor-theme', theme);
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme, isLoaded]);

  const handleEditorScroll = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
    if (scrollHeight > clientHeight) {
      setScrollPercentage(scrollTop / (scrollHeight - clientHeight));
    } else {
      setScrollPercentage(0);
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAddFile = () => {
    const newFile = { id: generateId(), title: 'New Document', content: '' };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleSwitchFile = (id: string) => {
    setActiveFileId(id);
    setScrollPercentage(0);
  };

  const handleDeleteFile = (id: string) => {
    if (files.length === 1) return; // Don't delete the last file
    if (window.confirm('Are you sure you want to delete this file?')) {
      const newFiles = files.filter(f => f.id !== id);
      setFiles(newFiles);
      if (activeFileId === id) {
        setActiveFileId(newFiles[0].id);
      }
    }
  };

  const handleUpdateContent = (newContent: string) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleUpdateTitle = (newTitle: string) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, title: newTitle } : f));
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  if (!activeFile) return null;

  return (
    <div className="app-container">
      <Toolbar 
        content={activeFile.content}
        title={activeFile.title}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onTitleChange={handleUpdateTitle}
      />
      <div className="main-wrapper">
        <Sidebar 
          files={files}
          activeFileId={activeFileId}
          onAddFile={handleAddFile}
          onSwitchFile={handleSwitchFile}
          onDeleteFile={handleDeleteFile}
        />
        <main className="split-pane">
          <EditorPane
            content={activeFile.content}
            onChange={handleUpdateContent}
            onScroll={handleEditorScroll}
          />
          <PreviewPane
            content={activeFile.content}
            scrollPercentage={scrollPercentage}
          />
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Toolbar from '../components/Toolbar';
import EditorPane from '../components/EditorPane';
import PreviewPane from '../components/PreviewPane';
import Sidebar, { MarkdownDocument } from '../components/Sidebar';
import { v4 as uuidv4 } from 'uuid';

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

export default function Home() {
  const [files, setFiles] = useState<MarkdownDocument[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  // Track debounce timer for saving
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Initialize Theme and Session ID from localStorage
    const savedTheme = localStorage.getItem('md-editor-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    }

    let currentSessionId = localStorage.getItem('md-editor-session-id');
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      localStorage.setItem('md-editor-session-id', currentSessionId);
    }
    setSessionId(currentSessionId);

    // 2. Fetch documents from Database API
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/documents?sessionId=${currentSessionId}`);
        if (response.ok) {
          const dbFiles = await response.json();
          if (dbFiles.length > 0) {
            setFiles(dbFiles);
            const savedActiveId = localStorage.getItem('md-editor-active-id');
            setActiveFileId(savedActiveId && dbFiles.some((f: any) => f.id === savedActiveId) ? savedActiveId : dbFiles[0].id);
          } else {
            // First time ever opening, create a default doc API
            await createDefaultDocument(currentSessionId);
          }
        }
      } catch (err) {
        console.error('Error fetching documents from remote database', err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchDocuments();
  }, []);

  const createDefaultDocument = async (sid: string) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, title: 'Untitled Document', content: DEFAULT_CONTENT })
      });
      if (res.ok) {
        const newDoc = await res.json();
        setFiles([newDoc]);
        setActiveFileId(newDoc.id);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Effect to sync simple local storage refs
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('md-editor-active-id', activeFileId);
    localStorage.setItem('md-editor-theme', theme);
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme, activeFileId, isLoaded]);

  // Debounced Save API Request
  const saveToDatabase = (id: string, title?: string, content?: string) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      const fileToSave = files.find(f => f.id === id);
      if (!fileToSave) return;
      
      const payloadTitle = title !== undefined ? title : fileToSave.title;
      const payloadContent = content !== undefined ? content : fileToSave.content;

      try {
        await fetch(`/api/documents/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: payloadTitle, content: payloadContent })
        });
      } catch (e) {
        console.error('Error saving document to db', e);
      }
    }, 1000); // Save to DB after 1s of inactivity
  };

  const handleEditorScroll = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
    if (scrollHeight > clientHeight) {
      setScrollPercentage(scrollTop / (scrollHeight - clientHeight));
    } else {
      setScrollPercentage(0);
    }
  };

  const handleToggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleAddFile = async () => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, title: 'New Document', content: '' })
      });
      if (res.ok) {
        const newDoc = await res.json();
        setFiles([newDoc, ...files]);
        setActiveFileId(newDoc.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchFile = (id: string) => {
    setActiveFileId(id);
    setScrollPercentage(0);
  };

  const handleDeleteFile = async (id: string) => {
    if (files.length === 1) return; 
    if (window.confirm('Are you sure you want to delete this file from the database?')) {
      try {
        await fetch(`/api/documents/${id}`, { method: 'DELETE' });
        const newFiles = files.filter(f => f.id !== id);
        setFiles(newFiles);
        if (activeFileId === id) setActiveFileId(newFiles[0].id);
      } catch (err) {
        console.error('Error deleting document', err);
      }
    }
  };

  const handleUpdateContent = (newContent: string) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
    saveToDatabase(activeFileId, undefined, newContent);
  };

  const handleUpdateTitle = (newTitle: string) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, title: newTitle } : f));
    saveToDatabase(activeFileId, newTitle, undefined);
  };

  if (!isLoaded) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', color: 'var(--foreground)'}}>Loading Workspace...</div>;

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

import React from 'react';
import { Download, FileText, Sun, Moon } from 'lucide-react';
import { exportToMarkdown } from '../utils/exportFile';

interface ToolbarProps {
  content: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export default function Toolbar({ 
  content, 
  theme, 
  onToggleTheme, 
  title, 
  onTitleChange 
}: ToolbarProps) {
  const handleExport = () => {
    exportToMarkdown(content, `${title || 'document'}.md`);
  };

  return (
    <header className="toolbar">
      <div className="brand">
        <FileText size={24} color={theme === 'light' ? '#8b5cf6' : '#bd93f9'} />
        <span>MD Editor</span>
      </div>

      <div className="toolbar-center">
        <input 
          type="text" 
          className="title-input" 
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Document"
        />
      </div>

      <div className="toolbar-actions">
        <button className="btn-icon" onClick={onToggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="btn-export" onClick={handleExport} title="Export to Markdown">
          <Download size={18} />
          Export
        </button>
      </div>
    </header>
  );
}

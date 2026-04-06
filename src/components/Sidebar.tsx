import React from 'react';
import { Plus, FileText, Trash2 } from 'lucide-react';

export interface MarkdownDocument {
  id: string;
  title: string;
  content: string;
}

interface SidebarProps {
  files: MarkdownDocument[];
  activeFileId: string;
  onAddFile: () => void;
  onSwitchFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export default function Sidebar({
  files,
  activeFileId,
  onAddFile,
  onSwitchFile,
  onDeleteFile
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Files</span>
        <button className="btn-new-file" onClick={onAddFile} title="New File">
          <Plus size={18} />
        </button>
      </div>
      <div className="file-list">
        {files.map(file => (
          <div
            key={file.id}
            className={`file-item ${file.id === activeFileId ? 'active' : ''}`}
            onClick={() => onSwitchFile(file.id)}
          >
            <div className="file-item-info">
              <FileText size={16} />
              <span className="file-name">{file.title}</span>
            </div>
            {files.length > 1 && (
              <button
                className="btn-delete-file"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file.id);
                }}
                title="Delete File"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

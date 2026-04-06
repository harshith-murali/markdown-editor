import React, { ChangeEvent, useRef } from 'react';

interface EditorPaneProps {
  content: string;
  onChange: (value: string) => void;
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
}

export default function EditorPane({ content, onChange, onScroll }: EditorPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (onScroll && textareaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = textareaRef.current;
      onScroll(scrollTop, scrollHeight, clientHeight);
    }
  };

  return (
    <div className="pane editor-pane">
      <div className="pane-header">Markdown</div>
      <textarea
        ref={textareaRef}
        className="editor-input"
        value={content}
        onChange={handleChange}
        onScroll={handleScroll}
        placeholder="Type your markdown here..."
        spellCheck="false"
      />
    </div>
  );
}

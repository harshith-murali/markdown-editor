import React, { useEffect, useRef } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'isomorphic-dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);
marked.use({ gfm: true, breaks: true });

interface PreviewPaneProps {
  content: string;
  scrollPercentage?: number;
}

export default function PreviewPane({ content, scrollPercentage = 0 }: PreviewPaneProps) {
  const previewRef = useRef<HTMLDivElement>(null);



  // Sync scrolling
  useEffect(() => {
    if (previewRef.current) {
      const { scrollHeight, clientHeight } = previewRef.current;
      previewRef.current.scrollTop = scrollPercentage * (scrollHeight - clientHeight);
    }
  }, [scrollPercentage]);

  // Parse markdown to HTML
  const rawHtml = marked.parse(content) as string;
  const safeHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div className="pane preview-pane">
      <div className="pane-header">Preview</div>
      <div
        ref={previewRef}
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  );
}

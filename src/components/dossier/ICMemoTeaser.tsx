import React, { useState } from 'react';
import { TargetCompany } from '../../types/mna';
import { useDealflow } from '../../context/DealflowContext';
import { generateICMemoMarkdown, downloadTextFile } from '../../utils/exportUtils';
import { FileText, Copy, Check, Download, Printer, Sparkles, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ICMemoTeaserProps {
  target: TargetCompany;
}

export const ICMemoTeaser: React.FC<ICMemoTeaserProps> = ({ target }) => {
  const { acquirer, showToast } = useDealflow();
  const [copied, setCopied] = useState(false);

  const markdownContent = generateICMemoMarkdown(target, acquirer);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    showToast('success', 'IC Memo Copied', 'Markdown memorandum copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    downloadTextFile(
      markdownContent,
      `IC_Memo_${target.codeName}_${target.name.replace(/\s+/g, '_')}.md`,
      'text/markdown'
    );
    showToast('success', 'IC Memo Downloaded', `Saved IC memo for ${target.codeName}`);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (e) {
      // ignore
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>IC Memorandum - ${target.codeName} - ${target.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 40px; color: #1e293b; }
            h1 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
            h2 { color: #0369a1; margin-top: 24px; }
            pre { background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: monospace;">${markdownContent}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with quick actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={18} style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Preliminary IC Memorandum // {target.codeName.toUpperCase()}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Auto-generated executive synthesis for Investment Committee review
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm"
            id="btn-copy-ic-memo"
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-secondary btn-sm"
            id="btn-download-ic-memo"
          >
            <Download size={13} />
            <span>Download .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-primary btn-sm"
            id="btn-print-ic-memo"
          >
            <Printer size={13} />
            <span>Print Teaser</span>
          </button>
        </div>
      </div>

      {/* Styled Rendered Preview Container */}
      <div style={{
        background: '#090d16',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '28px',
        maxHeight: '480px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        lineHeight: 1.6,
        color: '#e2e8f0',
        whiteSpace: 'pre-wrap',
        boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)',
      }}>
        {markdownContent}
      </div>
    </div>
  );
};

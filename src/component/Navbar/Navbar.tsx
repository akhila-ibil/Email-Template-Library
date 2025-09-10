import React, { useState } from 'react';

type NavbarProps = {
  preview: boolean;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
  copyJSON: () => void;
  copyHTML: () => void;
  exportHTML: () => string;
  setBlocks: React.Dispatch<React.SetStateAction<any[]>>;
  setInspecting: React.Dispatch<React.SetStateAction<any>>;
};

const Navbar: React.FC<NavbarProps> = ({
  preview,
  setPreview,
  copyJSON,
  copyHTML,
  exportHTML,
  setBlocks,
  setInspecting,
}) => {
  const [emailName, setEmailName] = useState('Untitled');

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      {/* Editable Email Name */}
      <input
        className="text-lg font-semibold bg-transparent border-none outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        value={emailName}
        onChange={(e) => setEmailName(e.target.value)}
        style={{ minWidth: 120 }}
      />
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => setPreview((p: boolean) => !p)}
        >
          {preview ? 'Edit Mode' : 'Preview'}
        </button>
        <button
          className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          onClick={copyJSON}
        >
          Copy JSON
        </button>
        <button
          className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          onClick={copyHTML}
        >
          Copy HTML
        </button>
        <button
          className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => {
            const html = exportHTML();
            const w = window.open();
            if (w) {
              w.document.open();
              w.document.write(html);
              w.document.close();
            }
          }}
        >
          Open HTML Preview
        </button>
        <button
          className="px-3 py-2 rounded-md border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
          onClick={() => {
            if (confirm('Are you sure you want to clear all blocks?')) {
              setBlocks([]);
              localStorage.removeItem('email-builder');
              setInspecting(null);
            }
          }}
        >
          Clear Blocks
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

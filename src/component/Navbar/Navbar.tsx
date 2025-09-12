import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type NavbarProps = {
  preview: boolean;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
  viewJSON: () => void;
  viewHTML: () => void;
  exportHTML: () => string;
  setBlocks: React.Dispatch<React.SetStateAction<any[]>>;
  setInspecting: React.Dispatch<React.SetStateAction<any>>;
  togglePreview: (newPreviewState: boolean) => void;
};

const Navbar: React.FC<NavbarProps> = ({
  preview,
  setPreview,
  viewJSON,
  viewHTML,
  exportHTML,
  setBlocks,
  setInspecting,
  togglePreview,
}) => {
  const [emailName, setEmailName] = useState('Untitled');

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-background border-b">
      <div className="flex items-center gap-2">
        <Input
          value={emailName}
          onChange={(e) => setEmailName(e.target.value)}
          placeholder="Untitled"
          className="h-9 text-base font-semibold w-[180px]"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => togglePreview(!preview)}>
          {preview ? 'Edit Mode' : 'Preview'}
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white border-green-700"
          variant="secondary"
          onClick={viewJSON}
        >
          Save
        </Button>
        <Button variant="outline" onClick={viewHTML}>
          HTML
        </Button>
        <Button variant="outline" onClick={viewJSON}>
          JSON
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            if (confirm('Are you sure you want to clear all blocks?')) {
              setBlocks([]);
              localStorage.removeItem('email-builder');
              setInspecting(null);
            }
          }}
        >
          Clear Blocks
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

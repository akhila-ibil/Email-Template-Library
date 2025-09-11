'use client';

import { Block } from '@/app/email-editor/page';

interface AddBlockMenuProps {
  addBlock: (type: Block['type']) => void;
  show: boolean;
  onClose: () => void;
}

export default function AddBlockMenu({ addBlock, show, onClose }: AddBlockMenuProps) {
  if (!show) return null;

  const items: { type: Block['type']; label: string; icon: string }[] = [
    { type: 'heading', label: 'Heading', icon: '/heading.svg' },
    { type: 'paragraph', label: 'Text', icon: '/paragraph.svg' },
    { type: 'button', label: 'Button', icon: '/button.svg' },
    { type: 'image', label: 'Image', icon: '/image.svg' },
    { type: 'divider', label: 'Divider', icon: '/divider.svg' },
    { type: 'spacer', label: 'Spacer', icon: '/spacer.svg' },
    { type: 'container', label: 'Container', icon: '/container.svg' },
    { type: 'columns', label: 'Columns', icon: '/columns.svg' },
  ];

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10 w-80">
      <div className="grid grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.type}
            className="flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-md border border-gray-100"
            onClick={() => {
              addBlock(item.type);
              onClose();
            }}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mb-2">
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-700 text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

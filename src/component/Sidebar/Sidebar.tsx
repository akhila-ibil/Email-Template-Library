import React from 'react';

type SidebarProps = {
  onDragStart: (e: React.DragEvent, type: 'heading' | 'paragraph' | 'image') => void;
};

export default function Sidebar({ onDragStart }: SidebarProps) {
  return (
    <div className="w-56 border-r border-gray-200 p-4 bg-white flex flex-col" style={{ height: '100%' }}>
      <div className="font-bold mb-3 text-gray-800">Blocks</div>

      <div
        className="p-2 bg-gray-50 border border-gray-200 rounded-md flex mb-2 cursor-grab hover:bg-gray-100 transition-colors"
        draggable
        onDragStart={(e) => onDragStart(e, 'heading')}
      >
        +{' '}
        <span>
          <img src="/heading.svg" alt="Heading" className="w-5 h-5 mx-1" />
        </span>{' '}
        Heading
      </div>

      <div
        className="p-2 bg-gray-50 border border-gray-200 rounded-md mb-2  flex cursor-grab hover:bg-gray-100 transition-colors"
        draggable
        onDragStart={(e) => onDragStart(e, 'paragraph')}
      >
        +
        <span>
          <img src="/paragraph.svg" alt="Paragraph" className="w-5 h-5 mx-1" />
        </span>{' '}
        Paragraph
      </div>

      <div
        className="p-2 bg-gray-50 border border-gray-200 rounded-md mb-2 cursor-grab flex hover:bg-gray-100 transition-colors"
        draggable
        onDragStart={(e) => onDragStart(e, 'image')}
      >
        +
        <span>
          <img src="/image.svg" alt="Image" className="w-5 h-5 mx-1" />
        </span>{' '}
        Image
      </div>

      <div className="mt-4 text-gray-500 text-xs">
        Drag a block from the left onto the canvas to add it. Drag within the canvas to reorder.
      </div>
    </div>
  );
}

'use client';

import Navbar from '@/component/Navbar/Navbar';
import React, { JSX, useEffect, useState } from 'react';

export type Block = {
  id: string;
  type: 'heading' | 'paragraph' | 'image';
  level?: number; // for heading
  content?: string; // text or dataURL
  alt?: string; // image alt
  width?: number; // image width in px
};
export default function TailwindEmailBuilder(): JSX.Element {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [preview, setPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'website' | 'mobile'>('website');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [inspecting, setInspecting] = useState<Block | null>(null);
  const [savedBlocks] = useState<Block[]>([]);
  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('email-builder');
      if (raw) setBlocks(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // save
  useEffect(() => {
    try {
      localStorage.setItem('email-builder', JSON.stringify(blocks));
    } catch (e) {}
  }, [blocks]);

  useEffect(() => {
    if (savedBlocks.length > 0) {
      setBlocks(savedBlocks);
    }
  }, [savedBlocks]);

  // helpers
  const addBlock = (type: Block['type'], insertAt?: number) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      level: type === 'heading' ? 1 : undefined,
      content: type === 'heading' ? 'New Heading' : type === 'paragraph' ? 'New paragraph text...' : '', // image content will be dataURL set later
    };
    const copy = [...blocks];
    if (insertAt !== undefined) copy.splice(insertAt, 0, newBlock);
    else copy.push(newBlock);
    setBlocks(copy);
  };

  const updateBlock = (id: string, changes: Partial<Block>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...changes } : b)));
    if (inspecting?.id === id) setInspecting((p) => (p ? { ...p, ...changes } : p));
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (inspecting?.id === id) setInspecting(null);
  };

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    setBlocks((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr;
    });
  };

  // drag & drop handlers
  const onSidebarDragStart = (e: React.DragEvent, type: Block['type']) => {
    e.dataTransfer.setData('text/plain', `sidebar-${type}`);
  };

  const onCanvasDragStart = (e: React.DragEvent, index: number, id: string) => {
    e.dataTransfer.setData('text/plain', `canvas-${id}`);
    setDragIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain') || '';
    if (raw.startsWith('sidebar-')) {
      const type = raw.split('-')[1] as Block['type'];
      addBlock(type, index);
      return;
    }
    if (raw.startsWith('canvas-') && dragIndex !== null) {
      setBlocks((prev) => {
        const moved = prev[dragIndex];
        const copy = [...prev];
        copy.splice(dragIndex, 1);
        if (index !== undefined) copy.splice(index, 0, moved);
        else copy.push(moved);
        return copy;
      });
      setDragIndex(null);
    }
  };

  // image upload for a block
  const handleImageFile = (file: File, id: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      updateBlock(id, { content: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // export html
  const exportHTML = () => {
    const html = blocks
      .map((b) => {
        if (b.type === 'heading') {
          const level = Math.min(3, Math.max(1, b.level || 1));
          return `<h${level}>${escapeHtml(b.content || '')}</h${level}>`;
        }
        if (b.type === 'paragraph') {
          return `<p>${escapeHtml(b.content || '')}</p>`;
        }
        if (b.type === 'image') {
          const w = b.width ? ` width="${b.width}"` : '';
          const alt = b.alt ? ` alt="${escapeHtml(b.alt)}"` : ' alt=""';
          return `<img src="${b.content || ''}"${alt}${w} />`;
        }
        return '';
      })
      .join('\n');
    return `<!doctype html>\n<html>\n<body>\n${html}\n</body>\n</html>`;
  };

  // copy JSON
  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(blocks, null, 2));
      alert('JSON copied to clipboard');
    } catch {
      alert('Copy failed');
    }
  };

  const copyHTML = async () => {
    const html = exportHTML();
    try {
      await navigator.clipboard.writeText(html);
      alert('HTML copied to clipboard');
    } catch {
      alert('Copy failed');
    }
  };

  // small util
  function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar
        preview={preview}
        setPreview={setPreview}
        copyJSON={copyJSON}
        copyHTML={copyHTML}
        exportHTML={exportHTML}
        setBlocks={setBlocks}
        setInspecting={setInspecting}
      />

      {/* Main content area below navbar, height minus navbar (56px) */}
      <div className="flex" style={{ height: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <div className="w-56 border-r border-gray-200 p-4 bg-white flex flex-col" style={{ height: '100%' }}>
          <div className="font-bold mb-3 text-gray-800">Blocks</div>

          <div
            className="p-2 bg-gray-50 border border-gray-200 rounded-md mb-2 cursor-grab hover:bg-gray-100 transition-colors"
            draggable
            onDragStart={(e) => onSidebarDragStart(e, 'heading')}
          >
            + Heading
          </div>

          <div
            className="p-2 bg-gray-50 border border-gray-200 rounded-md mb-2 cursor-grab hover:bg-gray-100 transition-colors"
            draggable
            onDragStart={(e) => onSidebarDragStart(e, 'paragraph')}
          >
            + Paragraph
          </div>

          <div
            className="p-2 bg-gray-50 border border-gray-200 rounded-md mb-2 cursor-grab hover:bg-gray-100 transition-colors"
            draggable
            onDragStart={(e) => onSidebarDragStart(e, 'image')}
          >
            + Image
          </div>

          <div className="mt-4 text-gray-500 text-xs">
            Drag a block from the left onto the canvas to add it. Drag within the canvas to reorder.
          </div>
        </div>

        {/* Main Editor */}
        <div
          className={`flex-1 p-5 overflow-auto flex flex-col items-center`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e)}
          style={{ height: '100%' }}
        >
          {/* View Mode Switcher (moved here) */}
          <div className="flex gap-2 items-center mb-4">
            <button
              className={`p-2 rounded-full border ${
                viewMode === 'website' ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'
              } hover:bg-blue-50 transition-colors`}
              onClick={() => setViewMode('website')}
              title="Website View"
            >
              <img src="/website.svg" alt="Website" className="w-6 h-6" />
            </button>
            <button
              className={`p-2 rounded-full border ${
                viewMode === 'mobile' ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'
              } hover:bg-blue-50 transition-colors`}
              onClick={() => setViewMode('mobile')}
              title="Mobile View"
            >
              <img src="/mobile.svg" alt="Mobile" className="w-6 h-6" />
            </button>
          </div>
          <div
            className={`bg-white p-5 rounded-lg min-h-96 border border-gray-200 w-full ${
              viewMode === 'mobile' ? 'max-w-xs' : 'max-w-3xl'
            }`}
            style={viewMode === 'mobile' ? { minHeight: '600px' } : {}}
          >
            {blocks.length === 0 && (
              <div className="p-6 border border-dashed border-gray-300 rounded-md text-center text-gray-500 mb-3">
                Drop blocks here or use the + Add Block menu below
              </div>
            )}

            {blocks.map((b, i) => (
              <div
                key={b.id}
                draggable={!preview}
                onDragStart={(e) => onCanvasDragStart(e, i, b.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, i)}
                className="relative border border-gray-200 p-3 rounded-md mb-3 bg-blue-50/30 hover:border-gray-300 transition-colors"
              >
                {/* Action Bar */}
                {!preview && (
                  <div className="absolute -top-9 right-1.5 flex gap-1.5">
                    <button
                      className="px-2 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs transition-colors"
                      onClick={() => moveBlock(b.id, 'up')}
                    >
                      ↑
                    </button>
                    <button
                      className="px-2 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs transition-colors"
                      onClick={() => moveBlock(b.id, 'down')}
                    >
                      ↓
                    </button>
                    <button
                      className="px-2 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs transition-colors"
                      onClick={() => setInspecting(b)}
                      title="Inspect"
                    >
                      ⚙
                    </button>
                    <button
                      className="px-2 py-1.5 rounded-md border border-gray-300 bg-red-50 hover:bg-red-100 text-xs transition-colors"
                      onClick={() => deleteBlock(b.id)}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Block Content */}
                {b.type === 'heading' && (
                  <div>
                    <div className="mb-1.5 text-gray-500 text-xs">Heading</div>
                    <div>
                      <input
                        className={`w-full px-2.5 py-2 rounded-md border border-gray-300 ${
                          b.level === 1 ? 'text-xl' : b.level === 2 ? 'text-lg' : 'text-base'
                        } font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        disabled={preview}
                        value={b.content || ''}
                        onChange={(e) => updateBlock(b.id, { content: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {b.type === 'paragraph' && (
                  <div>
                    <div className="mb-1.5 text-gray-500 text-xs">Paragraph</div>
                    <textarea
                      className="w-full min-h-20 px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      disabled={preview}
                      value={b.content || ''}
                      onChange={(e) => updateBlock(b.id, { content: e.target.value })}
                    />
                  </div>
                )}

                {b.type === 'image' && (
                  <div>
                    <div className="mb-1.5 text-gray-500 text-xs">Image</div>

                    {!preview && (
                      <div className="mb-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file, b.id);
                          }}
                        />
                      </div>
                    )}

                    {b.content ? (
                      <img
                        src={b.content}
                        alt={b.alt || ''}
                        className="max-w-full block"
                        style={{ width: b.width ? `${b.width}px` : 'auto' }}
                      />
                    ) : (
                      <div className="p-3 border border-dashed border-gray-300 rounded-md text-gray-500">
                        No image selected
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add Block Button */}
            {!preview && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <button
                    className="px-3.5 py-2.5 rounded-md border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    onClick={() => setShowAddMenu((s) => !s)}
                    aria-expanded={showAddMenu}
                  >
                    + Add Block
                  </button>

                  {showAddMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg min-w-40 z-10">
                      <div
                        className="px-2.5 py-2 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          addBlock('heading');
                          setShowAddMenu(false);
                        }}
                      >
                        Heading
                      </div>
                      <div
                        className="px-2.5 py-2 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          addBlock('paragraph');
                          setShowAddMenu(false);
                        }}
                      >
                        Paragraph
                      </div>
                      <div
                        className="px-2.5 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          addBlock('image');
                          setShowAddMenu(false);
                        }}
                      >
                        Image
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inspector Panel */}
        {inspecting && (
          <div className="w-75 border-l border-gray-200 p-4 bg-white flex flex-col" style={{ height: '100%' }}>
            <div className="flex justify-between items-center">
              <strong>Customize</strong>
              <button
                className="border-none bg-white hover:bg-gray-50 cursor-pointer text-base p-1 rounded transition-colors"
                onClick={() => setInspecting(null)}
              >
                ✕
              </button>
            </div>

            <div className="mt-3">
              <div className="mb-2 text-gray-700">Type: {inspecting.type}</div>

              {inspecting.type === 'heading' && (
                <>
                  <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Level</label>
                  <select
                    value={inspecting.level}
                    onChange={(e) => updateBlock(inspecting.id, { level: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                  </select>

                  <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Text</label>
                  <input
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={inspecting.content}
                    onChange={(e) => updateBlock(inspecting.id, { content: e.target.value })}
                  />
                </>
              )}

              {inspecting.type === 'paragraph' && (
                <>
                  <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Text</label>
                  <textarea
                    className="w-full min-h-20 px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    value={inspecting.content}
                    onChange={(e) => updateBlock(inspecting.id, { content: e.target.value })}
                  />
                </>
              )}

              {inspecting.type === 'image' && (
                <>
                  <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Alt text</label>
                  <input
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={inspecting.alt || ''}
                    onChange={(e) => updateBlock(inspecting.id, { alt: e.target.value })}
                  />

                  <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Width (px)</label>
                  <input
                    type="number"
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={inspecting.width ?? ''}
                    onChange={(e) => updateBlock(inspecting.id, { width: Number(e.target.value) || undefined })}
                  />

                  <div className="mt-2">
                    <small className="text-gray-500">To change the image, use the file input on the block.</small>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

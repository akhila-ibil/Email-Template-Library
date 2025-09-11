'use client';

import AddBlockMenu from '@/component/BlockMenu/BlockMenu';
import Customize from '@/component/Customize/Customize';
import Navbar from '@/component/Navbar/Navbar';
import Sidebar from '@/component/Sidebar/Sidebar';
import React, { JSX, useEffect, useState } from 'react';

export type Block = {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'spacer';
  level?: number; // for heading
  content?: string; // text or dataURL
  alt?: string; // image alt
  width?: number; // image width in px
  url?: string; // buttonDragStartURL
  backgroundColor?: string; // button background color
  textColor?: string; // button text color
  thickness?: number; // divider thickness
  dividerColor?: string; // divider color
  spacerHeight?: number; // spacer height
  // New style fields for advanced customization
  alignment?: 'left' | 'center' | 'right';
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
  lineHeight?: number;
  margin?: number;
  borderRadius?: number;
  padding?: number;
};
export default function TailwindEmailBuilder(): JSX.Element {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [preview, setPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'website' | 'mobile'>('website');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [inspecting, setInspecting] = useState<Block | null>(null);
  const [savedBlocks] = useState<Block[]>([]);
  const [globalStyle, setGlobalStyle] = useState({
    backdropColor: '#F2F5F7',
    canvasColor: '#FFFFFF',
    canvasBorderColor: '#e5e7eb',
    canvasBorderRadius: 8,
    textColor: '#242424',
    fontFamily: 'Inter, Arial, sans-serif',
    padding: 20,
  });
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
      content:
        type === 'heading'
          ? 'New Heading'
          : type === 'paragraph'
          ? 'New paragraph text...'
          : type === 'button'
          ? 'Click Me'
          : '',
      url: type === 'button' ? 'https://example.com' : undefined,
      backgroundColor: type === 'button' ? '#007bff' : undefined,
      textColor: type === 'button' ? '#ffffff' : undefined,
      thickness: type === 'divider' ? 1 : undefined,
      dividerColor: type === 'divider' ? '#e5e7eb' : undefined,
      spacerHeight: type === 'spacer' ? 20 : undefined,
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
          return `<h${level} style="font-weight: bold; margin-bottom: 1rem; color: ${globalStyle.textColor}; ${
            b.level === 1 ? 'font-size: 1.5rem;' : b.level === 2 ? 'font-size: 1.25rem;' : 'font-size: 1.125rem;'
          }">${escapeHtml(b.content || '')}</h${level}>`;
        }
        if (b.type === 'paragraph') {
          return `<p style="margin-bottom: 1rem; line-height: 1.625; color: ${globalStyle.textColor};">${escapeHtml(
            b.content || ''
          )}</p>`;
        }
        if (b.type === 'image') {
          const w = b.width ? ` width="${b.width}"` : '';
          const alt = b.alt ? ` alt="${escapeHtml(b.alt)}"` : ' alt=""';
          return `<img src="${b.content || ''}"${alt}${w} />`;
        }
        if (b.type === 'button') {
          // FIXED: Added display: block and margin-bottom to ensure buttons appear on separate lines
          const style = `background-color: ${b.backgroundColor || '#007bff'}; color: ${
            b.textColor || '#ffffff'
          }; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: block; border: none; cursor: pointer; font-weight: 500; word-wrap: break-word; white-space: normal; max-width: fit-content; margin-bottom: 10px;`;
          return `<a href="${b.url || '#'}" style="${style}">${escapeHtml(b.content || 'Button')}</a>`;
        }
        if (b.type === 'divider') {
          const style = `height: ${b.thickness || 1}px; background-color: ${
            b.dividerColor || '#e5e7eb'
          }; border: none; margin: 20px 0;`;
          return `<hr style="${style}" />`;
        }
        if (b.type === 'spacer') {
          const style = `height: ${b.spacerHeight || 20}px;`;
          return `<div style="${style}"></div>`;
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
    <div
      className="min-h-screen"
      style={{
        background: globalStyle.backdropColor,
        color: globalStyle.textColor,
        fontFamily: globalStyle.fontFamily,
      }}
    >
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
        <Sidebar
          onTemplateSelect={(blocks) => {
            setBlocks(
              blocks.map((b, i) => ({
                ...b,
                id: Date.now().toString() + '-' + i,
              }))
            );
          }}
        />
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
            className={`min-h-96 w-full ${viewMode === 'mobile' ? 'max-w-xs' : 'max-w-3xl'}`}
            style={{
              background: globalStyle.canvasColor,
              color: globalStyle.textColor,
              fontFamily: globalStyle.fontFamily,
              padding: globalStyle.padding,
              border: `1px solid ${globalStyle.canvasBorderColor || '#e5e7eb'}`,
              borderRadius: globalStyle.canvasBorderRadius ?? 0,
              ...(viewMode === 'mobile' ? { minHeight: '600px' } : {}),
            }}
          >
            {preview ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: exportHTML() }} />
            ) : (
              <>
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
                    className={`relative p-3 rounded-md mb-3 bg-blue-50/30 hover:border-gray-300 transition-colors ${
                      inspecting?.id === b.id ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={() => {
                      if (!preview) setInspecting(b);
                    }}
                    style={{ cursor: !preview ? 'pointer' : undefined }}
                  >
                    {/* Action Bar: Only show when this block is selected (inspecting) and not in preview */}
                    {!preview && inspecting?.id === b.id && (
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
                        {/* Removed Inspect icon button, block is now clickable to select */}
                        <button
                          className="px-2 py-1.5 rounded-md border border-gray-300 bg-red-50 hover:bg-red-100 text-xs transition-colors"
                          onClick={() => deleteBlock(b.id)}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Block Content */}

                    {/* Heading Block */}
                    {b.type === 'heading' && (
                      <div>
                        <input
                          className={`w-full px-2.5 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          disabled={preview}
                          value={b.content || ''}
                          onChange={(e) => updateBlock(b.id, { content: e.target.value })}
                          style={{
                            textAlign: b.alignment,
                            fontSize: b.fontSize,
                            fontWeight: b.fontWeight,
                            lineHeight: b.lineHeight,
                            margin: b.margin !== undefined ? b.margin : undefined,
                            color: b.textColor,
                          }}
                        />
                      </div>
                    )}

                    {/* Paragraph Block */}
                    {b.type === 'paragraph' && (
                      <div>
                        <textarea
                          className="w-full min-h-20 px-2.5 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                          disabled={preview}
                          value={b.content || ''}
                          onChange={(e) => updateBlock(b.id, { content: e.target.value })}
                          style={{
                            textAlign: b.alignment,
                            fontSize: b.fontSize,
                            lineHeight: b.lineHeight,
                            margin: b.margin !== undefined ? b.margin : undefined,
                            color: b.textColor,
                          }}
                        />
                      </div>
                    )}

                    {/* Image Block */}
                    {b.type === 'image' && (
                      <div>
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
                            style={{
                              width: b.width ? `${b.width}px` : 'auto',
                              borderRadius: b.borderRadius,
                              margin: b.margin !== undefined ? b.margin : undefined,
                              display: b.alignment === 'center' ? 'block' : undefined,
                              marginLeft:
                                b.alignment === 'center' ? 'auto' : b.alignment === 'right' ? 'auto' : undefined,
                              marginRight:
                                b.alignment === 'center' ? 'auto' : b.alignment === 'left' ? 'auto' : undefined,
                            }}
                          />
                        ) : (
                          <div className="p-3 border border-dashed border-gray-300 rounded-md text-gray-500">
                            No image selected
                          </div>
                        )}
                      </div>
                    )}

                    {/* Button Block */}
                    {b.type === 'button' && (
                      <div>
                        {preview ? (
                          <button
                            className="px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity cursor-pointer inline-block"
                            style={{
                              backgroundColor: b.backgroundColor,
                              color: b.textColor,
                              borderRadius: b.borderRadius,
                              padding: b.padding,
                              fontSize: b.fontSize,
                              fontWeight: b.fontWeight,
                              margin: b.margin !== undefined ? b.margin : undefined,
                            }}
                            onClick={() => window.open(b.url, '_blank')}
                          >
                            {b.content || 'Button'}
                          </button>
                        ) : (
                          <a
                            href={b.url || '#'}
                            contentEditable
                            suppressContentEditableWarning
                            className="email-button"
                            onBlur={(e) => updateBlock(b.id, { content: e.currentTarget.innerText })}
                            style={{
                              backgroundColor: b.backgroundColor,
                              color: b.textColor,
                              borderRadius: b.borderRadius,
                              padding: b.padding,
                              fontSize: b.fontSize,
                              fontWeight: b.fontWeight,
                              margin: b.margin !== undefined ? b.margin : undefined,
                            }}
                          >
                            {b.content || 'Button'}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Divider Block */}
                    {b.type === 'divider' && (
                      <div>
                        <hr
                          style={{
                            height: b.thickness,
                            backgroundColor: b.dividerColor,
                            border: 'none',
                            margin: b.margin !== undefined ? b.margin : undefined,
                          }}
                        />
                      </div>
                    )}

                    {/* Spacer Block */}
                    {b.type === 'spacer' && (
                      <div>
                        <div
                          className="bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 text-sm"
                          style={{
                            height: b.spacerHeight,
                            margin: b.margin !== undefined ? b.margin : undefined,
                          }}
                        >
                          {!preview && `${b.spacerHeight || 20}px`}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Block Button */}
                {!preview && (
                  <div className=" flex justify-center mt-4">
                    <div className="relative inline-block">
                      <div className="flex ">
                        <button
                          className="px-3.5 py-2.5 rounded-md border hover:bg-gray-100 border-gray-300  text-center text-gray-500 transition-colors"
                          onClick={() => setShowAddMenu((s) => !s)}
                          aria-expanded={showAddMenu}
                        >
                          +
                        </button>
                      </div>

                      {showAddMenu && (
                        <AddBlockMenu addBlock={addBlock} show={showAddMenu} onClose={() => setShowAddMenu(false)} />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* Inspector Panel */}
        <Customize
          block={inspecting}
          updateBlock={updateBlock}
          close={() => setInspecting(null)}
          globalStyle={globalStyle}
          setGlobalStyle={setGlobalStyle}
        />
      </div>
    </div>
  );
}

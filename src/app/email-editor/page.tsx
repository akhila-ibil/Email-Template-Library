'use client';

import AddBlockMenu from '@/component/BlockMenu/BlockMenu';
import Customize from '@/component/Customize/Customize';
import MainEditorCanvas from '@/component/MainEditorCanvas/MainEditorCanvas';
import Navbar from '@/component/Navbar/Navbar';
import Sidebar from '@/component/Sidebar/Sidebar';
import React, { JSX, useEffect, useState } from 'react';

export type Block = {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'spacer' | 'container' | 'columns';
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
  alignment?: 'left' | 'center' | 'right';
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
  lineHeight?: number;
  margin?: number;
  borderRadius?: number;
  padding?: number;
  borderColor?: string;
  borderWidth?: number;
  columnCount?: number; // for columns block
  columnGap?: number;
  columns?: Block[][]; // only for type === 'columns'
  children?: Block[];
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
  const addBlock = (type: Block['type'], insertAt?: number, parentId?: string, columnIndex?: number) => {
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
      backgroundColor: type === 'button' ? '#007bff' : type === 'container' ? '#ffffff' : undefined,
      textColor: type === 'button' ? '#ffffff' : undefined,
      thickness: type === 'divider' ? 1 : undefined,
      dividerColor: type === 'divider' ? '#e5e7eb' : undefined,
      spacerHeight: type === 'spacer' ? 20 : undefined,
      borderColor: type === 'container' || type === 'columns' ? '#ffffff' : undefined,
      borderWidth: type === 'container' || type === 'columns' ? 1 : undefined,
      padding: type === 'container' || type === 'columns' ? 16 : undefined,
      columnCount: type === 'columns' ? 2 : undefined,
      columnGap: type === 'columns' ? 16 : undefined,
      columns: type === 'columns' ? Array.from({ length: 2 }, () => []) : undefined,
      children: type === 'container' ? [] : undefined,
    };

    if (parentId) {
      setBlocks((prev) => addToNested(prev, parentId, newBlock, insertAt, columnIndex));
    } else {
      const copy = [...blocks];
      if (insertAt !== undefined) copy.splice(insertAt, 0, newBlock);
      else copy.push(newBlock);
      setBlocks(copy);
    }
  };

  const addToNested = (
    blocks: Block[],
    parentId: string,
    newBlock: Block,
    insertAt?: number,
    columnIndex?: number
  ): Block[] =>
    blocks.map((block) => {
      if (block.id === parentId) {
        if (block.type === 'columns' && columnIndex !== undefined) {
          const columns = block.columns ? [...block.columns] : [];
          if (!columns[columnIndex]) columns[columnIndex] = [];
          const col = [...columns[columnIndex]];

          if (insertAt !== undefined) col.splice(insertAt, 0, newBlock);
          else col.push(newBlock);

          columns[columnIndex] = col;
          return { ...block, columns };
        } else {
          const children = block.children ? [...block.children] : [];
          if (insertAt !== undefined) children.splice(insertAt, 0, newBlock);
          else children.push(newBlock);
          return { ...block, children };
        }
      }
      // Recursively search in children and columns
      if (block.children) {
        return {
          ...block,
          children: addToNested(block.children, parentId, newBlock, insertAt, columnIndex),
        };
      }

      if (block.columns) {
        return {
          ...block,
          columns: block.columns.map((col) => addToNested(col, parentId, newBlock, insertAt, columnIndex)),
        };
      }

      return block;
    });

  const updateBlock = (id: string, changes: Partial<Block>) => {
    const updateNested = (blocks: Block[]): Block[] =>
      blocks.map((block) => {
        if (block.id === id) return { ...block, ...changes };

        if (block.children) {
          return { ...block, children: updateNested(block.children) };
        }

        if (block.columns) {
          return {
            ...block,
            columns: block.columns.map((col) => updateNested(col)),
          };
        }

        return block;
      });

    setBlocks(updateNested);
    if (inspecting?.id === id) {
      setInspecting((p) => (p ? { ...p, ...changes } : p));
    }
  };

  const deleteBlock = (id: string) => {
    const deleteFromNested = (blocks: Block[]): Block[] =>
      blocks.reduce((acc: Block[], block) => {
        if (block.id === id) return acc;

        if (block.children) {
          return [...acc, { ...block, children: deleteFromNested(block.children) }];
        }

        if (block.columns) {
          return [
            ...acc,
            {
              ...block,
              columns: block.columns.map((col) => deleteFromNested(col)),
            },
          ];
        }

        return [...acc, block];
      }, []);

    setBlocks(deleteFromNested);
    if (inspecting?.id === id) setInspecting(null);
  };

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    const moveInNested = (blocks: Block[]): Block[] => {
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx !== -1) {
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (swapIdx >= 0 && swapIdx < blocks.length) {
          const arr = [...blocks];
          [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
          return arr;
        }
        return blocks;
      }

      return blocks.map((block) => {
        if (block.children) {
          return { ...block, children: moveInNested(block.children) };
        }

        if (block.columns) {
          return {
            ...block,
            columns: block.columns.map((col) => moveInNested(col)),
          };
        }

        return block;
      });
    };

    setBlocks(moveInNested);
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
  // Replace the existing exportHTML function with this improved version
  const exportHTML = () => {
    const renderBlockToHTML = (block: Block): string => {
      if (block.type === 'heading') {
        const level = Math.min(3, Math.max(1, block.level || 1));
        const fontSize = block.fontSize || (block.level === 1 ? 32 : block.level === 2 ? 24 : 20);
        const style = `
        font-weight: ${block.fontWeight || 'bold'};
        margin: ${block.margin || 0}px 0;
        color: ${block.textColor || globalStyle.textColor};
        font-size: ${fontSize}px;
        text-align: ${block.alignment || 'left'};
        line-height: ${block.lineHeight || 1.2};
        font-family: ${globalStyle.fontFamily};
        border-radius: ${block.borderRadius || 0}px;
        padding: ${block.padding || 0}px;
      `.trim();
        return `<h${level} style="${style}">${escapeHtml(block.content || '')}</h${level}>`;
      }

      if (block.type === 'paragraph') {
        const contentWithBreaks = escapeHtml(block.content || '').replace(/\n/g, '<br>');
        const style = `
        margin: ${block.margin || 0}px 0 1rem 0;
        line-height: ${block.lineHeight || 1.5};
        color: ${block.textColor || globalStyle.textColor};
        font-size: ${block.fontSize || 16}px;
        text-align: ${block.alignment || 'left'};
        font-weight: ${block.fontWeight || 'normal'};
        font-family: ${globalStyle.fontFamily};
        padding: ${block.padding || 0}px;
        border-radius: ${block.borderRadius || 0}px;
      `.trim();
        return `<p style="${style}">${contentWithBreaks}</p>`;
      }

      if (block.type === 'image') {
        const style = `
        width: ${block.width ? `${block.width}px` : 'auto'};
        border-radius: ${block.borderRadius || 0}px;
        max-width: 100%;
        height: auto;
        display: block;
        margin: ${block.margin || 0}px auto;
      `.trim();
        const containerStyle = `text-align: ${block.alignment || 'center'}; margin: ${block.margin || 0}px 0;`;
        return `<div style="${containerStyle}"><img src="${block.content || ''}" alt="${escapeHtml(
          block.alt || ''
        )}" style="${style}" /></div>`;
      }

      if (block.type === 'button') {
        const style = `
        background-color: ${block.backgroundColor || '#007bff'};
        color: ${block.textColor || '#ffffff'};
        padding: ${block.padding || 12}px 24px;
        text-decoration: none;
        border-radius: ${block.borderRadius || 4}px;
        display: inline-block;
        border: none;
        cursor: pointer;
        font-weight: ${block.fontWeight || '500'};
        font-size: ${block.fontSize || 16}px;
        font-family: ${globalStyle.fontFamily};
        margin: ${block.margin || 0}px 0;
        word-wrap: break-word;
        white-space: normal;
      `.trim();
        const containerStyle = `text-align: ${block.alignment || 'left'}; margin: ${block.margin || 0}px 0;`;
        return `<div style="${containerStyle}"><a href="${block.url || '#'}" style="${style}">${escapeHtml(
          block.content || 'Button'
        )}</a></div>`;
      }

      if (block.type === 'divider') {
        const style = `
        height: ${block.thickness || 1}px;
        background-color: ${block.dividerColor || '#e5e7eb'};
        border: none;
        margin: ${block.margin || 20}px 0;
      `.trim();
        return `<hr style="${style}" />`;
      }

      if (block.type === 'spacer') {
        const style = `
        height: ${block.spacerHeight || 20}px;
        margin: ${block.margin || 0}px 0;
      `.trim();
        return `<div style="${style}"></div>`;
      }

      if (block.type === 'container') {
        const containerStyle = `
        background-color: ${block.backgroundColor || 'transparent'};
        border-color: ${block.borderColor || '#e5e7eb'};
        border-width: ${block.borderWidth || 1}px;
        border-style: solid;
        border-radius: ${block.borderRadius || 4}px;
        padding: ${block.padding || 16}px;
        margin: ${block.margin || 0}px 0;
        min-height: 24px;
      `.trim();

        const childrenHTML = block.children ? block.children.map((child) => renderBlockToHTML(child)).join('\n') : '';
        return `<div style="${containerStyle}">${childrenHTML}</div>`;
      }

      if (block.type === 'columns') {
        const containerStyle = `
        background-color: ${block.backgroundColor || '#ffffff'};
        ${
          block.borderColor && block.borderWidth
            ? `border-color: ${block.borderColor}; border-width: ${block.borderWidth}px; border-style: solid;`
            : 'border: none;'
        }
        border-radius: ${block.borderRadius || 4}px;
        padding: ${block.padding || 16}px;
        margin: ${block.margin || 0}px 0;
        display: grid;
        grid-template-columns: repeat(${block.columnCount || 2}, 1fr);
        gap: ${block.columnGap || 16}px;
        min-height: 80px;
      `.trim();

        const columnsHTML = Array.from({ length: block.columnCount || 2 })
          .map((_, colIndex) => {
            const columnChildren = block.columns?.[colIndex] || [];
            const childrenHTML = columnChildren.map((child) => renderBlockToHTML(child)).join('\n');
            return `<div style="min-height: 80px;">${childrenHTML}</div>`;
          })
          .join('\n');

        return `<div style="${containerStyle}">${columnsHTML}</div>`;
      }

      return '';
    };

    const html = blocks.map(renderBlockToHTML).join('\n');
    return `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body style="margin: 0; padding: 20px; background-color: ${globalStyle.canvasColor}; color: ${globalStyle.textColor}; font-family: ${globalStyle.fontFamily};">\n${html}\n</body>\n</html>`;
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
  const AddButton = ({
    onAdd,
    parentId,
    columnIndex,
  }: {
    onAdd: (type: Block['type'], insertAt?: number, parentId?: string, columnIndex?: number) => void;
    parentId?: string;
    columnIndex?: number;
  }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="relative inline-block">
        <button
          className="px-3.5 py-2.5 rounded-md border hover:bg-gray-100 border-gray-300  text-center text-gray-500 transition-colors"
          onClick={() => setShowMenu(!showMenu)}
        >
          +
        </button>
        {showMenu && (
          <AddBlockMenu
            addBlock={(type) => {
              onAdd(type, undefined, parentId, columnIndex);
              setShowMenu(false);
            }}
            show={showMenu}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>
    );
  };
  const renderBlock = (block: Block, index: number, isNested = false, parentId?: string) => (
    <div
      key={block.id}
      draggable={!preview}
      onClick={(e) => {
        e.stopPropagation();
        setInspecting(block);
      }}
      onDragStart={(e) => onCanvasDragStart(e, index, block.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, index)}
      className={`relative p-3 rounded-md mb-3 ${
        isNested ? 'bg-gray-50/30' : 'bg-blue-50/30'
      } hover:border-gray-300 transition-colors ${inspecting?.id === block.id ? 'ring-2 ring-blue-400' : ''}`}
      style={{ cursor: !preview ? 'pointer' : undefined }}
    >
      {/* Action Bar */}
      {!preview && inspecting?.id === block.id && (
        <div className="absolute -top-9 right-1.5 flex gap-1.5">
          <button
            className="px-2 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs transition-colors"
            onClick={() => moveBlock(block.id, 'up')}
          >
            ↑
          </button>
          <button
            className="px-2 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs transition-colors"
            onClick={() => moveBlock(block.id, 'down')}
          >
            ↓
          </button>
          <button
            className="px-2 py-1.5 rounded-md border border-gray-300 bg-red-50 hover:bg-red-100 text-xs transition-colors"
            onClick={() => deleteBlock(block.id)}
          >
            ✕
          </button>
        </div>
      )}
      {block.type === 'heading' && (
        <input
          className="w-full px-2.5 py-2 rounded-md  focus:outline-none  focus:border-transparent"
          value={block.content || ''}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          style={{
            textAlign: block.alignment || 'left',
            fontSize: `${block.fontSize || (block.level === 1 ? 32 : block.level === 2 ? 24 : 20)}px`,
            fontWeight: block.fontWeight || 'bold',
            lineHeight: block.lineHeight || 1.2,
            color: block.textColor || globalStyle.textColor,
            fontFamily: globalStyle.fontFamily,
            backgroundColor: 'transparent',
          }}
        />
      )}

      {/* Paragraph Block */}
      {block.type === 'paragraph' && (
        <textarea
          className="w-full min-h-20 px-2.5 py-2 rounded-md focus:outline-none focus:border-transparent resize-y"
          value={block.content || ''}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          style={{
            textAlign: block.alignment || 'left',
            fontSize: `${block.fontSize || 16}px`,
            lineHeight: block.lineHeight || 1.5,
            color: block.textColor || globalStyle.textColor,
            fontFamily: globalStyle.fontFamily,
            backgroundColor: 'transparent',
          }}
        />
      )}

      {/* Image Block */}
      {block.type === 'image' && (
        <div style={{ margin: `${block.margin || 0}px 0` }}>
          {!preview && (
            <div className="mb-2">
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file, block.id);
                }}
              />
            </div>
          )}

          {block.content ? (
            <div style={{ textAlign: block.alignment || 'center' }}>
              <img
                src={block.content}
                alt={block.alt || ''}
                style={{
                  width: block.width ? `${block.width}px` : 'auto',
                  borderRadius: `${block.borderRadius || 0}px`,
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'inline-block',
                }}
              />
            </div>
          ) : (
            <div className="p-3 border border-dashed border-gray-300 rounded-md text-gray-500">No image selected</div>
          )}
        </div>
      )}
      {block.type === 'button' && (
        <div
          style={{
            textAlign: block.alignment || 'left',
            margin: `${block.margin || 0}px 0`,
          }}
        >
          {preview ? (
            <button
              className="px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity cursor-pointer inline-block"
              style={{
                backgroundColor: block.backgroundColor,
                color: block.textColor,
                borderRadius: block.borderRadius,
                padding: block.padding,
                fontSize: block.fontSize,
                fontWeight: block.fontWeight,
                margin: block.margin !== undefined ? block.margin : undefined,
              }}
              onClick={() => window.open(block.url, '_blank')}
            >
              {block.content || 'Button'}
            </button>
          ) : (
            <a
              href={block.url || '#'}
              contentEditable
              suppressContentEditableWarning
              className="email-button"
              onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.innerText })}
              style={{
                backgroundColor: block.backgroundColor,
                color: block.textColor,
                borderRadius: block.borderRadius,
                padding: block.padding,
                fontSize: block.fontSize,
                fontWeight: block.fontWeight,
                fontFamily: globalStyle.fontFamily,
                margin: block.margin !== undefined ? block.margin : undefined,
              }}
            >
              {block.content || 'Button'}
            </a>
          )}
        </div>
      )}

      {/* Divider Block */}
      {block.type === 'divider' && (
        <hr
          style={{
            height: `${block.thickness || 1}px`,
            backgroundColor: block.dividerColor || '#e5e7eb',
            border: 'none',
            margin: `${block.margin || 20}px 0`,
          }}
        />
      )}

      {block.type === 'spacer' && (
        <div
          style={{
            height: `${block.spacerHeight || 20}px`,
            margin: `${block.margin || 0}px 0`,
          }}
        >
          {!preview && (
            <div
              className="bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 text-sm"
              style={{ height: '100%' }}
            >
              {`${block.spacerHeight || 20}px spacer`}
            </div>
          )}
        </div>
      )}
      {/* Container Block */}
      {block.type === 'container' && (
        <div>
          <div
            className="min-h-24 rounded-md "
            style={{
              backgroundColor: block.backgroundColor || 'transparent',
              borderColor: block.borderColor || '#e5e7eb',
              borderWidth: `${block.borderWidth || 1}px`,
              borderStyle: 'solid',
              borderRadius: `${block.borderRadius || 4}px`,
              padding: `${block.padding || 16}px`,
              margin: `${block.margin || 0}px 0`,
            }}
          >
            <div className="border border-dashed border-gray-300 rounded p-2 m-1">
              {block.children && block.children.length > 0 ? (
                <>
                  {block.children.map((child, childIndex) => renderBlock(child, childIndex, true, block.id))}
                  {!preview && (
                    <div className="flex justify-center mt-4 ">
                      <AddButton onAdd={addBlock} parentId={block.id} />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 py-8 ">
                  <p className="mb-4">Empty container - click + to add content</p>
                  {!preview && <AddButton onAdd={addBlock} parentId={block.id} />}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Columns Block */}

      {block.type === 'columns' && (
        <div>
          <div
            className="min-h-24 rounded-md"
            style={{
              backgroundColor: block.backgroundColor || 'transparent',
              borderColor: block.borderColor || '#e5e7eb',
              borderWidth: `${block.borderWidth || 1}px`,
              borderStyle: 'solid',
              borderRadius: `${block.borderRadius || 4}px`,
              padding: `${block.padding || 16}px`,
              margin: `${block.margin || 0}px 0`,
              display: 'grid',
              gridTemplateColumns: `repeat(${block.columnCount || 2}, 1fr)`,
              gap: `${block.columnGap || 16}px`,
            }}
          >
            {Array.from({ length: block.columnCount || 2 }).map((_, colIndex) => {
              const columnChildren = block.columns?.[colIndex] || [];

              return (
                <div
                  key={colIndex}
                  className="min-h-20 border border-dashed border-gray-300 rounded p-2"
                  style={{ minHeight: '80px' }}
                >
                  {columnChildren.length > 0 ? (
                    <>
                      {columnChildren.map((child, childIndex) => renderBlock(child, childIndex, true, block.id))}
                      {!preview && (
                        <div className="flex justify-center mt-2">
                          <AddButton onAdd={addBlock} parentId={block.id} columnIndex={colIndex} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-400 py-4 h-full flex flex-col justify-center">
                      <p className="mb-2 text-xs">Column {colIndex + 1}</p>
                      {!preview && <AddButton onAdd={addBlock} parentId={block.id} columnIndex={colIndex} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
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

        {/* Main editor canvas */}
        <MainEditorCanvas
          setViewMode={setViewMode}
          blocks={blocks}
          preview={preview}
          viewMode={viewMode}
          globalStyle={globalStyle}
          showAddMenu={showAddMenu}
          setShowAddMenu={setShowAddMenu}
          renderBlock={renderBlock}
          handleDrop={handleDrop}
          exportHTML={exportHTML}
          addBlock={addBlock}
        />

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

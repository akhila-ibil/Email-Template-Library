import { Block } from '@/app/email-editor/page';
import React, { useState, JSX } from 'react';

interface InspectorProps {
  block: Block | null;
  updateBlock: (id: string, changes: Partial<Block>) => void;
  close: () => void;
  globalStyle: {
    backdropColor: string;
    canvasColor: string;
    canvasBorderColor?: string;
    canvasBorderRadius?: number;
    textColor: string;
    fontFamily: string;
    padding: number;
  };
  setGlobalStyle: (style: any) => void;
}

const fontOptions = [
  { label: 'Modern Sans', value: 'Inter, Arial, sans-serif' },
  { label: 'Classic Serif', value: 'Georgia, Times, serif' },
  { label: 'Mono', value: 'Menlo, Monaco, monospace' },
];

const alignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];
const fontWeightOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Bold', value: 'bold' },
  { label: 'Bolder', value: 'bolder' },
  { label: 'Lighter', value: 'lighter' },
];

const Customize: React.FC<InspectorProps> = ({ block, updateBlock, close, globalStyle, setGlobalStyle }) => {
  const [tab, setTab] = useState<'customize' | 'style'>('style');
  // Helper for block style fields
  const blockField = (label: string, input: JSX.Element) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {input}
    </div>
  );
  return (
    <div className="w-75 border-l border-gray-200 p-0 bg-white flex flex-col" style={{ height: '100%' }}>
      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            tab === 'style' ? 'border-b-2 border-blue-500 text-blue-600 bg-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setTab('style')}
        >
          Style
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            tab === 'customize'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setTab('customize')}
        >
          Customize
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {tab === 'style' ? (
          <>
            {blockField(
              'Backdrop Color',
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
                value={globalStyle.backdropColor}
                onChange={(e) => setGlobalStyle({ ...globalStyle, backdropColor: e.target.value })}
              />
            )}
            {blockField(
              'Canvas Color',
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
                value={globalStyle.canvasColor}
                onChange={(e) => setGlobalStyle({ ...globalStyle, canvasColor: e.target.value })}
              />
            )}
            {blockField(
              'Canvas Border Color',
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
                value={globalStyle.canvasBorderColor || '#e5e7eb'}
                onChange={(e) => setGlobalStyle({ ...globalStyle, canvasBorderColor: e.target.value })}
              />
            )}
            {blockField(
              'Canvas Border Radius (px)',
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={globalStyle.canvasBorderRadius || 0}
                min={0}
                max={50}
                onChange={(e) => setGlobalStyle({ ...globalStyle, canvasBorderRadius: parseInt(e.target.value) || 0 })}
              />
            )}
            {blockField(
              'Padding (px)',
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={globalStyle.padding}
                min={0}
                max={100}
                onChange={(e) => setGlobalStyle({ ...globalStyle, padding: parseInt(e.target.value) || 0 })}
              />
            )}
            {blockField(
              'Font Family',
              <select
                className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={globalStyle.fontFamily}
                onChange={(e) => setGlobalStyle({ ...globalStyle, fontFamily: e.target.value })}
              >
                {fontOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            {blockField(
              'Text Color',
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
                value={globalStyle.textColor}
                onChange={(e) => setGlobalStyle({ ...globalStyle, textColor: e.target.value })}
              />
            )}
          </>
        ) : block === null ? (
          <div className="p-4">Select a block to inspect its properties.</div>
        ) : (
          <>
            <div className="mb-2 text-gray-700">{block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block</div>
            {/* Heading Block */}
            {block.type === 'heading' && (
              <>
                {blockField(
                  'Level',
                  <select
                    value={block.level}
                    onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                  </select>
                )}
                {blockField(
                  'Text',
                  <input
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  />
                )}
                {blockField(
                  'Alignment',
                  <select
                    value={block.alignment || 'left'}
                    onChange={(e) =>
                      updateBlock(block.id, { alignment: e.target.value as 'left' | 'center' | 'right' })
                    }
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300"
                  >
                    {alignmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {blockField(
                  'Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.textColor || '#242424'}
                    onChange={(e) => updateBlock(block.id, { textColor: e.target.value })}
                  />
                )}

                {blockField(
                  'Font Weight',
                  <select
                    value={block.fontWeight || 'bold'}
                    onChange={(e) =>
                      updateBlock(block.id, { fontWeight: e.target.value as 'normal' | 'bold' | 'bolder' | 'lighter' })
                    }
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300"
                  >
                    {fontWeightOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {blockField(
                  'Line Height',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.lineHeight || 1.2}
                    min={1}
                    max={2}
                    step={0.1}
                    onChange={(e) => updateBlock(block.id, { lineHeight: parseFloat(e.target.value) || 1.2 })}
                  />
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 0}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 0 })}
                  />
                )}
              </>
            )}
            {/* Paragraph Block */}
            {block.type === 'paragraph' && (
              <>
                {blockField(
                  'Text',
                  <textarea
                    className="w-full min-h-20 px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  />
                )}
                {blockField(
                  'Alignment',
                  <select
                    value={block.alignment || 'left'}
                    onChange={(e) =>
                      updateBlock(block.id, { alignment: e.target.value as 'left' | 'center' | 'right' })
                    }
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300"
                  >
                    {alignmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {blockField(
                  'Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.textColor || '#242424'}
                    onChange={(e) => updateBlock(block.id, { textColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Font Size (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.fontSize || 16}
                    min={10}
                    max={48}
                    onChange={(e) => updateBlock(block.id, { fontSize: parseInt(e.target.value) || 16 })}
                  />
                )}
                {blockField(
                  'Line Height',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.lineHeight || 1.5}
                    min={1}
                    max={2}
                    step={0.1}
                    onChange={(e) => updateBlock(block.id, { lineHeight: parseFloat(e.target.value) || 1.5 })}
                  />
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 0}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 0 })}
                  />
                )}
              </>
            )}
            {/* Image Block */}
            {block.type === 'image' && (
              <>
                {blockField(
                  'Alt text',
                  <input
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={block.alt || ''}
                    onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                  />
                )}
                {blockField(
                  'Width (px)',
                  <input
                    type="number"
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={block.width ?? ''}
                    onChange={(e) => updateBlock(block.id, { width: Number(e.target.value) || undefined })}
                  />
                )}
                {blockField(
                  'Alignment',
                  <select
                    value={block.alignment || 'center'}
                    onChange={(e) =>
                      updateBlock(block.id, { alignment: e.target.value as 'left' | 'center' | 'right' })
                    }
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300"
                  >
                    {alignmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {blockField(
                  'Border Radius (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.borderRadius || 0}
                    min={0}
                    max={50}
                    onChange={(e) => updateBlock(block.id, { borderRadius: parseInt(e.target.value) || 0 })}
                  />
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 0}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 0 })}
                  />
                )}
                <div className="mt-2">
                  <small className="text-gray-500">To change the image, use the file input on the block.</small>
                </div>
              </>
            )}
            {/* Button Block */}
            {block.type === 'button' && (
              <>
                {blockField(
                  'Text',
                  <input
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  />
                )}
                {blockField(
                  'Button URL',
                  <input
                    type="url"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.url || ''}
                    onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                    placeholder="https://example.com"
                  />
                )}
                {blockField(
                  'Alignment',
                  <select
                    value={block.alignment || 'center'}
                    onChange={(e) =>
                      updateBlock(block.id, { alignment: e.target.value as 'left' | 'center' | 'right' })
                    }
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300"
                  >
                    {alignmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {blockField(
                  'Background Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.backgroundColor || '#007bff'}
                    onChange={(e) => updateBlock(block.id, { backgroundColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Text Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.textColor || '#ffffff'}
                    onChange={(e) => updateBlock(block.id, { textColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Border Radius (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.borderRadius || 4}
                    min={0}
                    max={50}
                    onChange={(e) => updateBlock(block.id, { borderRadius: parseInt(e.target.value) || 4 })}
                  />
                )}
                {blockField(
                  'Padding (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.padding || 12}
                    min={0}
                    max={48}
                    onChange={(e) => updateBlock(block.id, { padding: parseInt(e.target.value) || 12 })}
                  />
                )}
                {blockField(
                  'Font Size (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.fontSize || 16}
                    min={10}
                    max={32}
                    onChange={(e) => updateBlock(block.id, { fontSize: parseInt(e.target.value) || 16 })}
                  />
                )}
                {blockField(
                  'Font Weight',
                  <select
                    value={block.fontWeight || 'bold'}
                    onChange={(e) =>
                      updateBlock(block.id, { fontWeight: e.target.value as 'normal' | 'bold' | 'bolder' | 'lighter' })
                    }
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300"
                  >
                    {fontWeightOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 0}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 0 })}
                  />
                )}
              </>
            )}
            {/* Divider Block */}
            {block.type === 'divider' && (
              <>
                {blockField(
                  'Thickness (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.thickness || 1}
                    min={1}
                    max={10}
                    onChange={(e) => updateBlock(block.id, { thickness: parseInt(e.target.value) || 1 })}
                  />
                )}
                {blockField(
                  'Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.dividerColor || '#e5e7eb'}
                    onChange={(e) => updateBlock(block.id, { dividerColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 20}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 20 })}
                  />
                )}
              </>
            )}
            {/* Spacer Block */}
            {block.type === 'spacer' && (
              <>
                {blockField(
                  'Height (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.spacerHeight || 20}
                    min={5}
                    max={200}
                    onChange={(e) => updateBlock(block.id, { spacerHeight: parseInt(e.target.value) || 20 })}
                  />
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 0}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 0 })}
                  />
                )}
              </>
            )}
            {/* Container Block */}
            {block.type === 'container' && (
              <>
                {blockField(
                  'Background Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.backgroundColor || '#f8f9fa'}
                    onChange={(e) => updateBlock(block.id, { backgroundColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Border Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.borderColor || '#e5e7eb'}
                    onChange={(e) => updateBlock(block.id, { borderColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Border Width (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.borderWidth || 1}
                    min={0}
                    max={10}
                    onChange={(e) => updateBlock(block.id, { borderWidth: parseInt(e.target.value) || 1 })}
                  />
                )}
                {blockField(
                  'Border Radius (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.borderRadius || 4}
                    min={0}
                    max={50}
                    onChange={(e) => updateBlock(block.id, { borderRadius: parseInt(e.target.value) || 4 })}
                  />
                )}
                {blockField(
                  'Padding (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.padding || 16}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { padding: parseInt(e.target.value) || 16 })}
                  />
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 0}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 0 })}
                  />
                )}
              </>
            )}

            {/* Columns Block */}
            {block.type === 'columns' && (
              <>
                {blockField(
                  'Number of Columns',
                  <select
                    value={block.columnCount || 2}
                    onChange={(e) => updateBlock(block.id, { columnCount: parseInt(e.target.value) || 2 })}
                    className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 Column</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    {/* <option value={4}>4 Columns</option> */}
                  </select>
                )}
                {blockField(
                  'Column Gap (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.columnGap || 16}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { columnGap: parseInt(e.target.value) || 16 })}
                  />
                )}
                {blockField(
                  'Background Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.backgroundColor || '#ffffff'}
                    onChange={(e) => updateBlock(block.id, { backgroundColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Border Color',
                  <input
                    type="color"
                    className="w-full h-10 border border-gray-300 rounded-md"
                    value={block.borderColor || '#e5e7eb'}
                    onChange={(e) => updateBlock(block.id, { borderColor: e.target.value })}
                  />
                )}
                {blockField(
                  'Border Width (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.borderWidth || 1}
                    min={0}
                    max={10}
                    onChange={(e) => updateBlock(block.id, { borderWidth: parseInt(e.target.value) || 1 })}
                  />
                )}
                {blockField(
                  'Border Radius (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.borderRadius || 4}
                    min={0}
                    max={50}
                    onChange={(e) => updateBlock(block.id, { borderRadius: parseInt(e.target.value) || 4 })}
                  />
                )}
                {blockField(
                  'Padding (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.padding || 16}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { padding: parseInt(e.target.value) || 16 })}
                  />
                )}
                {blockField(
                  'Margin (px)',
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={block.margin || 0}
                    min={0}
                    max={100}
                    onChange={(e) => updateBlock(block.id, { margin: parseInt(e.target.value) || 0 })}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Customize;

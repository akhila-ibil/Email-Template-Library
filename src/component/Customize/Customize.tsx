import { Block } from '@/app/email-editor/page';

type InspectorProps = {
  block: Block;
  updateBlock: (id: string, changes: Partial<Block>) => void;
  close: () => void;
};
const Customize: React.FC<InspectorProps> = ({ block, updateBlock, close }) => {
  return (
    <div className="w-75 border-l border-gray-200 p-4 bg-white flex flex-col" style={{ height: '100%' }}>
      <div className="flex justify-between items-center">
        <strong>Customize</strong>
        <button
          className="border-none bg-white hover:bg-gray-50 cursor-pointer text-base p-1 rounded transition-colors"
          onClick={close}
        >
          ✕
        </button>
      </div>

      <div className="mt-3">
        <div className="mb-2 text-gray-700">Type: {block.type}</div>

        {block.type === 'heading' && (
          <>
            <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Level</label>
            <select
              value={block.level}
              onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) })}
              className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>

            <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Text</label>
            <input
              className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            />
          </>
        )}

        {block.type === 'paragraph' && (
          <>
            <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Text</label>
            <textarea
              className="w-full min-h-20 px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            />
          </>
        )}

        {block.type === 'image' && (
          <>
            <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Alt text</label>
            <input
              className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={block.alt || ''}
              onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
            />

            <label className="block mt-2.5 mb-1.5 text-gray-700 text-sm">Width (px)</label>
            <input
              type="number"
              className="w-full px-2.5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={block.width ?? ''}
              onChange={(e) => updateBlock(block.id, { width: Number(e.target.value) || undefined })}
            />

            <div className="mt-2">
              <small className="text-gray-500">To change the image, use the file input on the block.</small>
            </div>
          </>
        )}
        {block.type === 'button' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
              <input
                type="url"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={block.url || ''}
                onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
                value={block.backgroundColor || '#007bff'}
                onChange={(e) => updateBlock(block.id, { backgroundColor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
                value={block.textColor || '#ffffff'}
                onChange={(e) => updateBlock(block.id, { textColor: e.target.value })}
              />
            </div>
          </div>
        )}

        {block.type === 'divider' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thickness (px)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={block.thickness || 1}
                min="1"
                max="10"
                onChange={(e) => updateBlock(block.id, { thickness: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded-md"
                value={block.dividerColor || '#e5e7eb'}
                onChange={(e) => updateBlock(block.id, { dividerColor: e.target.value })}
              />
            </div>
          </div>
        )}

        {block.type === 'spacer' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={block.spacerHeight || 20}
                min="5"
                max="200"
                onChange={(e) => updateBlock(block.id, { spacerHeight: parseInt(e.target.value) || 20 })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Customize;

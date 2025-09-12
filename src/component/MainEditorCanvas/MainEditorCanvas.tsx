import React from 'react';
import AddBlockMenu from '@/component/BlockMenu/BlockMenu';
import { Block } from '@/app/email-editor/page';

interface MainEditorCanvasProps {
  blocks: Block[];
  preview: boolean;
  viewMode: 'website' | 'mobile';
  globalStyle: any;
  showAddMenu: boolean;
  setShowAddMenu: (show: boolean) => void;
  renderBlock: (block: Block, index: number) => React.ReactNode;
  handleDrop: (e: React.DragEvent) => void;
  setViewMode: (mode: 'website' | 'mobile') => void;
  exportHTML: () => string;
  addBlock: (type: Block['type']) => void;
  htmlPreview?: string | null;
  showHTMLPreview: boolean;
  showJSONPreview: boolean;
}

const MainEditorCanvas: React.FC<MainEditorCanvasProps> = ({
  blocks,
  preview,
  viewMode,
  globalStyle,
  showAddMenu,
  setShowAddMenu,
  renderBlock,
  handleDrop,
  setViewMode,
  exportHTML,
  addBlock,
  htmlPreview,
  showHTMLPreview,
  showJSONPreview,
}) => {
  return (
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
        {/* HTML Preview */}
        {showHTMLPreview && htmlPreview && (
          <div className="w-full h-full">
            <div className="bg-gray-100 p-2 rounded-t-md border-b">
              <h3 className="text-sm font-medium text-gray-700">HTML Preview</h3>
            </div>
            <pre className="bg-gray-50 p-4 overflow-auto text-xs font-mono whitespace-pre-wrap max-h-96 border rounded-b-md">
              {htmlPreview}
            </pre>
          </div>
        )}

        {/* JSON Preview */}
        {showJSONPreview && (
          <div className="w-full h-full">
            <div className="bg-gray-100 p-2 rounded-t-md border-b">
              <h3 className="text-sm font-medium text-gray-700">JSON Preview</h3>
            </div>
            <pre className="bg-gray-50 p-4 overflow-auto text-xs font-mono whitespace-pre-wrap max-h-96 border rounded-b-md">
              {JSON.stringify(blocks, null, 2)}
            </pre>
          </div>
        )}

        {/* Normal Preview/Edit Mode */}
        {!showHTMLPreview && !showJSONPreview && (
          <>
            {preview ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: exportHTML() }}></div>
            ) : (
              <>
                {blocks.length === 0 && (
                  <div className="p-6 border border-dashed border-gray-300 rounded-md text-center text-gray-500 mb-3">
                    Drop blocks here or use the + Add Block menu below
                  </div>
                )}

                {blocks.map((b, i) => renderBlock(b, i))}

                {/* Add Block Button */}
                <div className="flex justify-center mt-4">
                  <div className="relative inline-block">
                    <div className="flex">
                      <button
                        className="px-3.5 py-2.5 rounded-md border hover:bg-gray-100 border-gray-300 text-center text-gray-500 transition-colors"
                        onClick={() => setShowAddMenu(!showAddMenu)}
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainEditorCanvas;

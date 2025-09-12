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
            {!preview && (
              <div className=" flex justify-center mt-4">
                <div className="relative inline-block">
                  <div className="flex ">
                    <button
                      className="px-3.5 py-2.5 rounded-md border hover:bg-gray-100 border-gray-300  text-center text-gray-500 transition-colors"
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainEditorCanvas;

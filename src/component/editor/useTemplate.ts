'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Block, BlockType, HeadingBlock, ParagraphBlock, ImageBlock } from './types';

const STORAGE_KEY = 'template_v1';

function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  if (type === 'heading') {
    const b: HeadingBlock = { id, type, text: 'Heading', level: 2 };
    return b;
  }
  if (type === 'paragraph') {
    const b: ParagraphBlock = { id, type, text: 'Your paragraph goes here...' };
    return b;
  }
  const b: ImageBlock = { id, type: 'image', src: '', alt: 'Image' };
  return b;
}

export function useTemplate() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [preview, setPreview] = useState(false);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBlocks(JSON.parse(raw));
    } catch {}
  }, []);

  // save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch {}
  }, [blocks]);

  const api = useMemo(
    () => ({
      addBlockAfter(index: number, type: BlockType) {
        const next = [...blocks];
        next.splice(index + 1, 0, createBlock(type));
        setBlocks(next);
      },
      addBlockAtEnd(type: BlockType) {
        setBlocks((prev) => [...prev, createBlock(type)]);
      },
      updateBlock(id: string, patch: Partial<Block>) {
        setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)));
      },
      removeBlock(id: string) {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
      },
      moveUp(id: string) {
        setBlocks((prev) => {
          const i = prev.findIndex((b) => b.id === id);
          if (i > 0) {
            const copy = [...prev];
            [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
            return copy;
          }
          return prev;
        });
      },
      moveDown(id: string) {
        setBlocks((prev) => {
          const i = prev.findIndex((b) => b.id === id);
          if (i >= 0 && i < prev.length - 1) {
            const copy = [...prev];
            [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]];
            return copy;
          }
          return prev;
        });
      },
      clear() {
        setBlocks([]);
      },
      setPreview(v: boolean) {
        setPreview(v);
      },
    }),
    [blocks]
  );

  return { blocks, preview, ...api };
}

export type BlockType = 'heading' | 'paragraph' | 'image';

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  text: string;
  level: 1 | 2 | 3; // h1/h2/h3
}

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  text: string;
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  src: string; // data URL or https URL
  alt: string;
  width?: number; // optional
}

export type Block = HeadingBlock | ParagraphBlock | ImageBlock;

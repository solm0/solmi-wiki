export type Post = {
  id: string;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  publishedAt: string | number | Date;
  content?: PostContent | null;
  author?: User | null;
  tags: Tag;
  keywords: Keyword[];
  meta: boolean;
  status: 'published' | 'draft';
  chron: {
    year?: string;
    month?: string;
    day?: string;
  }
  order?: number;
  links?: Post[];
  backlinks?: Post[];
  internalLinks?: Post[];
  internalBacklinks?: Post[];
  places?: Place[];
  playlists: Playlist[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  posts?: Post[];
};

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  keyboard?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  type?: string;
  title?: string;
};

export type LinkNode = {
  type: 'link';
  href: string;
  children: FormattedText[];
};

export type InternalLinkNode = {
  type: 'internal-link';
  id: string;
  children: FormattedText[];
};

export type TextNode = FormattedText | LinkNode | RelationshipNode | InternalLinkNode;

export type HeadingNode = {
  type: 'heading';
  level: 2 | 3 | 4 | 5 | 6;
  children: TextNode[];
};

export type ParagraphNode = {
  type: 'paragraph' | 'list-item-content' | "layout-area";
  children: TextNode[];
  textAlign?: 'start' | 'center' | 'end';
};

export type DividerNode = {
  type: 'divider';
  children: { text: string }[];
};

export type BlockquoteNode = {
  type: 'blockquote';
  children: ParagraphNode[];
};

export type ListItemChild = ParagraphNode | UnorderedListNode | OrderedListNode;

export type ListItemNode = {
  type: 'list-item';
  children: ListItemChild[];
};

export type OrderedListNode = {
  type: 'ordered-list';
  children: ListItemNode[];
};

export type UnorderedListNode = {
  type: 'unordered-list';
  children: ListItemNode[];
};

export type LayoutAreaNode = {
  type: 'layout-area';
  children: RichTextNode[];
};

export type LayoutNode = {
  type: 'layout';
  layout: number[];
  children: LayoutAreaNode[];
};

export type RichTextNode =
  | HeadingNode
  | ParagraphNode
  | DividerNode
  | BlockquoteNode
  | OrderedListNode
  | UnorderedListNode
  | LayoutNode
  | CodeBlockNode
  | NoticeNode
  | QuoteNode
  | InternalLinkComponentNode
  | CarouselNode
  | IframeNode
  | PlaceNode
  | FootnoteNode
  | ComponentPreviewNode

export type PostContent = {
  document: RichTextNode[];
  relationships?: {
    tag?: Tag[];
  };
};

export type Tag = {
  id: string;
  name: string;
  posts: Post[];
};

export type Keyword = {
  id: string;
  name: string;
  posts: Post[];
};

// Final root object
export type TagsResponse = {
  tags: Tag[];
};

export type RelationshipNode = {
  type: 'relationship';
  relationship: 'post';
  data: {
    id: string;
    label?: string;
    data?: Post;
  };
  children: { text: string }[]; // usually an empty text node
};

export type Node = {
  id: string;
  title: string;
  depth?: number;
  val?: number;
}

export type Link = {
  source: string | {id: string};
  target: string | {id: string};
}

export type Graph = {
  nodes: Node[],
  links: Link[]
}

export type KeywordsByTag = {
  [tag: string]: string[];
};

export type InternalLinkComponentNode = {
  type: "component-block",
  props: {
    post: {
      id: string,
      label: string,
      data: Post[],
    }
  }
  children: {
    children: FormattedText[],
  }[]
  component: 'internalLink'
}

export type CodeBlockNode = {
  type: 'component-block',
  children: {
    type: 'component-inline-prop' | 'component-block-prop',
    children: FormattedText[] | ParagraphNode[],
  }[],
  component: 'codeBlock',
}

export type Intent = 'info' | 'warning' | 'error' | 'success';

export type NoticeNode = {
  type: 'component-block',
  component: 'notice',
  props: { intent: Intent },
  children: {
    type: 'component-block-prop',
    children: ParagraphNode[],
  }[],
}

export type QuoteNode = {
  type: 'component-block',
  component: 'quote',
  children: {
    type: 'component-inline-prop' | 'component-block-prop',
    children: FormattedText[] | ParagraphNode[],
  }[],
}

export type CarouselNode = {
  type: 'component-block',
  component: 'carousel',
  children: {
    type: 'component-inline-prop',
    children: ParagraphNode[],
  }[],
  props: {
    items: {
      alt: string,
      imageSrc: string,
      type: string,
      fit: string,
    }[],
  },
}

export type IframeNode = {
  type: 'component-block',
  component: 'iframe',
  children: {
    type: 'component-inline-prop',
    children: { text: string }[],
  }[],
}

export type Place = {
  id: string;
  lat: string;
  lng: string;
  name: string;
  posts?: Post[];
}

export type PlaceNode = {
  type: 'component-block',
  children: {
    type: 'component-inline-prop',
    children: FormattedText[],
  }[],
  component: 'place',
}

export type FootnoteNode = {
  type: 'component-block',
  children: {
    type: 'component-inline-prop',
    children: FormattedText[],
    propPath: string;
  }[],
  component: 'footnote',
}

export type ComponentPreviewNode = {
  type: 'component-block',
  children: {
    type: 'component-inline-prop',
    children: FormattedText[],
  }[],
  component: 'componentPreview',
}

export type Playlist = {
  id: string;
  title: string;
  posts: Post[];
  songs: Song[];
}

export type Lyric = {
  lyric: {
    or: string;
    tr: string;
  };
  time: number;
}

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  thumbnailId: string;
  youtubeVideoId: string;
  language: string;
  country: string;
  releaseYear: string;
  desc: string;
  lyric: Lyric[];
  playlist: Playlist[];
}
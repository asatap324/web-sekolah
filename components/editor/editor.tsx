"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { CodeHighlightNode, CodeNode } from "@lexical/code";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { FloatingLinkContext } from "@/components/editor/context/floating-link-context";
import { ImageNode } from "@/components/editor/nodes/image-node";
import { EquationNode } from "@/components/editor/nodes/equation-node";
import { EmojiNode } from "@/components/editor/nodes/emoji-node";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TweetNode } from "@/components/editor/nodes/embeds/tweet-node";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
    ListNode,
    ListItemNode,
    ImageNode,
    EquationNode,
    EmojiNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    HorizontalRuleNode,
    TweetNode,
    CodeHighlightNode,
    CodeNode,
  ],
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  initialMarkdown,
  onMarkdownChange,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  initialMarkdown?: string;
  onMarkdownChange?: (markdown: string) => void;
}) {
  return (
    <div className="bg-background overflow-hidden  rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editorState(editor) {
            if (initialMarkdown) {
              editor.update(() => {
                $convertFromMarkdownString(initialMarkdown, TRANSFORMERS);
              });
            }
          },
        }}
      >
        <TooltipProvider>
          <FloatingLinkContext>
            <Plugins />

            <OnChangePlugin
              ignoreSelectionChange
              onChange={(editorState: EditorState) => {
                editorState.read(() => {
                  const markdown = $convertToMarkdownString(TRANSFORMERS);
                  onMarkdownChange?.(markdown);
                });
              }}
            />
          </FloatingLinkContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

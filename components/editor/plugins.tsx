"use client";
import { useState } from "react";

import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown";

import { createLinkMatcherWithRegExp } from "@lexical/react/LexicalAutoLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";

import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote";
import { Separator } from "@/components/ui/separator";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";

import { ParagraphPickerPlugin } from "@/components/editor/plugins/picker/paragraph-picker-plugin";
import { HeadingPickerPlugin } from "@/components/editor/plugins/picker/heading-picker-plugin";
import { QuotePickerPlugin } from "@/components/editor/plugins/picker/quote-picker-plugin";
import { AlignmentPickerPlugin } from "@/components/editor/plugins/picker/alignment-picker-plugin";
import { ComponentPickerMenuPlugin } from "@/components/editor/plugins/component-picker-menu-plugin";
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin";
import { BlockInsertPlugin } from "@/components/editor/plugins/toolbar/block-insert-plugin";
import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image";

import { CUSTOM_TRANSFORMERS } from "@/components/editor/transformers/custom-transformers";
import { EmojisPlugin } from "@/components/editor/plugins/emojis-plugin";
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin";
import { EquationsPlugin } from "@/components/editor/plugins/equations-plugin";
// import { InsertEquation } from "@/components/editor/plugins/toolbar/block-insert/insert-equation";
// import { InsertTable } from "@/components/editor/plugins/toolbar/block-insert/insert-table";
// import { InsertHorizontalRule } from "@/components/editor/plugins/toolbar/block-insert/insert-horizontal-rule";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ClearEditorActionPlugin } from "@/components/editor/plugins/actions/clear-editor-plugin";
import { ActionsPlugin } from "@/components/editor/plugins/actions/actions-plugin";

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const MATCHERS = [
    createLinkMatcherWithRegExp(
      /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
      (text) => (text.startsWith("http") ? text : `https://${text}`),
    ),
  ];

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <HistoryToolbarPlugin />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatNumberedList />
              <FormatQuote />
            </BlockFormatDropDown>

            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />

            <ElementFormatToolbarPlugin />
            <LinkToolbarPlugin />
            <BlockInsertPlugin>
              <InsertImage />
            </BlockInsertPlugin>
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div>
              <div aria-hidden="true" ref={onRef}>
                <ContentEditable placeholder={"Press / to command"} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* editor plugins */}
        <ListPlugin />
        <TabIndentationPlugin />
        <CheckListPlugin />
        <ClickableLinkPlugin />
        <LinkPlugin />
        <ImagesPlugin />
        <AutoLinkPlugin matchers={MATCHERS} />

        <EmojisPlugin />
        <EmojiPickerPlugin />

        <EquationsPlugin />
        <HorizontalRulePlugin />

        <HistoryPlugin />

        <ComponentPickerMenuPlugin
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            QuotePickerPlugin(),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
        />

        <MarkdownShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />
      </div>
      {/* actions plugins */}
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            {/* left side action buttons */}
          </div>
          <div>{/* center action buttons */}</div>
          <div className="flex flex-1 justify-end">
            <>
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </>
          </div>
        </div>
      </ActionsPlugin>
    </div>
  );
}

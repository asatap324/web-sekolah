"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_EDITOR_COMMAND } from "lexical";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ClearEditorActionPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <Dialog>
      <DialogTrigger className="p-2">
        <Trash2Icon className="h-4 w-4" />
      </DialogTrigger>

      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Clear Editor</DialogTitle>
          <DialogDescription>
            Are you sure you want to clear the editor?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>

          <DialogClose
            render={
              <Button
                variant="destructive"
                onClick={() => {
                  editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                }}
              />
            }
          >
            Clear
          </DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

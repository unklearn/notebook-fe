import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  syncFileAction,
  updateFileCellAction,
} from "../../notebooks/redux/NotebookActions";
import { CodeEditor } from "./CodeEditor";

export interface FileCellProps {
  notebookId: string;
  containerId: string;
  cellId: string;
  filePath: string;
  content?: string;
  // onPathChange: (containerId: string, filePath: string) => void;
  // onContentChange: (
  //   containerId: string,
  //   filePath: string,
  //   fileContents: string
  // ) => void;
}

const extToMode = {
  py: "python",
};

export const FileCell: React.FC<FileCellProps> = ({
  notebookId,
  cellId,
  containerId,
  filePath,
  content,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    // Sync contents on path change
    dispatch(
      syncFileAction(notebookId, containerId, cellId, filePath, content)
    );
  }, [filePath]);
  return (
    <div className="unk-file-cell box">
      <div className="unk-file-cell__path">
        <input
          ref={inputRef}
          className="input"
          defaultValue={filePath}
          onKeyDown={handleKeyDown}
        />
        {content && (
          <CodeEditor code={content} mode={getMode()} onSave={updateContent} />
        )}
      </div>
    </div>
  );

  function updateContent(code: string) {
    if (inputRef.current) {
      dispatch(
        updateFileCellAction(
          notebookId,
          containerId,
          cellId,
          inputRef.current.value,
          code
        )
      );
    }
  }

  function getMode() {
    if (inputRef && inputRef.current) {
      const value = inputRef.current.value;
      const parts = value.split("/");
      const lastPart = parts[parts.length - 1];
      const extParts = lastPart.split(".");
      const ext = extParts[1];
      if (ext) {
        // @ts-expect-error
        return extToMode[ext];
      }
      return "text";
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value;
      dispatch(
        updateFileCellAction(notebookId, containerId, cellId, value, "")
      );
    }
  }
};

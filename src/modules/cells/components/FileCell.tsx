import React, { useRef } from "react";
import { CodeEditor } from "./CodeEditor";

export interface FileCellProps {
  containerId: string;
  filePath: string;
  fileContents?: string;
  onPathChange: (containerId: string, filePath: string) => void;
  onContentChange: (
    containerId: string,
    filePath: string,
    fileContents: string
  ) => void;
}

const extToMode = {
  py: "python",
};

export const FileCell: React.FC<FileCellProps> = ({
  containerId,
  filePath,
  onPathChange,
  onContentChange,
  fileContents,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="unk-file-cell box">
      <div className="unk-file-cell__path">
        <input
          ref={inputRef}
          className="input"
          defaultValue={filePath}
          onKeyDown={handleKeyDown}
        />
        {fileContents && (
          <CodeEditor
            code={fileContents}
            mode={getMode()}
            onSave={updateContent}
          />
        )}
      </div>
    </div>
  );

  function updateContent(code: string) {
    if (inputRef.current) {
      onContentChange(containerId, inputRef.current.value, code);
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
      onPathChange(containerId, value);
    }
  }
};

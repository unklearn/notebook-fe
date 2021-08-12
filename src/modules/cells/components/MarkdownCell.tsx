import React, { useEffect, useState } from "react";
import snarkdown from "snarkdown";
import { CodeEditor } from "./CodeEditor";

export interface MarkdownCellProps {
  content?: string;
}

export const MarkdownCell: React.FC<MarkdownCellProps> = ({ content = "" }) => {
  const [code, setCode] = useState(content);
  useEffect(() => {
    setCode(code);
  }, [content]);
  return (
    <div className="box">
      <div className="block">
        <CodeEditor mode="markdown" code={code} onSave={setCode} />
      </div>
      <div className="content block">
        <div
          dangerouslySetInnerHTML={{
            __html: snarkdown(code || ""),
          }}
        ></div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import snarkdown from "snarkdown";
import { CodeEditor } from "./CodeEditor";

export interface MarkdownCellProps {}

export const MarkdownCell: React.FC<MarkdownCellProps> = () => {
  const [code, setCode] = useState("");
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

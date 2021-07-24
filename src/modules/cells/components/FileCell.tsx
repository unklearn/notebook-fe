import React, { useRef } from 'react';
import { string } from 'yargs';
import { CodeEditor } from './CodeEditor';

export interface FileCellProps {
    containerId: string;
    filePath: string;
    fileContents?: string;
    onPathChange: (containerId: string, filePath: string) => void;
};

const extToMode = {
    'py' : 'python'
};

export const FileCell : React.FC<FileCellProps> = ({
    containerId,
    filePath,
    onPathChange,
    fileContents
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return <div className="unk-file-cell box">
        <div className="unk-file-cell__path">
            <input ref={inputRef} className="input" defaultValue={filePath} onKeyDown={handleKeyDown}/>
            {fileContents && <CodeEditor
                code={fileContents}
                mode={getMode()}
                onSave={console.log}
            />}
        </div>
    </div>

    function getMode() {
        if (inputRef && inputRef.current) {
            const value = inputRef.current.value;
            const parts = value.split('/');
            const lastPart = parts[parts.length - 1];
            const extParts = lastPart.split('.');
            const ext = extParts[1];
            if (ext) {
                // @ts-expect-error
                return extToMode[ext];
            }
            return 'text';
        }
    }

    function handleKeyDown(event : React.KeyboardEvent) {
        if (event.key === "Enter") {
            const value = (event.target as HTMLInputElement).value;
            onPathChange(containerId, value);
        }
    }
};
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/mode/css/css';
import './CodeEditor.css';

export interface CodeEditorProps {
    mode: "javascript" | "python" | "java" | "json" | "shell" | "golang" | "yaml" | "markdown" | "html" | "css" | "redis" | "text",
    code: string,
    onSave: (code: string) => void;
};

export interface CodeEditorState {
    
};

export class CodeEditor extends React.Component<CodeEditorProps, CodeEditorState> {
  static langModeToCodeMirrorMode = {
    javascript: 'text/javascript',
    json: 'text/javascript',
    java: 'text/x-java',
    python: 'python',
    golang: 'text/x-go',
    markdown: 'gfm',
    shell: 'shell',
    yaml: 'yaml',
    html: 'text/html',
    css: 'text/css',
    text: 'text/plain'
  };
  

  // *********************************************************
  // Constructor
  // *********************************************************


  render () {
    const { mode, code, onSave } = this.props;
    return (
      <div className='ReactCodeMirror'>
        <CodeMirror
          value={code}
          options={{
            // @ts-expect-error
            mode: CodeEditor.langModeToCodeMirrorMode[mode],
            indentUnit: 4,
            viewportMargin: 150,
            theme: 'base16-light',
            extraKeys: {
              Tab: (cm: any) => cm.execCommand('indentMore'),
              'Shift-Tab': (cm: any) => cm.execCommand('indentLess')
            }
          }}
          onBlur={(editor: any) => onSave(editor.getValue())}
        />
      </div>
    );
  }
}
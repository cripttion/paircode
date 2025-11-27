import React, { useRef, useState, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import axios from 'axios';

interface CodeEditorProps {
    code: string;
    onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
    const editorRef = useRef<any>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Register a completion item provider
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: async (model: any, position: any) => {
                // This is called by Monaco when Ctrl+Space is pressed or trigger characters are typed
                // We can also manually trigger it or just rely on our custom "AI" fetch

                // However, the requirement says: "When user stops typing for ~600ms, call this endpoint and show the suggestion"
                // Monaco's completion provider is usually pull-based.
                // To strictly follow "show suggestion", we might want to use a "Ghost Text" or just inject a completion item.

                // For simplicity in this prototype, we will return the suggestions we fetched via the debounce mechanism
                // or we can fetch here directly.

                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                // We'll use the API here if we want standard autocomplete behavior
                try {
                    const response = await axios.post('http://localhost:8000/autocomplete', {
                        code: textUntilPosition,
                        cursorPosition: model.getOffsetAt(position),
                        language: 'python'
                    });

                    return {
                        suggestions: [
                            {
                                label: response.data.suggestion,
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: response.data.suggestion,
                                range: {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: position.column,
                                    endColumn: position.column
                                }
                            }
                        ]
                    };
                } catch (e) {
                    return { suggestions: [] };
                }
            }
        });
    };

    // Debounce logic for "AI" if we wanted to show it differently (e.g. ghost text), 
    // but integrating into Monaco's native autocomplete (Ctrl+Space or typing) is smoother.
    // The requirement says "show the suggestion in the editor". 
    // Monaco's `trigger('keyboard', 'editor.action.triggerSuggest')` can open the widget.

    useEffect(() => {
        const timer = setTimeout(() => {
            if (editorRef.current) {
                // Trigger suggestion widget
                editorRef.current.trigger('keyboard', 'editor.action.triggerSuggest');
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [code]);

    return (
        <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => onChange(value || "")}
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
            }}
        />
    );
};

export default CodeEditor;

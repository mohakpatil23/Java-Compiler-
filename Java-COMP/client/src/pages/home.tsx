import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, RotateCcw, Terminal, Code2, Loader2, Undo2, Redo2, Moon, Sun } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/contexts/theme-provider";
import { FileToolbar } from "@/components/file-toolbar";

const BRACKET_PAIRS: Record<string, string> = {
  "(": ")",
  "{": "}",
  "[": "]",
  '"': '"',
  "'": "'",
};

const CLOSING_BRACKETS = [")", "}", "]", '"', "'"];

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try modifying this code!
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum of 1 to 10: " + sum);
    }
}`;

interface CompileResponse {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string>("");
  const [history, setHistory] = useState<string[]>([DEFAULT_CODE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fileName, setFileName] = useState("Main");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleNewFile = () => {
    setCode(DEFAULT_CODE);
    setHistory([DEFAULT_CODE]);
    setHistoryIndex(0);
    setFileName("Main");
    setOutput("");
  };

  const handleLoadFile = (fileCode: string) => {
    setCode(fileCode);
    setHistory([fileCode]);
    setHistoryIndex(0);
    setOutput("");
  };

  const updateCode = (newCode: string) => {
    setCode(newCode);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCode(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCode(history[newIndex]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const beforeCursor = value.substring(0, selectionStart);
    const afterCursor = value.substring(selectionEnd);

    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      handleRedo();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const newCode = beforeCursor + "    " + afterCursor;
      updateCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 4;
      }, 0);
      return;
    }

    if (e.key in BRACKET_PAIRS) {
      e.preventDefault();
      const closingBracket = BRACKET_PAIRS[e.key];
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newCode = beforeCursor + e.key + selectedText + closingBracket + afterCursor;
      updateCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }

    if (CLOSING_BRACKETS.includes(e.key) && afterCursor.startsWith(e.key)) {
      e.preventDefault();
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const currentLine = beforeCursor.split("\n").pop() || "";
      const indentMatch = currentLine.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : "";
      
      if (currentLine.trimEnd().endsWith("{")) {
        indent += "    ";
      }
      
      const newCode = beforeCursor + "\n" + indent + afterCursor;
      updateCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length;
      }, 0);
      return;
    }

    if (e.key === "Backspace" && selectionStart === selectionEnd) {
      const charBefore = value[selectionStart - 1];
      const charAfter = value[selectionStart];
      if (charBefore && BRACKET_PAIRS[charBefore] === charAfter) {
        e.preventDefault();
        const newCode = value.substring(0, selectionStart - 1) + value.substring(selectionStart + 1);
        updateCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart - 1;
        }, 0);
        return;
      }
    }
  };

  const compileMutation = useMutation({
    mutationFn: async (sourceCode: string) => {
      const response = await apiRequest("POST", "/api/compile", { code: sourceCode });
      return await response.json() as CompileResponse;
    },
    onSuccess: (data) => {
      if (data.success) {
        setOutput(data.output || "Program executed successfully with no output.");
      } else {
        setOutput(data.error || "Compilation failed.");
      }
    },
    onError: (error) => {
      setOutput(`Error: ${error.message}`);
    },
  });

  const handleRun = () => {
    setOutput("Compiling and running...");
    compileMutation.mutate(code);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold leading-none">Java Compiler</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-primary text-primary-foreground font-semibold px-3 py-1">
              Made by Mohak Patil
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" data-testid="badge-language">
              Java 21
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl h-full">
          <div className="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-2">
            <Card className="flex flex-col overflow-hidden">
              <FileToolbar
                code={code}
                fileName={fileName}
                onFileNameChange={setFileName}
                onNewFile={handleNewFile}
                onLoadFile={handleLoadFile}
              />
              <CardHeader className="flex flex-row items-center justify-between gap-4 border-b py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code2 className="h-4 w-4" />
                  Code Editor
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    data-testid="button-undo"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    data-testid="button-redo"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    data-testid="button-reset"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRun}
                    disabled={compileMutation.isPending}
                    data-testid="button-run"
                  >
                    {compileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    Run
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => updateCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-full min-h-[400px] resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
                  placeholder="Write your Java code here..."
                  spellCheck={false}
                  data-testid="input-code"
                />
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-4 border-b py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Terminal className="h-4 w-4" />
                  Output
                </CardTitle>
                {compileMutation.isPending && (
                  <Badge variant="secondary" className="gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Running
                  </Badge>
                )}
                {!compileMutation.isPending && compileMutation.isSuccess && (
                  <Badge
                    variant={compileMutation.data?.success ? "default" : "destructive"}
                    data-testid="badge-status"
                  >
                    {compileMutation.data?.success ? "Success" : "Error"}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                <pre
                  className="h-full min-h-[400px] whitespace-pre-wrap break-words bg-muted/30 p-4 font-mono text-sm"
                  data-testid="text-output"
                >
                  {output || "Click 'Run' to compile and execute your Java code."}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-3">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs text-muted-foreground">
            Java Compiler - Write, compile, and run Java code in your browser
          </p>
        </div>
      </footer>
    </div>
  );
}

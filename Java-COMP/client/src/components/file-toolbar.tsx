import { Button } from "@/components/ui/button";
import { FileText, FilePlus, Save, Download, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

interface FileToolbarProps {
  code: string;
  fileName: string;
  onFileNameChange: (name: string) => void;
  onNewFile: () => void;
  onLoadFile: (code: string) => void;
}

export function FileToolbar({
  code,
  fileName,
  onFileNameChange,
  onNewFile,
  onLoadFile,
}: FileToolbarProps) {
  const [showHelper, setShowHelper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    localStorage.setItem(`java_file_${fileName}`, code);
    alert(`File "${fileName}" saved to browser!`);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(code)
    );
    element.setAttribute("download", `${fileName}.java`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const name = file.name.replace(".java", "");
        onFileNameChange(name);
        onLoadFile(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3 flex-wrap">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          className="h-8 w-32 text-sm"
          placeholder="File name"
          data-testid="input-filename"
        />
        <span className="text-xs text-muted-foreground">.java</span>
      </div>

      <div className="flex items-center gap-1 border-l pl-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onNewFile}
          data-testid="button-new-file"
          title="New file"
        >
          <FilePlus className="h-4 w-4 mr-1" />
          New
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          data-testid="button-save"
          title="Save to browser"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleDownload}
          data-testid="button-download"
          title="Download file"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>

        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".java"
            onChange={handleUpload}
            className="hidden"
            data-testid="input-file-upload"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-upload"
            title="Upload Java file"
          >
            <FileText className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      </div>

      <Dialog open={showHelper} onOpenChange={setShowHelper}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            data-testid="button-helper"
            title="Show help and shortcuts"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Java Compiler Help</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li><kbd className="px-2 py-1 bg-muted rounded">Tab</kbd> - Add indentation</li>
                <li><kbd className="px-2 py-1 bg-muted rounded">Ctrl+Z</kbd> - Undo</li>
                <li><kbd className="px-2 py-1 bg-muted rounded">Ctrl+Y</kbd> - Redo</li>
                <li>
                  <kbd className="px-2 py-1 bg-muted rounded">{`( { [`}</kbd> - Auto-close brackets
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">File Operations</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>New:</strong> Create a new file</li>
                <li><strong>Save:</strong> Save to browser storage</li>
                <li><strong>Download:</strong> Download as .java file</li>
                <li><strong>Open:</strong> Load a .java file from your computer</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Auto-indentation and bracket closing</li>
                <li>• Syntax error detection</li>
                <li>• Real-time compilation and execution</li>
                <li>• Dark/Light theme support</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

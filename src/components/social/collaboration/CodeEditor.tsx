
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, Download, Users, Share, MessageSquare } from "lucide-react";

export function CodeEditor() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Collaborative Code Editor
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);

  const [activeUsers] = useState([
    { id: '1', name: 'Sarah Chen', color: '#3b82f6', line: 3 },
    { id: '2', name: 'Mike Johnson', color: '#ef4444', line: 7 }
  ]);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Collaborative Code Editor</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {activeUsers.length + 1} coding
              </Badge>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="default" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div className="relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm h-80 resize-none"
              placeholder="Start coding together..."
            />
            
            {/* User presence indicators */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 bg-white/90 px-2 py-1 rounded text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span>{user.name}</span>
                  <span className="text-muted-foreground">L{user.line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Output Console */}
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
            <div className="text-gray-400 mb-2">Output:</div>
            <div>55</div>
            <div className="text-gray-400 mt-2">Execution completed in 0.12s</div>
          </div>

          {/* Active Collaborators */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm font-medium">Active in session:</span>
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

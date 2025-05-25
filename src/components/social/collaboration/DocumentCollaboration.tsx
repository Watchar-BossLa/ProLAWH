
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Users, Download, Share, Clock, MessageSquare } from "lucide-react";

export function DocumentCollaboration() {
  const [title, setTitle] = useState('Study Notes: React Hooks');
  const [content, setContent] = useState(`# React Hooks Deep Dive

## useState Hook
The useState hook allows functional components to have state. It returns an array with two elements:
1. The current state value
2. A function to update the state

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook
The useEffect hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.

## Custom Hooks
Custom hooks are JavaScript functions whose names start with "use" and that may call other hooks.`);

  const [activeUsers] = useState([
    { id: '1', name: 'Sarah Chen', avatar: 'SC', color: '#3b82f6', position: 142 },
    { id: '2', name: 'Mike Johnson', avatar: 'MJ', color: '#ef4444', position: 298 }
  ]);

  const [comments] = useState([
    {
      id: '1',
      user: 'Sarah Chen',
      text: 'Should we add more examples for useEffect?',
      position: 298,
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      user: 'Mike Johnson',
      text: 'Great explanation! Maybe include useContext as well?',
      position: 450,
      timestamp: '5 minutes ago'
    }
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold text-lg border-none p-0 h-auto bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {activeUsers.length + 1} editing
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline mr-1" />
                Last saved: just now
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments ({comments.length})
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Document Editor */}
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm h-96 resize-none"
              placeholder="Start writing your collaborative document..."
            />

            {/* User cursors */}
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className="absolute pointer-events-none"
                style={{
                  top: Math.floor(user.position / 80) * 20 + 50,
                  left: (user.position % 80) * 8 + 20
                }}
              >
                <div
                  className="w-0.5 h-5 animate-pulse"
                  style={{ backgroundColor: user.color }}
                />
                <div
                  className="absolute -top-6 -left-1 px-2 py-1 text-xs text-white rounded"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name}
                </div>
              </div>
            ))}
          </div>

          {/* Comments Panel */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Comments & Suggestions</h4>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-secondary rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {comment.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Collaborators */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm font-medium">Currently editing:</span>
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: user.color }}
                >
                  {user.avatar}
                </div>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

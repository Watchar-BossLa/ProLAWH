
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Undo, 
  Redo, 
  Download,
  Users,
  Palette
} from "lucide-react";

export function SharedWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [activeUsers, setActiveUsers] = useState([
    { id: '1', name: 'Sarah Chen', color: '#3b82f6', cursor: { x: 150, y: 200 } },
    { id: '2', name: 'Mike Johnson', color: '#ef4444', cursor: { x: 300, y: 150 } },
    { id: '3', name: 'Alex Kim', color: '#10b981', cursor: { x: 450, y: 250 } }
  ]);

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' }
  ];

  const colors = [
    '#000000', '#ef4444', '#3b82f6', '#10b981', 
    '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set initial styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
  }, [color]);

  const startDrawing = (e: React.MouseEvent) => {
    if (tool !== 'pen' && tool !== 'eraser') return;
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || (tool !== 'pen' && tool !== 'eraser')) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 10;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Shared Whiteboard</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {activeUsers.length + 1} collaborators
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-1">
              {tools.map((toolItem) => {
                const Icon = toolItem.icon;
                return (
                  <Button
                    key={toolItem.id}
                    variant={tool === toolItem.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTool(toolItem.id)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Palette className="h-4 w-4 mr-2" />
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  className={`w-6 h-6 rounded border-2 ${
                    color === colorOption ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-96 cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            
            {/* User cursors */}
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className="absolute pointer-events-none"
                style={{
                  left: user.cursor.x,
                  top: user.cursor.y,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: user.color }}
                />
                <div className="absolute top-5 left-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {user.name}
                </div>
              </div>
            ))}
          </div>

          {/* Active Users */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Active collaborators:</span>
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

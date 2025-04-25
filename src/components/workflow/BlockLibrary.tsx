
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Play,
  Save,
  Library,
  Edit
} from "lucide-react";
import { BlockType } from '@/types/workflow';
import { useState } from 'react';

interface BlockLibraryProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
  onAddBlock: (type: string) => void;
  onSaveCustomBlock: (blockData: Partial<BlockType>) => void;
  customBlocks: BlockType[];
}

const BlockLibrary: React.FC<BlockLibraryProps> = ({
  onDragStart,
  onAddBlock,
  onSaveCustomBlock,
  customBlocks
}) => {
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockDesc, setNewBlockDesc] = useState('');
  const [newBlockColor, setNewBlockColor] = useState('#6366f1');
  const [newBlockIcon, setNewBlockIcon] = useState('file-text');

  const handleSaveBlock = () => {
    if (!newBlockName) return;
    
    onSaveCustomBlock({
      id: `custom-${Date.now()}`,
      name: newBlockName,
      description: newBlockDesc,
      color: newBlockColor,
      icon: newBlockIcon
    });
    
    // Reset form
    setNewBlockName('');
    setNewBlockDesc('');
    setNewBlockColor('#6366f1');
    setNewBlockIcon('file-text');
  };
  
  const defaultBlocks = [
    {
      type: "create",
      name: "Criar Conteúdo",
      icon: <FileText className="h-4 w-4 mr-2 text-blue-600" />,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      type: "review",
      name: "Revisar",
      icon: <CheckCircle className="h-4 w-4 mr-2 text-amber-600" />,
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    },
    {
      type: "approve",
      name: "Aprovar",
      icon: <CheckCircle className="h-4 w-4 mr-2 text-green-600" />,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      type: "publish",
      name: "Publicar",
      icon: <Play className="h-4 w-4 mr-2 text-purple-600" />,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
    {
      type: "alert",
      name: "Alerta",
      icon: <AlertCircle className="h-4 w-4 mr-2 text-red-600" />,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
    },
  ];
  
  const renderCustomBlock = (block: BlockType) => {
    let icon;
    switch(block.icon) {
      case 'file-text':
        icon = <FileText className="h-4 w-4 mr-2" style={{color: block.color}} />;
        break;
      case 'check-circle':
        icon = <CheckCircle className="h-4 w-4 mr-2" style={{color: block.color}} />;
        break;
      case 'alert-circle':
        icon = <AlertCircle className="h-4 w-4 mr-2" style={{color: block.color}} />;
        break;
      case 'play':
        icon = <Play className="h-4 w-4 mr-2" style={{color: block.color}} />;
        break;
      default:
        icon = <FileText className="h-4 w-4 mr-2" style={{color: block.color}} />;
    }
    
    return (
      <div
        key={block.id}
        draggable
        onDragStart={(e) => onDragStart(e, block.id)}
        onClick={() => onAddBlock(block.id)}
        className="border rounded-md p-2 cursor-pointer transition-colors flex items-center mb-2"
        style={{
          backgroundColor: `${block.color}20`, // Add transparency
          borderColor: block.color
        }}
      >
        {icon}
        <span className="text-sm">{block.name}</span>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Library className="h-4 w-4 mr-2" />
          Blocos de Workflow
        </CardTitle>
        <CardDescription>
          Arraste os blocos para o canvas ou clique para adicionar
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="predefined">
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="predefined" className="flex-1">Predefinidos</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Personalizados</TabsTrigger>
            <TabsTrigger value="new" className="flex-1">Criar Novo</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="predefined" className="mt-0">
          <CardContent className="space-y-2 pt-3">
            {defaultBlocks.map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={(e) => onDragStart(e, block.type)}
                onClick={() => onAddBlock(block.type)}
                className={`border rounded-md p-2 cursor-pointer transition-colors flex items-center ${block.color}`}
              >
                {block.icon}
                {block.name}
              </div>
            ))}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-0">
          <CardContent className="space-y-2 pt-3">
            {customBlocks.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">
                Você ainda não criou blocos personalizados.
              </p>
            ) : (
              customBlocks.map(renderCustomBlock)
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <CardContent className="space-y-4 pt-3">
            <div className="space-y-1">
              <Label htmlFor="block-name">Nome do Bloco</Label>
              <Input 
                id="block-name" 
                value={newBlockName}
                onChange={(e) => setNewBlockName(e.target.value)} 
                placeholder="Ex: Aprovação do Cliente"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="block-desc">Descrição</Label>
              <Textarea 
                id="block-desc" 
                value={newBlockDesc}
                onChange={(e) => setNewBlockDesc(e.target.value)}
                placeholder="Descrição do bloco"
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="block-color">Cor</Label>
                <div className="flex gap-2">
                  <Input 
                    id="block-color"
                    type="color"
                    value={newBlockColor}
                    onChange={(e) => setNewBlockColor(e.target.value)} 
                    className="w-12 h-8 p-0"
                  />
                  <Input 
                    value={newBlockColor}
                    onChange={(e) => setNewBlockColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="block-icon">Ícone</Label>
                <select
                  id="block-icon"
                  value={newBlockIcon}
                  onChange={(e) => setNewBlockIcon(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="file-text">Documento</option>
                  <option value="check-circle">Verificação</option>
                  <option value="alert-circle">Alerta</option>
                  <option value="play">Reproduzir</option>
                </select>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleSaveBlock} 
              className="w-full"
              disabled={!newBlockName.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Novo Bloco
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="pt-0">
        <p className="text-xs text-gray-500">
          Clique em um bloco no canvas para editar seus detalhes
        </p>
      </CardFooter>
    </Card>
  );
};

export default BlockLibrary;

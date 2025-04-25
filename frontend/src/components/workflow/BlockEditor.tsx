
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Trash2,
  Upload,
  MessageSquare,
  ArrowLeft,
  Clock,
  Users,
  User
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { User as UserType } from '@/types/workflow';

interface BlockEditorProps {
  isOpen: boolean;
  onClose: () => void;
  node: any | null;
  onUpdate: (blockData: any) => void;
  onDelete: () => void;
  users: UserType[];
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  isOpen,
  onClose,
  node,
  onUpdate,
  onDelete,
  users
}) => {
  const [blockData, setBlockData] = useState<any>({
    label: '',
    description: '',
    role: '',
    assignedUserId: '',
    sla: 24,
    status: 'todo',
    dependencies: [],
    actions: []
  });
  
  useEffect(() => {
    if (node && node.data) {
      setBlockData({
        label: node.data.label || '',
        description: node.data.description || '',
        role: node.data.role || '',
        assignedUserId: node.data.assignedUserId || '',
        sla: node.data.sla || 24,
        status: node.data.status || 'todo',
        dependencies: node.data.dependencies || [],
        actions: node.data.actions || []
      });
    }
  }, [node]);
  
  const handleSave = () => {
    onUpdate({
      ...blockData,
      sla: parseInt(blockData.sla.toString())
    });
  };
  
  const handleActionToggle = (action: string) => {
    if (blockData.actions.includes(action)) {
      setBlockData({
        ...blockData,
        actions: blockData.actions.filter((a: string) => a !== action)
      });
    } else {
      setBlockData({
        ...blockData,
        actions: [...blockData.actions, action]
      });
    }
  };
  
  if (!node) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurar Bloco de Workflow</DialogTitle>
          <DialogDescription>
            Configure as propriedades deste bloco do workflow.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="basic" className="flex-1">Básico</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Avançado</TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">Ações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="block-name">Nome</Label>
              <Input
                id="block-name"
                value={blockData.label}
                onChange={(e) => setBlockData({...blockData, label: e.target.value})}
                placeholder="Nome do bloco"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="block-desc">Descrição</Label>
              <Textarea
                id="block-desc"
                value={blockData.description}
                onChange={(e) => setBlockData({...blockData, description: e.target.value})}
                placeholder="Descreva o propósito deste bloco"
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="block-status">Status</Label>
              <Select 
                value={blockData.status} 
                onValueChange={(val) => setBlockData({...blockData, status: val})}
              >
                <SelectTrigger id="block-status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A fazer</SelectItem>
                  <SelectItem value="in-progress">Em progresso</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block-role" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Papel Responsável
                </Label>
                <Select 
                  value={blockData.role} 
                  onValueChange={(val) => setBlockData({...blockData, role: val})}
                >
                  <SelectTrigger id="block-role">
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="legal">Jurídico</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="director">Diretor</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="block-sla" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  SLA (horas)
                </Label>
                <Input
                  id="block-sla"
                  type="number"
                  min="1"
                  value={blockData.sla}
                  onChange={(e) => setBlockData({...blockData, sla: e.target.value})}
                  placeholder="Tempo para conclusão"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="block-user" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Usuário Responsável
              </Label>
              <Select 
                value={blockData.assignedUserId} 
                onValueChange={(val) => setBlockData({...blockData, assignedUserId: val})}
              >
                <SelectTrigger id="block-user">
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não atribuído</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Se não for atribuído, qualquer usuário com o papel pode executar este bloco.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Dependências
              </Label>
              <p className="text-xs text-muted-foreground">
                As dependências são gerenciadas através das conexões entre os blocos.
                Conecte os blocos no canvas para definir dependências.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Ações Permitidas</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Selecione as ações que podem ser executadas neste bloco.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="action-approve" 
                    checked={blockData.actions.includes('approve')}
                    onCheckedChange={() => handleActionToggle('approve')}
                  />
                  <Label htmlFor="action-approve" className="flex items-center gap-1 cursor-pointer">
                    <Check className="h-4 w-4" />
                    Aprovar
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="action-reject" 
                    checked={blockData.actions.includes('reject')}
                    onCheckedChange={() => handleActionToggle('reject')}
                  />
                  <Label htmlFor="action-reject" className="flex items-center gap-1 cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                    Rejeitar
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="action-comment" 
                    checked={blockData.actions.includes('comment')}
                    onCheckedChange={() => handleActionToggle('comment')}
                  />
                  <Label htmlFor="action-comment" className="flex items-center gap-1 cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    Comentar
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="action-upload" 
                    checked={blockData.actions.includes('upload')}
                    onCheckedChange={() => handleActionToggle('upload')}
                  />
                  <Label htmlFor="action-upload" className="flex items-center gap-1 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="action-return" 
                    checked={blockData.actions.includes('return')}
                    onCheckedChange={() => handleActionToggle('return')}
                  />
                  <Label htmlFor="action-return" className="flex items-center gap-1 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    Devolver
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between pt-2">
          <Button
            variant="destructive"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={!blockData.label}
            >
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockEditor;

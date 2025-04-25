
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  Clock,
  ClipboardList,
  FileText,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Upload,
  ArrowLeft,
  X,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from "@/context/AuthContext";
import { mockAPI } from "@/services/api";
import { 
  TaskBlock, 
  TaskComment,
  TaskAttachment,
  User 
} from "@/types/workflow";

// Mock de dados para tarefas
const mockTasks: TaskBlock[] = [
  {
    id: "task-block-1",
    blockId: "block-1",
    taskId: "task-1",
    status: "waiting",
    assignedUserId: "user-demo-123",
    startDate: "2025-04-30T10:00:00Z",
    dueDate: "2025-04-30T18:00:00Z",
    comments: [],
    attachments: [],
    actions: []
  },
  {
    id: "task-block-2",
    blockId: "block-2",
    taskId: "task-2",
    status: "in-progress",
    assignedUserId: "user-demo-123",
    startDate: "2025-04-25T14:00:00Z",
    dueDate: "2025-04-26T14:00:00Z",
    comments: [
      {
        id: "comment-1",
        userId: "user-3",
        text: "Por favor, revise os textos da campanha antes de avançar.",
        timestamp: "2025-04-25T15:30:00Z"
      }
    ],
    attachments: [
      {
        id: "file-1",
        userId: "user-3",
        fileName: "campanha-q2.pdf",
        fileUrl: "#",
        fileType: "application/pdf",
        fileSize: 2540000,
        timestamp: "2025-04-25T15:00:00Z"
      }
    ],
    actions: []
  },
  {
    id: "task-block-3",
    blockId: "block-3",
    taskId: "task-3",
    status: "completed",
    assignedUserId: "user-demo-123",
    startDate: "2025-04-20T09:00:00Z",
    dueDate: "2025-04-22T18:00:00Z",
    completedDate: "2025-04-21T16:45:00Z",
    comments: [],
    attachments: [],
    actions: [
      {
        id: "action-1",
        userId: "user-demo-123",
        action: "approve",
        timestamp: "2025-04-21T16:45:00Z",
        comment: "Aprovado conforme solicitado."
      }
    ]
  }
];

// Mock de informações das tarefas
const mockTasksInfo: Record<string, {
  title: string,
  description: string,
  blockName: string,
  blockType: string,
  actions: string[]
}> = {
  "task-1": {
    title: "Campanha de Lançamento Produto X",
    description: "Criar campanha para o lançamento do novo produto X, incluindo materiais para redes sociais e email marketing.",
    blockName: "Aprovação de Conteúdo",
    blockType: "approve",
    actions: ["approve", "reject", "comment"]
  },
  "task-2": {
    title: "Relatório Mensal de Performance",
    description: "Revisar o relatório mensal de performance das campanhas de marketing digital.",
    blockName: "Revisão de Relatório",
    blockType: "review",
    actions: ["approve", "reject", "comment", "upload"]
  },
  "task-3": {
    title: "Publicação Blog Corporativo",
    description: "Publicar artigo sobre tendências de mercado no blog corporativo.",
    blockName: "Publicação",
    blockType: "publish",
    actions: ["comment", "upload"]
  }
};

const MyTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskBlock[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskBlock | null>(null);
  const [selectedTaskInfo, setSelectedTaskInfo] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [comment, setComment] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | "comment" | "upload" | "return" | null>(null);
  const [actionComment, setActionComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    fetchTasks();
  }, [user]);
  
  const fetchTasks = async () => {
    if (!user) return;
    
    // Filter tasks for the current user
    const userTasks = mockTasks.filter(
      task => task.assignedUserId === user.id
    );
    
    setTasks(userTasks);
  };
  
  const handleViewTask = (task: TaskBlock) => {
    setSelectedTask(task);
    setSelectedTaskInfo(mockTasksInfo[task.taskId]);
    setIsDialogOpen(true);
  };
  
  const handleAddComment = () => {
    if (!selectedTask || !comment.trim()) return;
    
    const newComment: TaskComment = {
      id: `comment-${Date.now()}`,
      userId: user?.id || "",
      text: comment,
      timestamp: new Date().toISOString()
    };
    
    // Update selected task
    const updatedTask = {
      ...selectedTask,
      comments: [...selectedTask.comments, newComment]
    };
    
    // Update tasks list
    setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    
    // Reset form
    setComment("");
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso.",
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUploadFile = () => {
    if (!selectedTask || !file) return;
    
    const newAttachment: TaskAttachment = {
      id: `file-${Date.now()}`,
      userId: user?.id || "",
      fileName: file.name,
      fileUrl: "#",
      fileType: file.type,
      fileSize: file.size,
      timestamp: new Date().toISOString()
    };
    
    // Update selected task
    const updatedTask = {
      ...selectedTask,
      attachments: [...selectedTask.attachments, newAttachment]
    };
    
    // Update tasks list
    setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    
    // Reset form
    setFile(null);
    
    toast({
      title: "Arquivo enviado",
      description: `O arquivo ${file.name} foi enviado com sucesso.`,
    });
  };
  
  const handleActionClick = (actionType: "approve" | "reject" | "comment" | "upload" | "return") => {
    setActionType(actionType);
    setActionComment("");
    setIsActionDialogOpen(true);
  };
  
  const handleExecuteAction = () => {
    if (!selectedTask || !actionType) return;
    
    // Add the action
    const newAction = {
      id: `action-${Date.now()}`,
      userId: user?.id || "",
      action: actionType,
      timestamp: new Date().toISOString(),
      comment: actionComment
    };
    
    let newStatus: "waiting" | "in-progress" | "completed" | "rejected" | "returned";
    switch (actionType) {
      case "approve":
        newStatus = "completed";
        break;
      case "reject":
        newStatus = "rejected";
        break;
      case "return":
        newStatus = "returned";
        break;
      default:
        newStatus = selectedTask.status;
    }
    
    // Update selected task
    const updatedTask = {
      ...selectedTask,
      status: newStatus,
      actions: [...selectedTask.actions, newAction],
      completedDate: ["completed", "rejected", "returned"].includes(newStatus) 
        ? new Date().toISOString() 
        : selectedTask.completedDate
    };
    
    // Update tasks list
    setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    
    // Reset form and close dialog
    setActionType(null);
    setActionComment("");
    setIsActionDialogOpen(false);
    
    toast({
      title: getActionTitle(actionType),
      description: "A ação foi executada com sucesso.",
    });
  };
  
  const getActionTitle = (action: string) => {
    switch (action) {
      case "approve": return "Aprovado";
      case "reject": return "Rejeitado";
      case "comment": return "Comentado";
      case "upload": return "Arquivo enviado";
      case "return": return "Devolvido";
      default: return "Ação executada";
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="bg-gray-100">Aguardando</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Em andamento</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Concluído</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeitado</Badge>;
      case "returned":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Devolvido</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definido";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };
  
  const toggleRowExpansion = (taskId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(taskId)) {
      newExpandedRows.delete(taskId);
    } else {
      newExpandedRows.add(taskId);
    }
    setExpandedRows(newExpandedRows);
  };
  
  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case "create":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "review":
        return <Check className="h-4 w-4 text-amber-600" />;
      case "approve":
        return <Check className="h-4 w-4 text-green-600" />;
      case "publish":
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return ["waiting", "in-progress"].includes(task.status);
    if (activeTab === "completed") return task.status === "completed";
    if (activeTab === "rejected") return ["rejected", "returned"].includes(task.status);
    return true;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Minhas Tarefas</h1>
            <p className="text-muted-foreground">
              Acompanhe e execute suas tarefas nos fluxos de trabalho.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="completed">Concluídas</TabsTrigger>
                <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">Nenhuma tarefa encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Você não possui tarefas nesta categoria no momento.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Início</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => {
                    const taskInfo = mockTasksInfo[task.taskId];
                    const isExpanded = expandedRows.has(task.id);
                    return (
                      <React.Fragment key={task.id}>
                        <TableRow>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleRowExpansion(task.id)}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{taskInfo.title}</div>
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            {getTaskIcon(taskInfo.blockType)}
                            {taskInfo.blockName}
                          </TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell>{formatDate(task.startDate)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              {formatDate(task.dueDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTask(task)}
                            >
                              Visualizar
                            </Button>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-slate-50">
                            <TableCell colSpan={7} className="p-4">
                              <div className="text-sm text-gray-700 mb-4">
                                <p className="font-medium mb-1">Descrição:</p>
                                <p>{taskInfo.description}</p>
                              </div>
                              
                              {task.comments.length > 0 && (
                                <div className="mb-4">
                                  <p className="font-medium mb-1 flex items-center">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Comentários:
                                  </p>
                                  <div className="space-y-2">
                                    {task.comments.map((comment) => (
                                      <div key={comment.id} className="bg-white p-2 rounded border">
                                        <div className="font-medium">{comment.text}</div>
                                        <div className="text-xs text-gray-500">
                                          {formatDate(comment.timestamp)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {task.attachments.length > 0 && (
                                <div className="mb-4">
                                  <p className="font-medium mb-1 flex items-center">
                                    <Upload className="h-4 w-4 mr-1" />
                                    Arquivos:
                                  </p>
                                  <div className="space-y-1">
                                    {task.attachments.map((attachment) => (
                                      <div key={attachment.id} className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        <a
                                          href={attachment.fileUrl}
                                          className="text-blue-600 hover:underline"
                                        >
                                          {attachment.fileName}
                                        </a>
                                        <span className="text-xs text-gray-500">
                                          {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {task.actions.length > 0 && (
                                <div>
                                  <p className="font-medium mb-1">Ações:</p>
                                  <div className="space-y-1">
                                    {task.actions.map((action) => (
                                      <div key={action.id} className="flex items-center gap-2">
                                        {action.action === "approve" ? (
                                          <Check className="h-4 w-4 text-green-600" />
                                        ) : action.action === "reject" ? (
                                          <X className="h-4 w-4 text-red-600" />
                                        ) : action.action === "return" ? (
                                          <ArrowLeft className="h-4 w-4 text-amber-600" />
                                        ) : (
                                          <MessageSquare className="h-4 w-4 text-blue-600" />
                                        )}
                                        <span>
                                          {getActionTitle(action.action)}
                                        </span>
                                        {action.comment && (
                                          <span className="text-gray-600">: "{action.comment}"</span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                          {formatDate(action.timestamp)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {filteredTasks.length} tarefa(s)
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTask && selectedTaskInfo && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getTaskIcon(selectedTaskInfo.blockType)}
                  {selectedTaskInfo.title}
                </DialogTitle>
                <DialogDescription>
                  Etapa: {selectedTaskInfo.blockName} · Status: {getStatusBadge(selectedTask.status)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Descrição</h3>
                  <p className="text-sm text-gray-700">{selectedTaskInfo.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Data de Início
                    </h3>
                    <p className="text-sm text-gray-700">{formatDate(selectedTask.startDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Prazo
                    </h3>
                    <p className="text-sm text-gray-700">{formatDate(selectedTask.dueDate)}</p>
                  </div>
                </div>
                
                <Tabs defaultValue="comments">
                  <TabsList className="w-full">
                    <TabsTrigger value="comments" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Comentários
                    </TabsTrigger>
                    <TabsTrigger value="attachments" className="flex-1">
                      <Upload className="h-4 w-4 mr-1" />
                      Arquivos
                    </TabsTrigger>
                    <TabsTrigger value="actions" className="flex-1">
                      <AlertOctagon className="h-4 w-4 mr-1" />
                      Ações
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="comments" className="space-y-3 mt-2">
                    {selectedTask.comments.length === 0 && (
                      <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
                    )}
                    
                    {selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-50 p-3 rounded-md">
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(comment.timestamp)}
                        </p>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <Label htmlFor="comment">Adicionar comentário</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Digite seu comentário..."
                          rows={2}
                          className="flex-1"
                        />
                        <Button onClick={handleAddComment} disabled={!comment.trim()}>
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attachments" className="space-y-3 mt-2">
                    {selectedTask.attachments.length === 0 && (
                      <p className="text-sm text-gray-500">Nenhum arquivo anexado.</p>
                    )}
                    
                    {selectedTask.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm">{attachment.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB · {formatDate(attachment.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <Label htmlFor="file-upload">Upload de arquivo</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        <Button onClick={handleUploadFile} disabled={!file}>
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-3 mt-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedTaskInfo.actions.includes('approve') && (
                        <Button 
                          variant="outline" 
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          onClick={() => handleActionClick('approve')}
                          disabled={selectedTask.status === 'completed'}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                      )}
                      
                      {selectedTaskInfo.actions.includes('reject') && (
                        <Button 
                          variant="outline" 
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          onClick={() => handleActionClick('reject')}
                          disabled={selectedTask.status === 'completed'}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      )}
                      
                      {selectedTaskInfo.actions.includes('return') && (
                        <Button 
                          variant="outline" 
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                          onClick={() => handleActionClick('return')}
                          disabled={selectedTask.status === 'completed'}
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Devolver
                        </Button>
                      )}
                    </div>
                    
                    {selectedTask.actions.length === 0 ? (
                      <p className="text-sm text-gray-500">Nenhuma ação registrada.</p>
                    ) : (
                      <div className="space-y-2 pt-3 border-t">
                        <h4 className="text-sm font-medium">Histórico de ações</h4>
                        {selectedTask.actions.map((action) => (
                          <div key={action.id} className="bg-slate-50 p-2 rounded-md">
                            <div className="flex items-center gap-1">
                              {action.action === "approve" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : action.action === "reject" ? (
                                <X className="h-4 w-4 text-red-600" />
                              ) : action.action === "return" ? (
                                <ArrowLeft className="h-4 w-4 text-amber-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              )}
                              <span className="font-medium">
                                {getActionTitle(action.action)}
                              </span>
                            </div>
                            {action.comment && (
                              <p className="text-sm mt-1">{action.comment}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(action.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Aprovar Tarefa"
                : actionType === "reject"
                ? "Rejeitar Tarefa"
                : actionType === "return"
                ? "Devolver Tarefa"
                : "Executar Ação"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Confirme a aprovação desta etapa do workflow."
                : actionType === "reject"
                ? "Indique o motivo da rejeição."
                : actionType === "return"
                ? "Indique o motivo da devolução."
                : "Adicione um comentário para esta ação."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="action-comment">Comentário</Label>
              <Textarea
                id="action-comment"
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                placeholder="Adicione um comentário (opcional)"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExecuteAction}>
              {actionType === "approve"
                ? "Aprovar"
                : actionType === "reject"
                ? "Rejeitar"
                : actionType === "return"
                ? "Devolver"
                : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MyTasksPage;

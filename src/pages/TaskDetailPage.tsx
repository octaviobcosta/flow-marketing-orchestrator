
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { mockAPI } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  ChevronRight,
  Clock,
  Edit2,
  FileText,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";

interface TaskStep {
  id: number;
  name: string;
  status: string;
  assignee: {
    id: number;
    name: string;
    avatar?: string;
  };
  dueAt: string;
  startedAt?: string;
  finishedAt?: string;
}

interface Comment {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

interface Attachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
}

interface HistoryItem {
  id: number;
  action: string;
  from?: string;
  to?: string;
  timestamp: string;
  user: {
    id: number;
    name: string;
  };
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignee: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  creator: {
    id: number;
    name: string;
    email: string;
  };
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
  history: HistoryItem[];
  steps?: TaskStep[];
}

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // In real implementation, this would be a call to the actual API
      // const response = await mockAPI.getTask(id);
      // setTask(response.data);
      
      // Mock data for demonstration
      const mockTask: Task = {
        id: parseInt(id),
        title: "Preparar campanha Landing Page Black Friday",
        description: "Criar todos os elementos necessários para a campanha de Black Friday, incluindo textos, imagens, CTA e formulários. Seguir o briefing anexado e integrar com Google Analytics.",
        status: "in_progress",
        priority: "high",
        dueDate: "2025-05-02",
        createdAt: "2025-04-15T10:00:00Z",
        updatedAt: "2025-04-20T14:30:00Z",
        assignee: {
          id: 1,
          name: "Ana Silva",
          email: "ana@eshows.com",
        },
        creator: {
          id: 2,
          name: "Carlos Mendes",
          email: "carlos@eshows.com",
        },
        tags: ["Marketing", "Design", "Web"],
        comments: [
          {
            id: 101,
            text: "Precisamos garantir que a página seja mobile-friendly. A maioria dos acessos virá de dispositivos móveis durante a campanha.",
            createdAt: "2025-04-17T11:30:00Z",
            user: {
              id: 2,
              name: "Carlos Mendes",
            },
          },
          {
            id: 102,
            text: "Já iniciei o desenvolvimento da landing page. Estou utilizando os elementos do nosso design system para acelerar o processo.",
            createdAt: "2025-04-18T09:45:00Z",
            user: {
              id: 1,
              name: "Ana Silva",
            },
          },
        ],
        attachments: [
          {
            id: 201,
            fileName: "briefing_black_friday.pdf",
            fileSize: 1024000,
            fileType: "application/pdf",
            url: "/files/briefing_black_friday.pdf",
            uploadedAt: "2025-04-15T10:15:00Z",
          },
          {
            id: 202,
            fileName: "mockup_landing_page.png",
            fileSize: 2048000,
            fileType: "image/png",
            url: "/files/mockup_landing_page.png",
            uploadedAt: "2025-04-16T14:30:00Z",
          },
        ],
        history: [
          {
            id: 301,
            action: "status_change",
            from: "pending",
            to: "in_progress",
            timestamp: "2025-04-16T09:00:00Z",
            user: {
              id: 1,
              name: "Ana Silva",
            },
          },
          {
            id: 302,
            action: "assignee_change",
            from: "Carlos Mendes",
            to: "Ana Silva",
            timestamp: "2025-04-16T09:00:00Z",
            user: {
              id: 2,
              name: "Carlos Mendes",
            },
          },
        ],
        steps: [
          {
            id: 1,
            name: "Planejamento",
            status: "completed",
            assignee: {
              id: 2,
              name: "Carlos Mendes",
            },
            dueAt: "2025-04-17",
            startedAt: "2025-04-15",
            finishedAt: "2025-04-17",
          },
          {
            id: 2,
            name: "Design",
            status: "in_progress",
            assignee: {
              id: 1,
              name: "Ana Silva",
            },
            dueAt: "2025-04-25",
            startedAt: "2025-04-18",
          },
          {
            id: 3,
            name: "Desenvolvimento",
            status: "pending",
            assignee: {
              id: 1,
              name: "Ana Silva",
            },
            dueAt: "2025-04-30",
          },
          {
            id: 4,
            name: "Revisão",
            status: "pending",
            assignee: {
              id: 5,
              name: "Patricia Almeida",
            },
            dueAt: "2025-05-01",
          },
          {
            id: 5,
            name: "Publicação",
            status: "pending",
            assignee: {
              id: 2,
              name: "Carlos Mendes",
            },
            dueAt: "2025-05-02",
          },
        ],
      };
      
      setTask(mockTask);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os detalhes da tarefa.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!task) return;
    
    try {
      // In real implementation, this would be a call to the actual API
      // await mockAPI.updateTaskStatus(task.id.toString(), newStatus);
      
      setTask({
        ...task,
        status: newStatus,
        history: [
          {
            id: Date.now(),
            action: "status_change",
            from: task.status,
            to: newStatus,
            timestamp: new Date().toISOString(),
            user: {
              id: 1, // Current user ID would come from auth context
              name: "Ana Silva",
            },
          },
          ...task.history,
        ],
      });
      
      toast({
        title: "Status atualizado",
        description: `O status foi alterado para ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o status.",
      });
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    
    try {
      setIsPostingComment(true);
      
      // In real implementation, this would be a call to the actual API
      // await mockAPI.addComment(task.id.toString(), newComment);
      
      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: 1, // Current user ID would come from auth context
          name: "Ana Silva",
        },
      };
      
      setTask({
        ...task,
        comments: [newCommentObj, ...task.comments],
      });
      
      setNewComment("");
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
      });
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    
    try {
      // In real implementation, this would be a call to the actual API
      // await mockAPI.deleteTask(task.id.toString());
      
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso.",
      });
      
      navigate("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
      });
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("pt-BR");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-gray-100 text-gray-800",
      in_progress: "bg-blue-100 text-blue-800",
      in_review: "bg-amber-100 text-amber-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const statusLabels = {
      pending: "Pendente",
      in_progress: "Em progresso",
      in_review: "Em revisão",
      completed: "Concluído",
      cancelled: "Cancelado",
    };

    const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
    const label = statusLabels[status as keyof typeof statusLabels] || status;

    return <Badge className={style}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-green-100 text-green-800",
    };

    const priorityLabels = {
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    };

    const style = priorityStyles[priority as keyof typeof priorityStyles] || "bg-gray-100 text-gray-800";
    const label = priorityLabels[priority as keyof typeof priorityLabels] || priority;

    return <Badge className={style}>{label}</Badge>;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!task) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Tarefa não encontrada.</p>
        </div>
      </MainLayout>
    );
  }

  const getAvatarFallback = (name: string) => {
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };
  
  const getHistoryDescription = (historyItem: HistoryItem) => {
    switch (historyItem.action) {
      case "status_change":
        return `alterou o status de ${historyItem.from} para ${historyItem.to}`;
      case "assignee_change":
        return `transferiu a tarefa de ${historyItem.from} para ${historyItem.to}`;
      case "task_created":
        return `criou a tarefa`;
      case "comment_added":
        return `adicionou um comentário`;
      case "attachment_added":
        return `adicionou um anexo`;
      default:
        return historyItem.action;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
              <Button variant="ghost" size="icon" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span>Tarefa #{task.id}</span>
              <span>•</span>
              <span>Criada em {formatDate(task.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {getStatusBadge(task.status)}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Mudar status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUpdateStatus("pending")}>
                  {getStatusBadge("pending")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus("in_progress")}>
                  {getStatusBadge("in_progress")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus("in_review")}>
                  {getStatusBadge("in_review")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus("completed")}>
                  {getStatusBadge("completed")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus("cancelled")}>
                  {getStatusBadge("cancelled")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar tarefa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir tarefa
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{task.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Steps */}
            {task.steps && task.steps.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Fluxo de Trabalho</CardTitle>
                  <CardDescription>
                    Etapas do workflow de aprovação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task.steps.map((step, index) => (
                      <div key={step.id} className="relative">
                        <div className="flex items-start">
                          {/* Timeline connector */}
                          {index < task.steps!.length - 1 && (
                            <div className="absolute top-6 left-4 bottom-0 w-0.5 bg-gray-200"></div>
                          )}
                          
                          {/* Status indicator */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                            step.status === "completed" 
                              ? "bg-green-500 text-white" 
                              : step.status === "in_progress" 
                              ? "bg-blue-500 text-white" 
                              : "bg-gray-200 text-gray-500"
                          }`}>
                            {step.status === "completed" ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              index + 1
                            )}
                          </div>
                          
                          {/* Step content */}
                          <div className="ml-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                              <div>
                                <h4 className="font-medium">{step.name}</h4>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>{step.assignee.name}</span>
                                  <span className="mx-2">•</span>
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  <span>Prazo: {formatDate(step.dueAt)}</span>
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                {getStatusBadge(step.status)}
                              </div>
                            </div>
                            
                            {/* Step timeline */}
                            {(step.startedAt || step.finishedAt) && (
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                {step.startedAt && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Iniciado: {formatDate(step.startedAt)}</span>
                                  </div>
                                )}
                                {step.finishedAt && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Finalizado: {formatDate(step.finishedAt)}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="comments">
              <TabsList className="mb-2">
                <TabsTrigger value="comments">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comentários ({task.comments.length})
                </TabsTrigger>
                <TabsTrigger value="files">
                  <FileText className="h-4 w-4 mr-2" />
                  Anexos ({task.attachments.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Clock className="h-4 w-4 mr-2" />
                  Histórico
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="comments" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-eshows-amber text-white">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea 
                          placeholder="Adicione um comentário..." 
                          className="min-h-24"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                          <Button 
                            onClick={handleAddComment} 
                            disabled={!newComment.trim() || isPostingComment}
                          >
                            {isPostingComment && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Comentar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {task.comments.length > 0 ? (
                  task.comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-eshows-amber text-white">
                              {getAvatarFallback(comment.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{comment.user.name}</h4>
                              <span className="text-sm text-gray-500">
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="mt-2">{comment.text}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Nenhum comentário. Seja o primeiro a comentar!
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="files">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Anexos</CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Adicionar arquivo
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adicionar anexo</DialogTitle>
                            <DialogDescription>
                              Selecione um arquivo para adicionar a esta tarefa.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="p-6 border-2 border-dashed rounded-lg text-center">
                            <p className="text-sm text-gray-500">
                              Arraste e solte ou clique para selecionar um arquivo
                            </p>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Enviar anexo</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {task.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {task.attachments.map((attachment) => (
                          <div 
                            key={attachment.id} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div className="p-2 bg-white rounded shadow">
                                {attachment.fileType.includes("image") ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                ) : attachment.fileType.includes("pdf") ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">{attachment.fileName}</p>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(attachment.fileSize)} • {formatDateTime(attachment.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Baixar
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum arquivo anexado a esta tarefa.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de atividades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {task.history.map((item) => (
                        <div key={item.id} className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-eshows-amber"></div>
                            <div className="h-full w-px bg-gray-200"></div>
                          </div>
                          <div>
                            <div className="flex gap-2">
                              <span className="font-medium">{item.user.name}</span>
                              <span className="text-gray-500">{getHistoryDescription(item)}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(item.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">{getStatusBadge(task.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Prioridade</h4>
                  <div className="mt-1">{getPriorityBadge(task.priority)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data de Entrega</h4>
                  <p className="mt-1">{formatDate(task.dueDate)}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Responsável</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-eshows-amber text-white">
                        {getAvatarFallback(task.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.assignee.name}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Criador</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-eshows-orange text-white">
                        {getAvatarFallback(task.creator.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.creator.name}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskDetailPage;

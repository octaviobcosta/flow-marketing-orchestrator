
import { useState, useEffect, useCallback, useRef } from "react";
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
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Plus,
  Trash2,
  Play,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronDown,
  Loader2,
  Users,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Edge,
  Connection,
  Panel,
  ReactFlowProvider,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { mockAPI } from "@/services/api";

// Node types definition
interface NodeData {
  label: string;
  type?: string;
  role?: string;
  sla?: number;
}

// Step node component
const StepNode = ({ data, isConnectable, selected }: NodeProps<NodeData>) => {
  const getIcon = () => {
    switch (data.type) {
      case "create":
        return <FileText className="h-4 w-4 mr-2" />;
      case "review":
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case "approve":
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case "publish":
        return <Play className="h-4 w-4 mr-2" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 mr-2" />;
      default:
        return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  const getBgColor = () => {
    switch (data.type) {
      case "create":
        return "bg-blue-50 border-blue-200";
      case "review":
        return "bg-amber-50 border-amber-200";
      case "approve":
        return "bg-green-50 border-green-200";
      case "publish":
        return "bg-purple-50 border-purple-200";
      case "alert":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={`p-3 rounded-md shadow-sm border ${getBgColor()} ${selected ? 'ring-2 ring-eshows-amber ring-opacity-70' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <div className="min-w-[150px]">
        <div className="flex items-center font-medium">
          {getIcon()}
          {data.label}
        </div>
        {(data.role || data.sla) && (
          <div className="mt-2 text-xs text-gray-500">
            {data.role && (
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Responsável: {data.role}
              </div>
            )}
            {data.sla && (
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                SLA: {data.sla} horas
              </div>
            )}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
};

// Node type mapping
const nodeTypes = {
  step: StepNode,
};

// Initial elements (empty workflow)
const initialNodes = [];
const initialEdges = [];

interface Workflow {
  id: number;
  name: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const WorkflowPage = () => {
  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState<string>("Novo Workflow");
  const [workflowDesc, setWorkflowDesc] = useState<string>("");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState<boolean>(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Load workflows on mount
  useEffect(() => {
    fetchWorkflows();
  }, []);

  // Load selected workflow when changed
  useEffect(() => {
    if (selectedWorkflow) {
      loadWorkflow(selectedWorkflow);
    }
  }, [selectedWorkflow]);

  const fetchWorkflows = async () => {
    try {
      // In real implementation, this would be a call to the actual API
      // const response = await mockAPI.getWorkflows();
      
      // Mock data for demonstration
      const mockWorkflows: Workflow[] = [
        {
          id: 1,
          name: "Workflow de Aprovação de Social Media",
          description: "Workflow para aprovação de conteúdo de redes sociais",
          version: 1,
          createdAt: "2025-04-10T09:00:00Z",
          updatedAt: "2025-04-15T14:30:00Z",
        },
        {
          id: 2,
          name: "Workflow de Lançamento de Produto",
          description: "Workflow para coordenar o lançamento de produtos",
          version: 2,
          createdAt: "2025-03-20T11:00:00Z",
          updatedAt: "2025-04-18T16:45:00Z",
        },
      ];
      
      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os workflows.",
      });
    }
  };

  const loadWorkflow = async (workflowId: number) => {
    try {
      setIsLoading(true);
      
      // In real implementation, this would be a call to the actual API
      // const response = await mockAPI.getWorkflow(workflowId.toString());
      
      // Mock data for demonstration
      const mockNodes = [
        {
          id: "1",
          type: "step",
          position: { x: 250, y: 50 },
          data: { 
            label: "Criar Conteúdo", 
            type: "create",
            role: "Content Creator",
            sla: 24
          }
        },
        {
          id: "2",
          type: "step",
          position: { x: 250, y: 200 },
          data: { 
            label: "Revisar", 
            type: "review",
            role: "Content Manager",
            sla: 12
          }
        },
        {
          id: "3",
          type: "step",
          position: { x: 250, y: 350 },
          data: { 
            label: "Aprovação Legal", 
            type: "approve",
            role: "Legal",
            sla: 48
          }
        },
        {
          id: "4",
          type: "step",
          position: { x: 250, y: 500 },
          data: { 
            label: "Publicar", 
            type: "publish",
            role: "Marketing",
            sla: 8
          }
        }
      ];
      
      const mockEdges = [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          animated: true,
          style: { stroke: "#9b87f5" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
        },
        {
          id: "e2-3",
          source: "2",
          target: "3",
          animated: true,
          style: { stroke: "#9b87f5" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
        },
        {
          id: "e3-4",
          source: "3",
          target: "4",
          animated: true,
          style: { stroke: "#9b87f5" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
        }
      ];
      
      const selectedWorkflowData = workflows.find(w => w.id === workflowId);
      if (selectedWorkflowData) {
        setWorkflowName(selectedWorkflowData.name);
        setWorkflowDesc(selectedWorkflowData.description);
        setNodes(mockNodes);
        setEdges(mockEdges);
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o workflow selecionado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#9b87f5" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const handleAddNode = (type: string) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: "step",
      position: {
        x: 250,
        y: nodes.length > 0 ? nodes[nodes.length - 1].position.y + 150 : 50,
      },
      data: {
        label: getDefaultLabel(type),
        type,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setEditingNode(newNode);
    setIsNodeDialogOpen(true);
  };

  const getDefaultLabel = (type: string) => {
    switch (type) {
      case "create":
        return "Criar Conteúdo";
      case "review":
        return "Revisar";
      case "approve":
        return "Aprovar";
      case "publish":
        return "Publicar";
      case "alert":
        return "Alerta";
      default:
        return "Novo Passo";
    }
  };

  const handleNodeClick = (event: any, node: any) => {
    setEditingNode(node);
    setIsNodeDialogOpen(true);
  };

  const updateNodeData = (label: string, role: string, sla: string) => {
    if (!editingNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === editingNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
              role,
              sla: sla ? parseInt(sla) : undefined,
            },
          };
        }
        return node;
      })
    );

    setIsNodeDialogOpen(false);
    setEditingNode(null);
  };

  const handleDeleteNode = () => {
    if (!editingNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== editingNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== editingNode.id && edge.target !== editingNode.id
      )
    );

    setIsNodeDialogOpen(false);
    setEditingNode(null);
  };

  const handleSaveWorkflow = async () => {
    try {
      setIsLoading(true);
      
      // In real implementation, this would be a call to the actual API
      // const payload = {
      //   name: workflowName,
      //   description: workflowDesc,
      //   nodes: nodes,
      //   edges: edges,
      // };
      // await mockAPI.createWorkflow(payload);
      
      toast({
        title: "Workflow salvo",
        description: "Workflow foi salvo com sucesso.",
      });
      
      fetchWorkflows();
      setIsSaveDialogOpen(false);
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o workflow.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewWorkflow = () => {
    setSelectedWorkflow(null);
    setWorkflowName("Novo Workflow");
    setWorkflowDesc("");
    setNodes([]);
    setEdges([]);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    
    if (typeof type === 'undefined' || !type) {
      return;
    }

    if (reactFlowInstance && reactFlowWrapper.current) {
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: `${nodes.length + 1}`,
        type: 'step',
        position,
        data: { label: getDefaultLabel(type), type },
      };

      setNodes((nds) => [...nds, newNode]);
      setEditingNode(newNode);
      setIsNodeDialogOpen(true);
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workflow Builder</h1>
            <p className="text-muted-foreground">
              Crie e gerencie seus fluxos de trabalho de marketing.
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Workflows
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCreateNewWorkflow}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo workflow
                </DropdownMenuItem>
                {workflows.map((workflow) => (
                  <DropdownMenuItem
                    key={workflow.id}
                    onClick={() => setSelectedWorkflow(workflow.id)}
                  >
                    {workflow.name} (v{workflow.version})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Workflow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Salvar Workflow</DialogTitle>
                  <DialogDescription>
                    Dê um nome e uma descrição para o seu workflow.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={workflowDesc}
                      onChange={(e) => setWorkflowDesc(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleSaveWorkflow}
                    disabled={isLoading || !workflowName}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with step types */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blocos</CardTitle>
                <CardDescription>
                  Arraste os blocos para o canvas ou clique para adicionar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div
                  draggable
                  onDragStart={(event) => onDragStart(event, "create")}
                  onClick={() => handleAddNode("create")}
                  className="bg-blue-50 border border-blue-200 rounded-md p-3 cursor-pointer hover:bg-blue-100 transition-colors flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Criar Conteúdo
                </div>
                <div
                  draggable
                  onDragStart={(event) => onDragStart(event, "review")}
                  onClick={() => handleAddNode("review")}
                  className="bg-amber-50 border border-amber-200 rounded-md p-3 cursor-pointer hover:bg-amber-100 transition-colors flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-amber-600" />
                  Revisar
                </div>
                <div
                  draggable
                  onDragStart={(event) => onDragStart(event, "approve")}
                  onClick={() => handleAddNode("approve")}
                  className="bg-green-50 border border-green-200 rounded-md p-3 cursor-pointer hover:bg-green-100 transition-colors flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Aprovar
                </div>
                <div
                  draggable
                  onDragStart={(event) => onDragStart(event, "publish")}
                  onClick={() => handleAddNode("publish")}
                  className="bg-purple-50 border border-purple-200 rounded-md p-3 cursor-pointer hover:bg-purple-100 transition-colors flex items-center"
                >
                  <Play className="h-4 w-4 mr-2 text-purple-600" />
                  Publicar
                </div>
                <div
                  draggable
                  onDragStart={(event) => onDragStart(event, "alert")}
                  onClick={() => handleAddNode("alert")}
                  className="bg-red-50 border border-red-200 rounded-md p-3 cursor-pointer hover:bg-red-100 transition-colors flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                  Alerta
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500">
                  Clique em uma etapa para editar seus detalhes
                </p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instruções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  <strong>1.</strong> Arraste os blocos para o canvas ou clique para adicionar.
                </p>
                <p>
                  <strong>2.</strong> Clique em um bloco para editar suas propriedades.
                </p>
                <p>
                  <strong>3.</strong> Conecte os blocos arrastando da saída para a entrada.
                </p>
                <p>
                  <strong>4.</strong> Salve o workflow quando terminar.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main canvas */}
          <div className="lg:col-span-3 h-[700px] border border-gray-200 rounded-md bg-white">
            <ReactFlowProvider>
              <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  onNodeClick={handleNodeClick}
                  onInit={setReactFlowInstance}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  fitView
                >
                  <Controls />
                  <MiniMap />
                  <Background color="#f8f8f8" gap={16} />
                  <Panel position="top-left">
                    <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                      <h3 className="font-medium text-sm">
                        {workflowName}
                      </h3>
                    </div>
                  </Panel>
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </div>

        {/* Node Edit Dialog */}
        <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Etapa</DialogTitle>
              <DialogDescription>
                Configure as propriedades desta etapa do workflow.
              </DialogDescription>
            </DialogHeader>
            {editingNode && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="step-name">Nome</Label>
                  <Input
                    id="step-name"
                    defaultValue={editingNode.data.label}
                    placeholder="Digite o nome da etapa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="step-role">Responsável</Label>
                  <Select defaultValue={editingNode.data.role || "marketing"}>
                    <SelectTrigger id="step-role">
                      <SelectValue placeholder="Selecione um papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="legal">Jurídico</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="director">Diretor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="step-sla">SLA (horas)</Label>
                  <Input
                    id="step-sla"
                    type="number"
                    min="1"
                    defaultValue={editingNode.data.sla || "24"}
                    placeholder="Tempo para conclusão em horas"
                  />
                </div>
              </div>
            )}
            <DialogFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleDeleteNode}
                type="button"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  const nameInput = document.getElementById('step-name') as HTMLInputElement;
                  const roleSelect = document.getElementById('step-role') as HTMLSelectElement;
                  const slaInput = document.getElementById('step-sla') as HTMLInputElement;
                  
                  updateNodeData(
                    nameInput.value,
                    roleSelect.value,
                    slaInput.value
                  );
                }}
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default WorkflowPage;

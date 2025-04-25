
import { useState, useEffect, useCallback, useRef } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Connection,
  Panel,
  ReactFlowProvider,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Save, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import the new components
import WorkflowNode, { WorkflowNodeData } from "@/components/workflow/WorkflowNode";
import BlockLibrary from "@/components/workflow/BlockLibrary";
import BlockEditor from "@/components/workflow/BlockEditor";
import { Workflow, WorkflowBlock, BlockType, User } from "@/types/workflow";
import { mockAPI } from "@/services/api";

// Node type mapping
const nodeTypes = {
  workflowNode: WorkflowNode,
};

// Initial elements (empty workflow)
const initialNodes: Node<WorkflowNodeData>[] = [];
const initialEdges: Edge[] = [];

const WorkflowPage = () => {
  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState<string>("Novo Workflow");
  const [workflowDesc, setWorkflowDesc] = useState<string>("");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState<boolean>(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [customBlocks, setCustomBlocks] = useState<BlockType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Load workflows on mount
  useEffect(() => {
    fetchWorkflows();
    fetchUsers();
  }, []);

  // Load selected workflow when changed
  useEffect(() => {
    if (selectedWorkflow) {
      loadWorkflow(selectedWorkflow);
    }
  }, [selectedWorkflow]);
  
  const fetchUsers = async () => {
    // Mock users data
    const mockUsers: User[] = [
      {
        id: "user-1",
        name: "João Silva",
        email: "joao.silva@example.com",
        position: "Designer",
        whatsapp: "11999887766",
        managerId: "user-3",
        avatar: "https://i.pravatar.cc/150?u=user1",
      },
      {
        id: "user-2",
        name: "Maria Oliveira",
        email: "maria.oliveira@example.com",
        position: "Copywriter",
        whatsapp: "11988776655",
        managerId: "user-3",
        avatar: "https://i.pravatar.cc/150?u=user2",
      },
      {
        id: "user-3",
        name: "Carlos Mendes",
        email: "carlos.mendes@example.com",
        position: "Marketing Manager",
        whatsapp: "11977665544",
        avatar: "https://i.pravatar.cc/150?u=user3",
      },
      {
        id: "user-demo-123",
        name: "Usuário Demonstração",
        email: "demo@eshows.com",
        position: "Admin",
        avatar: "https://i.pravatar.cc/150?u=demo",
      },
    ];
    
    setUsers(mockUsers);
  };

  const fetchWorkflows = async () => {
    try {
      // Usando dados mockados para demonstração
      const mockWorkflows: Workflow[] = [
        {
          id: "workflow-1",
          name: "Workflow de Aprovação de Social Media",
          description: "Workflow para aprovação de conteúdo de redes sociais",
          version: 1,
          createdAt: "2025-04-10T09:00:00Z",
          updatedAt: "2025-04-15T14:30:00Z",
          blocks: [],
          connections: []
        },
        {
          id: "workflow-2",
          name: "Workflow de Lançamento de Produto",
          description: "Workflow para coordenar o lançamento de produtos",
          version: 2,
          createdAt: "2025-03-20T11:00:00Z",
          updatedAt: "2025-04-18T16:45:00Z",
          blocks: [],
          connections: []
        },
      ];
      
      // Blocos personalizados de exemplo
      const mockCustomBlocks: BlockType[] = [
        {
          id: "custom-1",
          name: "Aprovação do Cliente",
          description: "Bloco para aprovação do cliente",
          color: "#ea5545",
          icon: "check-circle",
        },
        {
          id: "custom-2",
          name: "Revisão Legal",
          description: "Bloco para revisão pelo departamento jurídico",
          color: "#27aeef",
          icon: "file-text",
        },
      ];
      
      setWorkflows(mockWorkflows);
      setCustomBlocks(mockCustomBlocks);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os workflows.",
      });
    }
  };

  const loadWorkflow = async (workflowId: string) => {
    try {
      setIsLoading(true);
      
      // Dados mockados para demonstração
      const mockNodes: Node<WorkflowNodeData>[] = [
        {
          id: "1",
          type: "workflowNode",
          position: { x: 250, y: 50 },
          data: { 
            label: "Criar Conteúdo", 
            type: "create",
            role: "Content Creator",
            assignedUser: "João Silva",
            description: "Criar o conteúdo inicial para as redes sociais",
            sla: 24,
            status: "todo",
            dependencies: [],
            actions: ["comment", "upload"]
          }
        },
        {
          id: "2",
          type: "workflowNode",
          position: { x: 250, y: 200 },
          data: { 
            label: "Revisar", 
            type: "review",
            role: "Content Manager",
            assignedUser: "Maria Oliveira",
            description: "Revisar o conteúdo criado, verificando gramática e estilo",
            sla: 12,
            status: "todo",
            dependencies: ["1"],
            actions: ["approve", "reject", "comment"]
          }
        },
        {
          id: "3",
          type: "workflowNode",
          position: { x: 250, y: 350 },
          data: { 
            label: "Aprovação Legal", 
            type: "approve",
            role: "Legal",
            description: "Verificação jurídica do conteúdo",
            sla: 48,
            status: "todo",
            dependencies: ["2"],
            actions: ["approve", "reject", "comment", "return"]
          }
        },
        {
          id: "4",
          type: "workflowNode",
          position: { x: 250, y: 500 },
          data: { 
            label: "Publicar", 
            type: "publish",
            role: "Marketing",
            description: "Publicar o conteúdo nas redes sociais",
            sla: 8,
            status: "todo",
            dependencies: ["3"],
            actions: ["comment", "upload"]
          }
        }
      ];
      
      const mockEdges: Edge[] = [
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
    (params: Connection) => {
      const edge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        animated: true,
        style: { stroke: "#9b87f5" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      };
      
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const handleAddNode = (type: string) => {
    const newNode = {
      id: `${Date.now()}`,
      type: "workflowNode",
      position: {
        x: 250,
        y: nodes.length > 0 ? nodes[nodes.length - 1].position.y + 150 : 50,
      },
      data: {
        label: getDefaultLabel(type),
        type,
        description: "",
        role: "",
        sla: 24,
        status: "todo",
        dependencies: [],
        actions: []
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
      case "custom-1":
        return "Aprovação do Cliente";
      case "custom-2":
        return "Revisão Legal";
      default:
        if (type.startsWith("custom-")) {
          const customBlock = customBlocks.find(b => b.id === type);
          return customBlock ? customBlock.name : "Novo Passo";
        }
        return "Novo Passo";
    }
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setEditingNode(node);
    setIsNodeDialogOpen(true);
  };

  const updateNodeData = (updatedData: any) => {
    if (!editingNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === editingNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
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
  
  const handleSaveCustomBlock = (blockData: Partial<BlockType>) => {
    if (!blockData.name) return;
    
    const newBlock: BlockType = {
      id: blockData.id || `custom-${Date.now()}`,
      name: blockData.name,
      description: blockData.description || "",
      color: blockData.color || "#6366f1",
      icon: blockData.icon || "file-text",
    };
    
    setCustomBlocks([...customBlocks, newBlock]);
    
    toast({
      title: "Bloco personalizado criado",
      description: `O bloco "${newBlock.name}" foi criado com sucesso.`,
    });
  };

  const handleSaveWorkflow = async () => {
    try {
      setIsLoading(true);
      
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
        id: `${Date.now()}`,
        type: 'workflowNode',
        position,
        data: { 
          label: getDefaultLabel(type),
          type,
          description: "",
          role: "",
          sla: 24,
          status: "todo",
          dependencies: [],
          actions: []
        },
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
            <Button onClick={() => setIsSaveDialogOpen(true)}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Workflow
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <BlockLibrary 
              onDragStart={onDragStart} 
              onAddBlock={handleAddNode}
              onSaveCustomBlock={handleSaveCustomBlock}
              customBlocks={customBlocks}
            />
          </div>

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

        <BlockEditor 
          isOpen={isNodeDialogOpen}
          onClose={() => setIsNodeDialogOpen(false)}
          node={editingNode}
          onUpdate={updateNodeData}
          onDelete={handleDeleteNode}
          users={users}
        />
      </div>
    </MainLayout>
  );
};

export default WorkflowPage;

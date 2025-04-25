
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Clock,
  Info,
  List,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';

export interface WorkflowNodeData {
  label?: string;
  type?: string;
  role?: string;
  assignedUser?: string;
  description?: string;
  sla?: number;
  status?: string;
  dependencies?: string[];
  actions?: string[];
}

export const WorkflowNode = ({ data, isConnectable, selected }: NodeProps<WorkflowNodeData>) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (data.type) {
      case "create":
        return <FileText className="h-4 w-4 mr-2 text-blue-600" />;
      case "review":
        return <CheckCircle className="h-4 w-4 mr-2 text-amber-600" />;
      case "approve":
        return <CheckCircle className="h-4 w-4 mr-2 text-green-600" />;
      case "publish":
        return <FileText className="h-4 w-4 mr-2 text-purple-600" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 mr-2 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 mr-2 text-gray-600" />;
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

  const getStatusColor = () => {
    switch (data.status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={cn(
      `p-2 rounded-md shadow-sm border transition-all cursor-pointer`,
      getBgColor(),
      selected ? 'ring-2 ring-eshows-amber ring-opacity-70' : '',
      isExpanded ? 'min-w-[220px]' : 'min-w-[180px]'
    )}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border-2 border-white"
      />
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center font-medium text-sm">
            {getIcon()}
            {data.label || 'Unnamed Step'}
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        
        {/* Status Badge */}
        {data.status && (
          <Badge className={cn("mt-1 text-xs", getStatusColor())}>
            {data.status === 'todo' ? 'A fazer' : 
             data.status === 'in-progress' ? 'Em progresso' : 
             data.status === 'completed' ? 'Concluído' : 'Bloqueado'}
          </Badge>
        )}

        {/* Expanded view with additional info */}
        {isExpanded && (
          <div className="mt-2 text-xs space-y-1.5">
            {data.description && (
              <div className="text-gray-600 border-t pt-1 border-gray-200">
                <div className="flex items-start gap-1 mt-1">
                  <Info size={12} className="mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{data.description}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center text-gray-600">
              <Users className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>Papel: {data.role || 'Não definido'}</span>
            </div>
            
            {data.assignedUser && (
              <div className="flex items-center text-gray-600">
                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>Resp: {data.assignedUser}</span>
              </div>
            )}
            
            {data.sla && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>SLA: {data.sla} horas</span>
              </div>
            )}
            
            {data.dependencies && data.dependencies.length > 0 && (
              <div className="flex items-start text-gray-600">
                <List className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>Dependências: {data.dependencies.join(', ')}</span>
              </div>
            )}
            
            {data.actions && data.actions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {data.actions.map((action) => (
                  <Badge key={action} variant="outline" className="text-[10px] py-0 h-4">
                    {action === 'approve' ? 'Aprovar' : 
                     action === 'reject' ? 'Rejeitar' : 
                     action === 'comment' ? 'Comentar' : 
                     action === 'upload' ? 'Upload' : 'Devolver'}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-gray-400 border-2 border-white"
      />
    </div>
  );
};

export default WorkflowNode;

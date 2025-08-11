import React, { useState } from 'react';
import { Edit2, Trash2, Save, X, Plus, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { generatePDF, exportToExcel, exportToCSV } from '../utils/exportUtils';

interface Task {
  id: string;
  name: string;
  duration: string;
  status: 'concluido' | 'em_andamento' | 'atrasado' | 'não_iniciado';
  howTo: string;
  documents: string[];
}

interface ScheduleTableProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onTaskAdd: () => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete,
  onTaskAdd
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditedTask({ ...task });
  };

  const handleSave = () => {
    if (editedTask) {
      onTaskUpdate(editedTask);
    }
    setEditingId(null);
    setEditedTask(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedTask(null);
  };

  const handleInputChange = (field: keyof Task, value: string) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: value });
    }
  };

  const getStatusClass = (status: Task['status']) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'atrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'em_andamento':
        return 'Em Andamento';
      case 'atrasado':
        return 'Atrasado';
      case 'não_iniciado':
        return 'Não Iniciado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium text-lg">Cronograma de Tarefas</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="btn btn-outline flex items-center text-sm"
            >
              <Download size={16} className="mr-1" />
              Exportar
            </button>
            
            {showExportOptions && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 animate-fade-in"
                onMouseLeave={() => setShowExportOptions(false)}
              >
                <button 
                  onClick={() => generatePDF(tasks)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FileText size={16} className="mr-2 text-red-500" />
                  <span>Exportar para PDF</span>
                </button>
                <button 
                  onClick={() => exportToExcel(tasks)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FileSpreadsheet size={16} className="mr-2 text-green-600" />
                  <span>Exportar para Excel</span>
                </button>
                <button 
                  onClick={() => exportToCSV(tasks)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <FileText size={16} className="mr-2 text-blue-500" />
                  <span>Exportar para CSV</span>
                </button>
              </div>
            )}
          </div>
          
          <button onClick={onTaskAdd} className="btn btn-primary flex items-center text-sm">
            <Plus size={16} className="mr-1" />
            Nova Tarefa
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarefa/Etapa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duração
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Como Fazer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documentos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                {/* Task Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={editedTask?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm font-medium">{task.name}</span>
                  )}
                </td>

                {/* Duration */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={editedTask?.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{task.duration}</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === task.id ? (
                    <select
                      className="w-full p-1 border rounded"
                      value={editedTask?.status || ''}
                      onChange={(e) => handleInputChange('status', e.target.value as Task['status'])}
                    >
                      <option value="concluido">Concluído</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="atrasado">Atrasado</option>
                      <option value="não_iniciado">Não Iniciado</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusClass(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  )}
                </td>

                {/* How To */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={editedTask?.howTo || ''}
                      onChange={(e) => handleInputChange('howTo', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{task.howTo}</span>
                  )}
                </td>

                {/* Documents */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.documents.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {task.documents.map((doc, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Sem documentos</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === task.id ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSave} 
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={handleCancel} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(task)} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onTaskDelete(task.id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
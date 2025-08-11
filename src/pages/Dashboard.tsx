import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FilterPanel from '../components/FilterPanel';
import ScheduleTable from '../components/ScheduleTable';
import { Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  duration: string;
  status: 'concluido' | 'em_andamento' | 'atrasado' | 'não_iniciado';
  howTo: string;
  documents: string[];
}

interface Filters {
  developmentType?: string[];
  category?: string[];
  projectType?: string[];
  objective?: string[];
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Definição do Briefing',
      duration: '3 dias',
      status: 'concluido',
      howTo: 'Reunião com stakeholders',
      documents: ['briefing.pdf', 'requisitos.docx']
    },
    {
      id: '2',
      name: 'Pesquisa de Mercado',
      duration: '5 dias',
      status: 'em_andamento',
      howTo: 'Análise de concorrência',
      documents: ['pesquisa.xlsx']
    },
    {
      id: '3',
      name: 'Desenvolvimento de Protótipo',
      duration: '10 dias',
      status: 'não_iniciado',
      howTo: 'Usar software CAD',
      documents: []
    },
    {
      id: '4',
      name: 'Teste de Materiais',
      duration: '7 dias',
      status: 'atrasado',
      howTo: 'Testes de resistência',
      documents: ['especificacoes.pdf']
    }
  ]);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    // Apply filters to tasks
    let result = [...tasks];
    
    // This is a simple example of filtering - in a real app, you'd have more complex logic
    if (filters.developmentType?.length || 
        filters.category?.length || 
        filters.projectType?.length || 
        filters.objective?.length) {
      // For this demo, we're just simulating filtering by showing fewer items
      result = result.slice(0, 2);
    }
    
    setFilteredTasks(result);
  }, [tasks, filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  const handleTaskDelete = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: 'Nova Tarefa',
      duration: '5 dias',
      status: 'não_iniciado',
      howTo: '',
      documents: []
    };
    setTasks([...tasks, newTask]);
  };

  // Calculate dashboard stats
  const completedTasks = tasks.filter(task => task.status === 'concluido').length;
  const inProgressTasks = tasks.filter(task => task.status === 'em_andamento').length;
  const delayedTasks = tasks.filter(task => task.status === 'atrasado').length;

  return (
    <Layout title="Cronograma Modular">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Tarefas</p>
              <h3 className="text-2xl font-semibold">{tasks.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Concluídas</p>
              <h3 className="text-2xl font-semibold">{completedTasks}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <Users className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Em Andamento</p>
              <h3 className="text-2xl font-semibold">{inProgressTasks}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Atrasadas</p>
              <h3 className="text-2xl font-semibold">{delayedTasks}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <FilterPanel onFilterChange={handleFilterChange} />
      
      <ScheduleTable 
        tasks={filteredTasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskAdd={handleAddTask}
      />
    </Layout>
  );
};

export default Dashboard;
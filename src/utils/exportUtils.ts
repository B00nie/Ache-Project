import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Task {
  id: string;
  name: string;
  duration: string;
  status: string;
  howTo: string;
  documents: string[];
}

// Helper function to translate status
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'concluido': 'Concluído',
    'em_andamento': 'Em Andamento',
    'atrasado': 'Atrasado',
    'não_iniciado': 'Não Iniciado',
  };
  return statusMap[status] || status;
};

// Export to PDF
export const generatePDF = (tasks: Task[]): void => {
  const doc = new jsPDF();

  // Add title and date
  doc.setFontSize(20);
  doc.text('Cronograma Modular', 14, 22);
  doc.setFontSize(10);
  
  const currentDate = new Date().toLocaleDateString('pt-BR');
  doc.text(`Data: ${currentDate}`, 14, 32);
  
  // Create table
  const tableColumn = ['Tarefa', 'Duração', 'Status', 'Como Fazer', 'Documentos'];
  const tableRows = tasks.map(task => [
    task.name,
    task.duration,
    translateStatus(task.status),
    task.howTo,
    task.documents.join(', ')
  ]);

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { 
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [217, 37, 103],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [242, 242, 242]
    }
  });

  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    doc.setFontSize(8);
    doc.text('Cronograma Modular - Documento Gerado Automaticamente', 14, pageHeight - 10);
  }

  // Save PDF
  doc.save('cronograma_modular.pdf');
};

// Export to Excel
export const exportToExcel = (tasks: Task[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(
    tasks.map(task => ({
      Tarefa: task.name,
      Duração: task.duration,
      Status: translateStatus(task.status),
      'Como Fazer': task.howTo,
      Documentos: task.documents.join(', ')
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cronograma');
  
  // Generate file
  XLSX.writeFile(workbook, 'cronograma_modular.xlsx');
};

// Export to CSV
export const exportToCSV = (tasks: Task[]): void => {
  const headers = ['Tarefa', 'Duração', 'Status', 'Como Fazer', 'Documentos'];
  
  // Convert tasks to CSV format
  let csvContent = headers.join(',') + '\n';
  
  tasks.forEach(task => {
    const row = [
      `"${task.name}"`,
      `"${task.duration}"`,
      `"${translateStatus(task.status)}"`,
      `"${task.howTo}"`,
      `"${task.documents.join(', ')}"`
    ];
    csvContent += row.join(',') + '\n';
  });
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'cronograma_modular.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
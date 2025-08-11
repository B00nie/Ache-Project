import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Camera, Cpu, Play, Square, Check, XCircle, Download, RefreshCw, Upload, Database } from 'lucide-react';

interface AnalysisResult {
  id: string;
  timestamp: Date;
  status: 'approved' | 'rejected';
  image: string;
  defects: string[];
  metrics: {
    dimensions: string;
    weight: string;
    quality: number;
  };
}

const PackagingAnalysis: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [recording, setRecording] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([
    {
      id: '1',
      timestamp: new Date(2024, 5, 15, 14, 30),
      status: 'approved',
      image: 'https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=300',
      defects: [],
      metrics: {
        dimensions: '10x5x2 cm',
        weight: '150g',
        quality: 98
      }
    },
    {
      id: '2',
      timestamp: new Date(2024, 5, 14, 11, 15),
      status: 'rejected',
      image: 'https://images.pexels.com/photos/2882634/pexels-photo-2882634.jpeg?auto=compress&cs=tinysrgb&w=300',
      defects: ['Irregularidade na borda', 'Deformidade na tampa'],
      metrics: {
        dimensions: '10x5x2 cm',
        weight: '148g',
        quality: 72
      }
    }
  ]);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'Sistema de Análise de Embalagens v1.0',
    'Aguardando conexão com ESP...'
  ]);

  const toggleConnection = () => {
    setConnected(!connected);
    if (!connected) {
      addConsoleMessage('ESP conectado com sucesso');
      addConsoleMessage('Firmware versão 2.3.1');
      addConsoleMessage('Sensor de imagem inicializado');
      addConsoleMessage('Sistema pronto para análise');
    } else {
      setRecording(false);
      addConsoleMessage('ESP desconectado');
    }
  };

  const toggleRecording = () => {
    if (!connected) return;
    
    setRecording(!recording);
    if (!recording) {
      addConsoleMessage('Iniciando análise de embalagem...');
      addConsoleMessage('Capturando imagem...');
      simulateAnalysis();
    } else {
      addConsoleMessage('Análise interrompida pelo usuário');
    }
  };

  const addConsoleMessage = (message: string) => {
    setConsoleOutput(prev => [...prev, message]);
  };

  const simulateAnalysis = () => {
    const messages = [
      { message: 'Processando imagem...', delay: 1000 },
      { message: 'Executando detecção de bordas...', delay: 2000 },
      { message: 'Verificando dimensões...', delay: 3000 },
      { message: 'Analisando textura e uniformidade...', delay: 4000 },
      { message: 'Gerando relatório...', delay: 5000 }
    ];

    messages.forEach(({ message, delay }) => {
      setTimeout(() => {
        addConsoleMessage(message);
        
        if (delay === messages[messages.length - 1].delay) {
          setTimeout(() => {
            const success = Math.random() > 0.3;
            
            addConsoleMessage(success ? 
              'Análise concluída: Embalagem aprovada' : 
              'Análise concluída: Embalagem rejeitada - defeitos encontrados'
            );
            
            const newResult: AnalysisResult = {
              id: Date.now().toString(),
              timestamp: new Date(),
              status: success ? 'approved' : 'rejected',
              image: success ? 
                'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=300' : 
                'https://images.pexels.com/photos/5966437/pexels-photo-5966437.jpeg?auto=compress&cs=tinysrgb&w=300',
              defects: success ? [] : ['Irregularidade na superfície', 'Variação de espessura'],
              metrics: {
                dimensions: '10x5x2 cm',
                weight: `${145 + Math.floor(Math.random() * 10)}g`,
                quality: success ? 95 + Math.floor(Math.random() * 5) : 65 + Math.floor(Math.random() * 15)
              }
            };
            
            setResults(prev => [newResult, ...prev]);
            setRecording(false);
          }, 1000);
        }
      }, delay);
    });
  };

  return (
    <Layout title="Análise de Embalagens">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Camera feed and controls */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg flex items-center">
                <Camera className="text-primary mr-2" size={20} />
                Visualização da Câmera
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={toggleConnection}
                  className={`px-4 py-2 rounded text-sm font-medium flex items-center transition-colors ${
                    connected 
                      ? 'bg-primary text-white hover:bg-opacity-90' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  <Cpu className="mr-1" size={16} />
                  {connected ? 'Desconectar ESP' : 'Conectar ESP'}
                </button>
                <button
                  disabled={!connected}
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded text-sm font-medium flex items-center transition-colors ${
                    !connected
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : recording
                      ? 'bg-primary text-white hover:bg-opacity-90'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {recording ? (
                    <>
                      <Square className="mr-1" size={16} />
                      Parar
                    </>
                  ) : (
                    <>
                      <Play className="mr-1" size={16} />
                      Iniciar Análise
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative bg-gray-900 h-96 rounded-lg flex items-center justify-center overflow-hidden">
              {connected ? (
                recording ? (
                  <div className="relative w-full h-full">
                    <video
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smart-watch-with-white-background-40969-large.mp4" type="video/mp4" />
                      Seu navegador não suporta vídeo.
                    </video>
                    <div className="absolute top-4 right-4 flex items-center bg-red-600 px-2 py-1 rounded-full text-white text-xs animate-pulse">
                      <span className="h-2 w-2 bg-white rounded-full mr-1"></span>
                      REC
                    </div>
                    <div className="absolute inset-0 border-4 border-primary pointer-events-none"></div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src="https://images.pexels.com/photos/5966437/pexels-photo-5966437.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Camera feed static"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex items-center bg-gray-800 bg-opacity-75 px-2 py-1 rounded text-white text-xs">
                      Pronto para análise
                    </div>
                  </div>
                )
              ) : (
                <div className="text-white text-center">
                  <Camera size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Conecte o ESP para visualizar a câmera</p>
                </div>
              )}
            </div>
          </div>

          {/* Console output */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Cpu className="text-primary mr-2" size={20} />
              Console do Sistema
            </h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md h-48 overflow-y-auto font-mono text-sm">
              {consoleOutput.map((line, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">{`> `}</span>
                  {line}
                </div>
              ))}
              <div className="animate-pulse">_</div>
            </div>
          </div>
        </div>

        {/* Results panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg flex items-center">
                <Database className="text-primary mr-2" size={20} />
                Resultados da Análise
              </h3>
              <div className="flex space-x-2">
                <button className="text-primary hover:text-primary-light">
                  <RefreshCw size={18} />
                </button>
                <button className="text-primary hover:text-primary-light">
                  <Upload size={18} />
                </button>
                <button className="text-primary hover:text-primary-light">
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className={`border rounded-lg p-3 ${
                    result.status === 'approved' ? 'border-green-200' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="h-20 w-20 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={result.image}
                        alt="Analysis result"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            result.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {result.timestamp.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex">
                          {result.status === 'approved' ? (
                            <Check size={20} className="text-green-500" />
                          ) : (
                            <XCircle size={20} className="text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Dimensões</p>
                            <p className="font-medium">{result.metrics.dimensions}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Peso</p>
                            <p className="font-medium">{result.metrics.weight}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Qualidade</p>
                            <p className={`font-medium ${
                              result.metrics.quality > 90
                                ? 'text-green-600'
                                : result.metrics.quality > 75
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}>{result.metrics.quality}%</p>
                          </div>
                        </div>
                      </div>
                      
                      {result.defects.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-red-600 font-medium">Defeitos encontrados:</p>
                          <ul className="text-xs list-disc list-inside text-red-600 pl-2 mt-1">
                            {result.defects.map((defect, index) => (
                              <li key={index}>{defect}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PackagingAnalysis;
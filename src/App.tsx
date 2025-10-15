import React, { useState } from 'react';
import { Building, Users, LogOut, MessageSquare, X } from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { BuildingVisualization } from './components/BuildingVisualization';
import { WebRvizConfiguration } from './components/WebRvizConfiguration';
import { UploadModal } from './components/UploadModal';
import { BuildingEditor } from './components/BuildingEditor';
import { RobotManagement } from './components/RobotManagement';
import { useBuildingManager } from './hooks/useBuildingManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('building');
  const {
    building,
    messages,
    isProcessing,
    sendMessage,
    uploadMap,
    uploadFixture,
    deleteMap,
    deleteFixture,
    updateBuilding,
    clearBuilding,
  } = useBuildingManager();

  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    type: 'restroom' | 'corridor';
    floorId: string;
    componentId: string;
    componentName: string;
    existingMap: string;
    existingFixture: string;
  }>({
    isOpen: false,
    type: 'restroom',
    floorId: '',
    componentId: '',
    componentName: '',
    existingMap: '',
    existingFixture: '',
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(sidebarCollapsed);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Note: Building data persists across logins - only cleared explicitly
  };

  const handleComponentClick = (type: 'restroom' | 'corridor', floorId: string, componentId: string) => {
    if (!building) return;

    const floor = building.floors.find(f => f.id === floorId);
    if (!floor) return;

    let componentName = '';
    let existingMap = '';
    let existingFixture = '';
    if (type === 'restroom') {
      const restroom = floor.restrooms.find(r => r.id === componentId);
      componentName = restroom?.name || '';
      existingMap = restroom?.map2D || '';
      existingFixture = restroom?.fixtureDetails || '';
    } else {
      const corridor = floor.corridors.find(c => c.id === componentId);
      componentName = corridor?.name || '';
      existingMap = corridor?.map2D || '';
    }

    setUploadModal({
      isOpen: true,
      type,
      floorId,
      componentId,
      componentName: `Floor ${floor.number} - ${componentName}`,
      existingMap,
      existingFixture,
    });
  };

  const handleUpload = (file: File) => {
    uploadMap(uploadModal.type, uploadModal.floorId, uploadModal.componentId, file);
    
    // Update the modal state to show the newly uploaded map
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadModal(prev => ({
        ...prev,
        existingMap: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadFixture = (file: File) => {
    uploadFixture(uploadModal.floorId, uploadModal.componentId, file);
    // Update the modal state to reflect the new fixture
    setUploadModal(prev => ({
      ...prev,
      existingFixture: URL.createObjectURL(file)
    }));
  };

  const handleDeleteMap = () => {
    deleteMap(uploadModal.type, uploadModal.floorId, uploadModal.componentId);
  };

  const handleDeleteFixture = () => {
    deleteFixture(uploadModal.floorId, uploadModal.componentId);
    setUploadModal(prev => ({ ...prev, existingFixture: '' }));
  };

  const closeUploadModal = () => {
    setUploadModal(prev => ({ ...prev, isOpen: false, existingMap: '', existingFixture: '' }));
  };

  const handleEditBuilding = () => {
    setIsEditorOpen(true);
  };

  const handleSaveBuilding = (updatedBuilding: any) => {
    updateBuilding(updatedBuilding);
    setIsEditorOpen(false);
  };

  const handleClearBuilding = () => {
    if (window.confirm('Are you sure you want to clear all building data? This action cannot be undone.')) {
      clearBuilding();
    }
  };

  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
  };

  const renderMainContent = () => {
    switch (selectedMenu) {
      case 'building':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Building Overview</h2>
              <p className="text-slate-400">
                Interactive view of your building. Click on components to upload 2D maps. Use the chat assistant for configuration help.
              </p>
            </div>
            
            <BuildingVisualization
              building={building}
              onComponentClick={handleComponentClick}
              onEditBuilding={handleEditBuilding}
              onClearBuilding={handleClearBuilding}
            />
          </div>
        );
      case 'webrviz':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Web RVIZ Configuration</h2>
              <p className="text-slate-400">
                Manage restroom details and toilet fixtures for Web RVIZ visualization.
              </p>
            </div>
            <WebRvizConfiguration building={building} />
          </div>
        );
      case 'gazebo':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Gazebo Configuration</h2>
              <p className="text-slate-400">
                Gazebo simulation configuration options.
              </p>
            </div>
            <div className="bg-slate-900 rounded-xl shadow-2xl p-8 text-center">
              <div className="text-slate-400">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-slate-700 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Coming Soon</h3>
                <p className="text-slate-500">Gazebo configuration features will be available soon</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
              <p className="text-slate-400">
                Application settings and preferences.
              </p>
            </div>
            <div className="bg-slate-900 rounded-xl shadow-2xl p-8 text-center">
              <div className="text-slate-400">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-slate-700 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Settings</h3>
                <p className="text-slate-500">Settings panel will be available soon</p>
              </div>
            </div>
          </div>
        );
      case 'robots':
        return <RobotManagement />;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <Sidebar 
        building={building}
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        selectedMenu={selectedMenu}
        onMenuSelect={handleMenuSelect}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
       <header className="bg-slate-900 border-b border-slate-800 shadow-lg">
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center space-x-4">
        {/* Replace Building icon with logo */}
        <div className="bg-white p-2 rounded-lg">
          <img
            src="/logo2.png"
            alt="Site Wise Logo"
            className="w-10 h-10 rounded-md object-contain"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">Site Wise</h1>
          <p className="text-sm text-slate-400">Dynamic Site Manager</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Users className="h-4 w-4" />
          <span>Building Assistant</span>
        </div>
        <div className="h-8 w-px bg-slate-700"></div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  </div>
</header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {renderMainContent()}
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={closeUploadModal}
        onUpload={handleUpload}
        onDeleteMap={handleDeleteMap}
        onUploadFixture={handleUploadFixture}
        onDeleteFixture={handleDeleteFixture}
        componentType={uploadModal.type}
        componentName={uploadModal.componentName}
        existingMap={uploadModal.existingMap}
        existingFixture={uploadModal.existingFixture}
      />

      {/* Building Editor */}
      <BuildingEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        building={building}
        onSave={handleSaveBuilding}
      />

      {/* Floating Chat Interface - Only show on building tab */}
      {selectedMenu === 'building' && (
        <>
          {/* Chat Window */}
          {isChatOpen && (
            <div className="fixed bottom-20 right-6 w-96 h-96 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 z-30">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                isProcessing={isProcessing}
                isFloating={true}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}

          {/* Chat Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-40 ${
              isChatOpen
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title={isChatOpen ? 'Close Chat' : 'Open Building Assistant'}
          >
            {isChatOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageSquare className="h-6 w-6 text-white" />
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
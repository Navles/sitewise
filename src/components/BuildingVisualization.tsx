import React from 'react';
import { Building } from '../types';
import { FloorComponent } from './FloorComponent';
import { Edit3, Trash2 } from 'lucide-react';

interface BuildingVisualizationProps {
  building: Building | null;
  onComponentClick: (type: 'restroom' | 'corridor', floorId: string, componentId: string) => void;
  onEditBuilding: () => void;
  onClearBuilding: () => void;
}

export const BuildingVisualization: React.FC<BuildingVisualizationProps> = ({
  building,
  onComponentClick,
  onEditBuilding,
  onClearBuilding,
}) => {
  if (!building) {
    return (
      <div className="bg-slate-900 rounded-xl shadow-2xl p-8 text-center">
        <div className="text-slate-400">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 bg-slate-700 rounded"></div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">No Building Configured</h3>
          <p className="text-slate-500">Use the chat interface to configure your building</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="bg-blue-900 px-6 py-4 rounded-t-xl border-b border-blue-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">{building.name}</h2>
          <p className="text-blue-300">{building.totalFloors} Floors</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onEditBuilding}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Building</span>
          </button>
          <button
            onClick={onClearBuilding}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            title="Clear all building data"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Building</span>
          </button>
        </div>
      </div>

      {/* Building Visualization */}
      <div className="p-6">
        <div className="space-y-6">
          {building.floors
            .sort((a, b) => b.number - a.number)
            .map((floor) => (
              <FloorComponent
                key={floor.id}
                floor={floor}
                onComponentClick={onComponentClick}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
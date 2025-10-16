import React, { useState } from 'react';
import { Building2, ChevronDown, Check, Plus } from 'lucide-react';
import { Building } from '../types';

interface BuildingSelectorProps {
  buildings: Building[];
  activeBuilding: string | null;
  onSelectBuilding: (buildingId: string) => void;
  onCreateNew?: () => void;
}

export const BuildingSelector: React.FC<BuildingSelectorProps> = ({
  buildings,
  activeBuilding,
  onSelectBuilding,
  onCreateNew,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentBuilding = buildings.find(b => b.id === activeBuilding);

  if (buildings.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm text-slate-400">Selected Building</p>
            <p className="text-white font-medium">
              {currentBuilding ? currentBuilding.name : 'No Building Selected'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-20 max-h-80 overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Your Buildings</p>
                  <p className="text-xs text-slate-400">
                    {buildings.length} building{buildings.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                {onCreateNew && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onCreateNew();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    title="Create New Building"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Building List */}
            <div className="py-2">
              {buildings.map((building) => {
                const isActive = building.id === activeBuilding;
                const totalRestrooms = building.floors.reduce(
                  (sum, floor) => sum + floor.restrooms.length,
                  0
                );
                const totalCorridors = building.floors.reduce(
                  (sum, floor) => sum + floor.corridors.length,
                  0
                );

                return (
                  <button
                    key={building.id}
                    onClick={() => {
                      onSelectBuilding(building.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors ${
                      isActive ? 'bg-slate-700' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded ${
                          isActive ? 'bg-blue-600' : 'bg-slate-600'
                        }`}
                      >
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium flex items-center space-x-2">
                          <span>{building.name}</span>
                          {isActive && (
                            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400">
                          {building.totalFloors} floors • {totalRestrooms} restrooms • {totalCorridors} corridors
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-900">
              <p className="text-xs text-slate-400">
                💡 Tip: Use chat commands like "Switch to Building Name" or create new buildings anytime
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
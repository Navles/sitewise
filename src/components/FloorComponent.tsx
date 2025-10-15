import React from 'react';
import { Floor } from '../types';
import { Building2, DoorOpen, MapPin, Navigation } from 'lucide-react';

interface FloorComponentProps {
  floor: Floor;
  onComponentClick: (type: 'restroom' | 'corridor', floorId: string, componentId: string) => void;
}

export const FloorComponent: React.FC<FloorComponentProps> = ({
  floor,
  onComponentClick,
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Floor Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {floor.name || `Floor ${floor.number}`}
            </h3>
            <p className="text-slate-400">
              {floor.restrooms.length} Restrooms • {floor.corridors.length} Corridors
            </p>
          </div>
        </div>
      </div>

      {/* Floor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restrooms */}
        <div>
          <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
            <DoorOpen className="h-4 w-4" />
            <span>Restrooms</span>
          </h4>
          <div className="space-y-3">
            {floor.restrooms.map((restroom) => (
              <button
                key={restroom.id}
                onClick={() => onComponentClick('restroom', floor.id, restroom.id)}
                className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 text-left transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-600 p-2 rounded">
                      <DoorOpen className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{restroom.name}</p>
                      <p className="text-slate-400 text-sm">
                        {restroom.map2D && restroom.fixtureDetails 
                          ? '2D Map, 3D Map & Fixtures Available' 
                          : restroom.map2D 
                            ? '2D & 3D Maps Available' 
                            : restroom.fixtureDetails
                              ? 'Fixtures Available'
                              : 'Click to upload content'}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 group-hover:text-white transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Corridors */}
        <div>
          <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span>Corridors</span>
          </h4>
          <div className="space-y-3">
            {floor.corridors.map((corridor) => (
              <button
                key={corridor.id}
                onClick={() => onComponentClick('corridor', floor.id, corridor.id)}
                className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 text-left transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-600 p-2 rounded">
                      <Navigation className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{corridor.name}</p>
                      <p className="text-slate-400 text-sm">
                        {corridor.lifts.length} Lifts • {corridor.map2D ? '2D & 3D Maps Available' : 'Click to upload 2D map'}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 group-hover:text-white transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
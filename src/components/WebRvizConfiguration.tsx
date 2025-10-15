import React, { useState, useMemo } from 'react';
import { Monitor, DoorOpen, Wrench, ChevronDown, ChevronUp, MapPin, Eye } from 'lucide-react';
import { Building } from '../types';

interface WebRvizConfigurationProps {
  building: Building | null;
}

export const WebRvizConfiguration: React.FC<WebRvizConfigurationProps> = ({
  building,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    restrooms: true,
    fixtures: true,
  });

  const toggleSection = (key: keyof typeof expandedSections) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Derived data
  const allRestrooms = useMemo(
    () =>
      building?.floors.flatMap((floor) =>
        floor.restrooms.map((restroom) => ({
          ...restroom,
          floorNumber: floor.number,
        }))
      ) ?? [],
    [building]
  );

  const allFixtures = useMemo(
    () => allRestrooms.filter((r: any) => r.fixtureDetails),
    [allRestrooms]
  );

  if (!building) {
    return (
      <div className="bg-slate-900 rounded-xl shadow-2xl p-8 text-center">
        <div className="text-slate-400">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-lg flex items-center justify-center">
            <Monitor className="w-12 h-12 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">No Building Configured</h3>
          <p className="text-slate-500">Configure your building first to view Web RVIZ details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="bg-green-900 px-6 py-4 rounded-t-xl border-b border-green-800">
        <div className="flex items-center space-x-3">
          <Monitor className="h-6 w-6 text-green-300" />
          <div>
            <h2 className="text-xl font-bold text-white">Web RVIZ Configuration</h2>
            <p className="text-green-300">Restroom and Fixture Management</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{allRestrooms.length}</div>
              <div className="text-slate-400">Total Restrooms</div>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{allFixtures.length}</div>
              <div className="text-slate-400">Fixture Details</div>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {allRestrooms.filter((r: any) => r.map2D).length}
              </div>
              <div className="text-slate-400">2D Maps Available</div>
            </div>
          </div>
        </div>

        {/* Restrooms Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => toggleSection('restrooms')}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <DoorOpen className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Restroom Details</h3>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {allRestrooms.length}
              </span>
            </div>
            {expandedSections.restrooms ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {expandedSections.restrooms && (
            <div className="border-t border-slate-700">
              {allRestrooms.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <DoorOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No restrooms configured</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {allRestrooms
                    .sort((a: any, b: any) => a.floorNumber - b.floorNumber)
                    .map((restroom: any) => (
                      <div
                        key={restroom.id}
                        className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded">
                              <DoorOpen className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{restroom.name}</h4>
                              <p className="text-slate-400 text-sm">Floor {restroom.floorNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {restroom.map2D && (
                              <div className="flex items-center space-x-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                <MapPin className="h-3 w-3" />
                                <span>2D Map</span>
                              </div>
                            )}
                            {restroom.fixtureDetails && (
                              <div className="flex items-center space-x-1 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                                <Wrench className="h-3 w-3" />
                                <span>Fixtures</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixtures Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => toggleSection('fixtures')}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Wrench className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Toilet Fixture Details</h3>
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                {allFixtures.length}
              </span>
            </div>
            {expandedSections.fixtures ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {expandedSections.fixtures && (
            <div className="border-t border-slate-700">
              {allFixtures.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fixture details available</p>
                  <p className="text-sm mt-2">Upload fixture details from the Building Configuration</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {allFixtures
                    .sort((a: any, b: any) => a.floorNumber - b.floorNumber)
                    .map((fixture: any) => (
                      <div
                        key={fixture.id}
                        className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="bg-orange-600 p-2 rounded">
                              <Wrench className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{fixture.name}</h4>
                              <p className="text-slate-400 text-sm mb-2">Floor {fixture.floorNumber}</p>
                              {fixture.fixtureDetails && (
                                <div className="mt-3">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Eye className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-300 text-sm">Fixture Preview</span>
                                  </div>
                                  <img
                                    src={fixture.fixtureDetails}
                                    alt={`${fixture.name} fixtures`}
                                    className="w-full h-32 object-cover rounded border border-slate-600"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from "react";
import {
  X,
  Building,
  Save,
  Plus,
  Trash2,
  Users,
  Navigation,
  Zap,
  Layers,
} from "lucide-react";
import {
  Building as BuildingType,
  Restroom,
  Corridor,
  Lift,
  Floor,
} from "../types";

interface BuildingEditorProps {
  isOpen: boolean;
  onClose: () => void;
  building: BuildingType | null;
  onSave: (building: BuildingType) => void;
}

// Helper to create a default floor with two restrooms, two corridors, two lifts each
const createDefaultFloor = (number: number): Floor => {
  const floorId = `floor-${number}-${Date.now()}`;
  const restrooms: Restroom[] = Array.from({ length: 2 }, (_, j) => ({
    id: `${floorId}-restroom-${j + 1}`,
    name: `Restroom ${j + 1}`,
    position: { x: 100 + j * 150, y: 50 },
  }));

  const corridors: Corridor[] = Array.from({ length: 2 }, (_, j) => ({
    id: `${floorId}-corridor-${j + 1}`,
    name: `Corridor ${j + 1}`,
    position: { x: 100, y: 200 + j * 100 },
    lifts: Array.from({ length: 2 }, (_, k) => ({
      id: `${floorId}-corridor-${j + 1}-lift-${k + 1}`,
      position: { x: 50 + k * 100, y: 200 + j * 100 },
    })),
  }));

  return { id: floorId, number, restrooms, corridors };
};

export const BuildingEditor: React.FC<BuildingEditorProps> = ({
  isOpen,
  onClose,
  building,
  onSave,
}) => {
  const [editedBuilding, setEditedBuilding] = useState<BuildingType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"general" | "floors">("general");

  useEffect(() => {
    if (building) {
      setEditedBuilding(JSON.parse(JSON.stringify(building))); // Deep copy
    } else {
      // Create default 5-floor building
      const floors = Array.from({ length: 5 }, (_, i) =>
        createDefaultFloor(i + 1)
      );
      const defaultBuilding: BuildingType = {
        id: "main-building",
        name: "My Building",
        totalFloors: 5,
        floors,
      };
      setEditedBuilding(defaultBuilding);
    }
  }, [building, isOpen]);

  if (!isOpen || !editedBuilding) return null;

  const handleSave = () => {
    if (editedBuilding) {
      // ensure totalFloors matches floors.length
      const payload: BuildingType = {
        ...editedBuilding,
        totalFloors: editedBuilding.floors.length,
      };
      onSave(payload);
      onClose();
    }
  };

  const updateBuildingName = (name: string) => {
    setEditedBuilding((prev) => (prev ? { ...prev, name } : null));
  };

  const updateRestroomName = (
    floorId: string,
    restroomId: string,
    name: string
  ) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                restrooms: floor.restrooms.map((restroom) =>
                  restroom.id === restroomId ? { ...restroom, name } : restroom
                ),
              }
            : floor
        ),
      };
    });
  };

  const updateCorridorName = (
    floorId: string,
    corridorId: string,
    name: string
  ) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                corridors: floor.corridors.map((corridor) =>
                  corridor.id === corridorId ? { ...corridor, name } : corridor
                ),
              }
            : floor
        ),
      };
    });
  };

  const addRestroom = (floorId: string) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) => {
          if (floor.id === floorId) {
            const newRestroom: Restroom = {
              id: `${floorId}-restroom-${Date.now()}`,
              name: `Restroom ${floor.restrooms.length + 1}`,
              position: { x: 100 + floor.restrooms.length * 150, y: 50 },
            };
            return { ...floor, restrooms: [...floor.restrooms, newRestroom] };
          }
          return floor;
        }),
      };
    });
  };

  const removeRestroom = (floorId: string, restroomId: string) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                restrooms: floor.restrooms.filter((r) => r.id !== restroomId),
              }
            : floor
        ),
      };
    });
  };

  const addCorridor = (floorId: string) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) => {
          if (floor.id === floorId) {
            const corrIdx = floor.corridors.length + 1;
            const newCorridor: Corridor = {
              id: `${floorId}-corridor-${Date.now()}`,
              name: `Corridor ${corrIdx}`,
              position: { x: 100, y: 200 + floor.corridors.length * 100 },
              lifts: Array.from({ length: 2 }, (_, k) => ({
                id: `${floorId}-corridor-${Date.now()}-lift-${k + 1}`,
                position: {
                  x: 50 + k * 100,
                  y: 200 + floor.corridors.length * 100,
                },
              })),
            };
            return { ...floor, corridors: [...floor.corridors, newCorridor] };
          }
          return floor;
        }),
      };
    });
  };

  const removeCorridor = (floorId: string, corridorId: string) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                corridors: floor.corridors.filter((c) => c.id !== corridorId),
              }
            : floor
        ),
      };
    });
  };

  const addLift = (floorId: string, corridorId: string) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                corridors: floor.corridors.map((corridor) => {
                  if (corridor.id === corridorId) {
                    const newLift: Lift = {
                      id: `${corridorId}-lift-${Date.now()}`,
                      position: {
                        x: 50 + corridor.lifts.length * 100,
                        y: corridor.position.y,
                      },
                    };
                    return { ...corridor, lifts: [...corridor.lifts, newLift] };
                  }
                  return corridor;
                }),
              }
            : floor
        ),
      };
    });
  };

  const removeLift = (floorId: string, corridorId: string, liftId: string) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        floors: prev.floors.map((floor) =>
          floor.id === floorId
            ? {
                ...floor,
                corridors: floor.corridors.map((corridor) =>
                  corridor.id === corridorId
                    ? {
                        ...corridor,
                        lifts: corridor.lifts.filter((l) => l.id !== liftId),
                      }
                    : corridor
                ),
              }
            : floor
        ),
      };
    });
  };

  // ===== NEW: Floor add/remove =====
  const addFloor = () => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      const nextNumber =
        prev.floors.length > 0
          ? Math.max(...prev.floors.map((f) => f.number)) + 1
          : 1;
      const newFloor = createDefaultFloor(nextNumber);
      const floors = [...prev.floors, newFloor];
      return { ...prev, floors, totalFloors: floors.length };
    });
  };

  const removeFloor = (floorId: string) => {
    setEditedBuilding((prev) => {
      if (!prev) return null;
      if (prev.floors.length <= 1) return prev; // keep at least one floor
      const floors = prev.floors.filter((f) => f.id !== floorId);
      // keep numbering compact (1..n) while preserving IDs
      const sorted = [...floors]
        .sort((a, b) => a.number - b.number)
        .map((f, idx) => ({ ...f, number: idx + 1 }));
      return { ...prev, floors: sorted, totalFloors: sorted.length };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 px-6 py-4 rounded-t-xl border-b border-blue-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Building className="h-6 w-6" />
            <span>Edit Building Configuration</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 px-6 py-3 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "general"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                General Settings
              </button>
              <button
                onClick={() => setActiveTab("floors")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "floors"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                Floor Details
              </button>
            </div>

            {/* Quick Add Floor button visible in any tab */}
            <button
              onClick={addFloor}
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
              title="Add Floor"
            >
              <Plus className="h-4 w-4" />
              <span>Add Floor</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "general" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Building Name
                </label>
                <input
                  type="text"
                  value={editedBuilding.name}
                  onChange={(e) => updateBuildingName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter building name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                      <Layers className="h-5 w-5" />
                      {editedBuilding.floors.length}
                    </div>
                    <div className="text-slate-400">Total Floors</div>
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {editedBuilding.floors.reduce(
                        (sum, floor) => sum + floor.restrooms.length,
                        0
                      )}
                    </div>
                    <div className="text-slate-400">Total Restrooms</div>
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {editedBuilding.floors.reduce(
                        (sum, floor) => sum + floor.corridors.length,
                        0
                      )}
                    </div>
                    <div className="text-slate-400">Total Corridors</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {editedBuilding.floors
                .slice()
                .sort((a, b) => b.number - a.number)
                .map((floor) => (
                  <div
                    key={floor.id}
                    className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">
                        Floor {floor.number}
                      </h4>
                      <button
                        onClick={() => removeFloor(floor.id)}
                        disabled={editedBuilding.floors.length <= 1}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-3 py-1 rounded"
                        title={
                          editedBuilding.floors.length <= 1
                            ? "At least one floor required"
                            : "Delete Floor"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Floor</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Restrooms */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-white font-medium flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Restrooms</span>
                          </h5>
                          <button
                            onClick={() => addRestroom(floor.id)}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                            title="Add Restroom"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {floor.restrooms.map((restroom) => (
                            <div
                              key={restroom.id}
                              className="bg-slate-700 p-3 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="text"
                                  value={restroom.name}
                                  onChange={(e) =>
                                    updateRestroomName(
                                      floor.id,
                                      restroom.id,
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() =>
                                    removeRestroom(floor.id, restroom.id)
                                  }
                                  className="text-red-400 hover:text-red-300 p-1"
                                  title="Remove Restroom"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Corridors */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-white font-medium flex items-center space-x-2">
                            <Navigation className="h-4 w-4" />
                            <span>Corridors</span>
                          </h5>
                          <button
                            onClick={() => addCorridor(floor.id)}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                            title="Add Corridor"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {floor.corridors.map((corridor) => (
                            <div
                              key={corridor.id}
                              className="bg-slate-700 p-3 rounded-lg"
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <input
                                  type="text"
                                  value={corridor.name}
                                  onChange={(e) =>
                                    updateCorridorName(
                                      floor.id,
                                      corridor.id,
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() =>
                                    removeCorridor(floor.id, corridor.id)
                                  }
                                  className="text-red-400 hover:text-red-300 p-1"
                                  title="Remove Corridor"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Lifts */}
                              <div className="ml-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-slate-300 text-sm flex items-center space-x-1">
                                    <Zap className="h-3 w-3" />
                                    <span>Lifts ({corridor.lifts.length})</span>
                                  </span>
                                  <button
                                    onClick={() =>
                                      addLift(floor.id, corridor.id)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded text-xs"
                                    title="Add Lift"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {corridor.lifts.map((lift, index) => (
                                    <div
                                      key={lift.id}
                                      className="bg-slate-600 px-2 py-1 rounded text-xs text-slate-300 flex items-center space-x-1"
                                    >
                                      <span>Lift {index + 1}</span>
                                      <button
                                        onClick={() =>
                                          removeLift(
                                            floor.id,
                                            corridor.id,
                                            lift.id
                                          )
                                        }
                                        className="text-red-400 hover:text-red-300"
                                        title="Remove Lift"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Add floor button at the end as well
              <div className="flex justify-center">
                <button
                  onClick={addFloor}
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Another Floor</span>
                </button>
              </div> */}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 px-6 py-4 rounded-b-xl border-t border-slate-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { useRoadmapData } from '@/hooks/useRoadmapData';
import { SprintCadence } from '@/lib/types';
import { calculateTotalSprints } from '@/lib/utils';

export default function ConfigurationPage() {
  const { data, isLoading, updateSprintConfig } = useRoadmapData();

  const [cadence, setCadence] = useState<SprintCadence>('2-week');
  const [sprintsPerIncrement, setSprintsPerIncrement] = useState(3);
  const [incrementsPerQuarter, setIncrementsPerQuarter] = useState(2);
  const [planningStartDate, setPlanningStartDate] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize state from data
  useEffect(() => {
    if (data) {
      setCadence(data.sprintConfig.cadence);
      setSprintsPerIncrement(data.sprintConfig.sprintsPerIncrement);
      setIncrementsPerQuarter(data.sprintConfig.incrementsPerQuarter);
      setPlanningStartDate(
        new Date(data.sprintConfig.planningStartDate).toISOString().split('T')[0]
      );
    }
  }, [data]);

  // Check for changes
  useEffect(() => {
    if (data) {
      const changed =
        cadence !== data.sprintConfig.cadence ||
        sprintsPerIncrement !== data.sprintConfig.sprintsPerIncrement ||
        incrementsPerQuarter !== data.sprintConfig.incrementsPerQuarter ||
        planningStartDate !==
          new Date(data.sprintConfig.planningStartDate).toISOString().split('T')[0];
      setHasChanges(changed);
    }
  }, [data, cadence, sprintsPerIncrement, incrementsPerQuarter, planningStartDate]);

  const handleSave = () => {
    const totalSprints = calculateTotalSprints(sprintsPerIncrement, incrementsPerQuarter);

    updateSprintConfig({
      cadence,
      sprintsPerIncrement,
      incrementsPerQuarter,
      planningStartDate: new Date(planningStartDate).toISOString(),
      totalSprints,
    });

    setHasChanges(false);
  };

  const handleReset = () => {
    if (data) {
      setCadence(data.sprintConfig.cadence);
      setSprintsPerIncrement(data.sprintConfig.sprintsPerIncrement);
      setIncrementsPerQuarter(data.sprintConfig.incrementsPerQuarter);
      setPlanningStartDate(
        new Date(data.sprintConfig.planningStartDate).toISOString().split('T')[0]
      );
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500">Failed to load configuration</div>
      </div>
    );
  }

  const totalSprints = calculateTotalSprints(sprintsPerIncrement, incrementsPerQuarter);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Sprint Configuration</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure sprint cadence and planning timeline
          </p>
        </div>
        {hasChanges && (
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {hasChanges && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            You have unsaved changes. Click "Save Changes" to apply them.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {/* Sprint Cadence */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Sprint Cadence
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Choose your team's sprint duration
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setCadence('2-week')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                cadence === '2-week'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">2 Weeks</div>
              <div className="text-xs mt-1 opacity-75">Standard Agile</div>
            </button>
            <button
              onClick={() => setCadence('3-week')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                cadence === '3-week'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">3 Weeks</div>
              <div className="text-xs mt-1 opacity-75">Extended Sprint</div>
            </button>
          </div>
        </div>

        {/* Sprints per Increment */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Sprints per Increment
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Number of sprints in each increment (1-10)
          </p>
          <input
            type="number"
            min="1"
            max="10"
            value={sprintsPerIncrement}
            onChange={(e) => setSprintsPerIncrement(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Increments per Quarter */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Increments per Quarter
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Number of increments in each quarter (1-6)
          </p>
          <input
            type="number"
            min="1"
            max="6"
            value={incrementsPerQuarter}
            onChange={(e) => setIncrementsPerQuarter(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Planning Start Date */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Planning Start Date
          </label>
          <p className="text-sm text-gray-500 mb-4">
            The date when Sprint 1 begins
          </p>
          <input
            type="date"
            value={planningStartDate}
            onChange={(e) => setPlanningStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Summary */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Configuration Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Sprints:</span>
              <span className="ml-2 font-medium text-gray-900">{totalSprints}</span>
            </div>
            <div>
              <span className="text-gray-500">Planning Period:</span>
              <span className="ml-2 font-medium text-gray-900">3 Quarters</span>
            </div>
            <div>
              <span className="text-gray-500">Sprint Duration:</span>
              <span className="ml-2 font-medium text-gray-900">
                {cadence === '2-week' ? '2 weeks' : '3 weeks'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Total Increments:</span>
              <span className="ml-2 font-medium text-gray-900">
                {incrementsPerQuarter * 3}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

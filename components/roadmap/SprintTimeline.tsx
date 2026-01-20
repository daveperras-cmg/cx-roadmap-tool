'use client';

import { SprintConfig } from '@/lib/types';

interface SprintTimelineProps {
  sprintConfig: SprintConfig;
}

export function SprintTimeline({ sprintConfig }: SprintTimelineProps) {
  const { sprintsPerIncrement, incrementsPerQuarter, totalSprints } = sprintConfig;

  // Calculate quarters (3 quarters for 18 sprints)
  const quarters = 3;
  const sprintsPerQuarter = sprintsPerIncrement * incrementsPerQuarter;

  const quarterData = Array.from({ length: quarters }, (_, qIndex) => {
    const startSprint = qIndex * sprintsPerQuarter + 1;
    const endSprint = (qIndex + 1) * sprintsPerQuarter;
    const sprints = Array.from(
      { length: sprintsPerQuarter },
      (_, sIndex) => startSprint + sIndex
    );

    return {
      quarter: qIndex + 1,
      sprints,
    };
  });

  return (
    <div className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg mb-6 overflow-x-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Sprint Timeline</h3>
          <span className="text-xs text-gray-500">
            {totalSprints} sprints • {sprintConfig.cadence === '2-week' ? '2-week' : '3-week'} cadence
          </span>
        </div>

        <div className="flex gap-4">
          {quarterData.map((quarter) => (
            <div key={quarter.quarter} className="flex-1 min-w-0">
              <div className="mb-2 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                Q{quarter.quarter}
              </div>
              <div className="flex flex-wrap gap-1">
                {quarter.sprints.map((sprintNum) => (
                  <div
                    key={sprintNum}
                    className="px-2 py-1.5 text-center text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200 rounded hover:bg-blue-100 transition-colors cursor-pointer min-w-[2rem]"
                    title={`Sprint ${sprintNum}`}
                  >
                    {sprintNum}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Sprint</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>Quarter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

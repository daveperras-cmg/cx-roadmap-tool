'use client';

import { TeamMember } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';

interface RoadmapFiltersProps {
  teamMembers: TeamMember[];
  selectedMemberId?: string;
  onFilterChange: (memberId?: string) => void;
}

export function RoadmapFilters({
  teamMembers,
  selectedMemberId,
  onFilterChange,
}: RoadmapFiltersProps) {
  const selectedMember = teamMembers.find((tm) => tm.id === selectedMemberId);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter by team member:</span>

          <div className="flex items-center gap-2">
            {/* All button */}
            <button
              onClick={() => onFilterChange(undefined)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                !selectedMemberId
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              All
            </button>

            {/* Team member buttons */}
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => onFilterChange(member.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedMemberId === member.id
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Avatar member={member} size="sm" showTooltip={false} />
                <span>{member.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedMemberId && (
          <button
            onClick={() => onFilterChange(undefined)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {selectedMember && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing work items assigned to <span className="font-medium text-gray-900">{selectedMember.name}</span> and their children
          </p>
        </div>
      )}
    </div>
  );
}

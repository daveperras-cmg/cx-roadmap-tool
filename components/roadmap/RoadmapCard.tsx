'use client';

import { useState } from 'react';
import { Initiative, Epic, Feature, Story, TeamMember } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { AvatarGroup } from '@/components/ui/Avatar';
import { getTypeBadgeColor, getStatusBadgeColor, getIndentationPx, countChildren, getDeleteMessage } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface RoadmapCardProps {
  item: Initiative | Epic | Feature | Story;
  teamMembers: TeamMember[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  onAddChild?: () => void;
  level: 'initiative' | 'epic' | 'feature' | 'story';
  children?: React.ReactNode;
}

export function RoadmapCard({
  item,
  teamMembers,
  onEdit,
  onDelete,
  onToggleExpand,
  onAddChild,
  level,
  children,
}: RoadmapCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const indentPx = getIndentationPx(item.type);
  const assignedMembers = teamMembers.filter((tm) => item.assignedMembers.includes(tm.id));

  const hasChildren =
    ('epics' in item && item.epics.length > 0) ||
    ('features' in item && item.features.length > 0) ||
    ('stories' in item && item.stories.length > 0);

  // Can expand if item can have children (all types except Story)
  const canExpand = level !== 'story';
  const childCount = 'epics' in item ? item.epics.length :
                     'features' in item ? item.features.length :
                     'stories' in item ? item.stories.length : 0;

  return (
    <>
      <div
        className="group bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
        style={{ marginLeft: `${indentPx}px` }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Expand/Collapse Button */}
            <button
              onClick={onToggleExpand}
              className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 transition-colors ${
                !canExpand ? 'invisible' : ''
              }`}
              disabled={!canExpand}
            >
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  item.isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title & Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTypeBadgeColor(item.type)}>
                      {item.type}
                    </Badge>
                    <Badge className={getStatusBadgeColor(item.status)}>
                      {item.status}
                    </Badge>
                    {item.sprintNumber && (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        Sprint {item.sprintNumber}
                      </Badge>
                    )}
                    {'storyPoints' in item && item.storyPoints && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {item.storyPoints} pts
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Initiative-specific fields */}
                  {'problemStatement' in item && item.problemStatement && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-xs">
                      <span className="font-medium text-red-900">Problem: </span>
                      <span className="text-red-800">{item.problemStatement}</span>
                    </div>
                  )}
                  {'desiredOutcome' in item && item.desiredOutcome && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded text-xs">
                      <span className="font-medium text-green-900">Outcome: </span>
                      <span className="text-green-800">{item.desiredOutcome}</span>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    {hasChildren && (
                      <span>
                        {childCount} {level === 'initiative' ? 'epic' : level === 'epic' ? 'feature' : 'story'}
                        {childCount !== 1 ? (level === 'story' ? '' : 's') : ''}
                        {level === 'feature' && childCount !== 1 ? 'ies' : childCount === 1 && level === 'feature' ? 'y' : ''}
                      </span>
                    )}
                    {assignedMembers.length > 0 && (
                      <AvatarGroup members={assignedMembers} maxDisplay={3} size="sm" />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 transition-opacity">
                  {onAddChild && level !== 'story' && (
                    <button
                      onClick={onAddChild}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title={`Add ${level === 'initiative' ? 'Epic' : level === 'epic' ? 'Feature' : 'Story'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={onEdit}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        {item.isExpanded && level !== 'story' && (
          <div className="pb-2 px-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {hasChildren ? (
              children
            ) : (
              <div className="text-center py-4 px-2 text-sm text-gray-400 italic border-t border-gray-100">
                No {level === 'initiative' ? 'epics' : level === 'epic' ? 'features' : 'stories'} yet. Click the + button above to add one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onDelete}
        title={`Delete ${item.type}`}
        message={getDeleteMessage(item)}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

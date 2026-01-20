import { Initiative, Epic, Feature, Story, ItemCounts, TeamMember, WorkItemType } from './types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS class name merger utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Count children recursively for a work item
 */
export function countChildren(item: Initiative | Epic | Feature): ItemCounts {
  const counts: ItemCounts = {
    epics: 0,
    features: 0,
    stories: 0,
    total: 0,
  };

  if ('epics' in item) {
    // Initiative
    counts.epics = item.epics.length;
    item.epics.forEach((epic) => {
      counts.features! += epic.features.length;
      epic.features.forEach((feature) => {
        counts.stories! += feature.stories.length;
      });
    });
  } else if ('features' in item) {
    // Epic
    counts.features = item.features.length;
    item.features.forEach((feature) => {
      counts.stories! += feature.stories.length;
    });
  } else if ('stories' in item) {
    // Feature
    counts.stories = item.stories.length;
  }

  counts.total = (counts.epics || 0) + (counts.features || 0) + (counts.stories || 0);
  return counts;
}

/**
 * Format deletion message with child counts
 */
export function getDeleteMessage(item: Initiative | Epic | Feature | Story): string {
  const counts = countChildren(item as any);

  if (counts.total === 0) {
    return `Are you sure you want to delete this ${item.type.toLowerCase()}?`;
  }

  const parts: string[] = [];
  if (counts.epics) parts.push(`${counts.epics} epic${counts.epics > 1 ? 's' : ''}`);
  if (counts.features) parts.push(`${counts.features} feature${counts.features > 1 ? 's' : ''}`);
  if (counts.stories) parts.push(`${counts.stories} stor${counts.stories > 1 ? 'ies' : 'y'}`);

  return `Are you sure you want to delete this ${item.type.toLowerCase()} and its ${parts.join(', ')}? This will delete ${counts.total + 1} total items.`;
}

/**
 * Get team member initials
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get color for team member avatar (deterministic based on name)
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
  ];

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * Get badge color classes for work item type
 */
export function getTypeBadgeColor(type: WorkItemType): string {
  switch (type) {
    case 'Initiative':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Epic':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Feature':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Story':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get status badge color and icon
 */
export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'Not Started':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Blocked':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get indentation level for work item type
 */
export function getIndentationPx(type: WorkItemType): number {
  switch (type) {
    case 'Initiative':
      return 0;
    case 'Epic':
      return 24;
    case 'Feature':
      return 48;
    case 'Story':
      return 72;
    default:
      return 0;
  }
}

/**
 * Format date for display
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}${randomStr}`;
}

/**
 * Validate required fields
 */
export function validateRequired(value: string | undefined): boolean {
  return !!value && value.trim().length > 0;
}

/**
 * Check if team member is assigned to any work items
 */
export function isTeamMemberAssigned(memberId: string, initiatives: Initiative[]): boolean {
  for (const initiative of initiatives) {
    if (initiative.assignedMembers.includes(memberId)) return true;

    for (const epic of initiative.epics) {
      if (epic.assignedMembers.includes(memberId)) return true;

      for (const feature of epic.features) {
        if (feature.assignedMembers.includes(memberId)) return true;

        for (const story of feature.stories) {
          if (story.assignedMembers.includes(memberId)) return true;
        }
      }
    }
  }

  return false;
}

/**
 * Filter work items by assigned team member
 * Returns items that are directly assigned or have assigned children
 */
export function filterByTeamMember(
  initiatives: Initiative[],
  memberId: string
): Initiative[] {
  return initiatives
    .map((initiative) => {
      const filteredEpics = initiative.epics
        .map((epic) => {
          const filteredFeatures = epic.features
            .map((feature) => {
              const filteredStories = feature.stories.filter((story) =>
                story.assignedMembers.includes(memberId)
              );

              const hasMatchingStories = filteredStories.length > 0;
              const isDirectlyAssigned = feature.assignedMembers.includes(memberId);

              if (hasMatchingStories || isDirectlyAssigned) {
                return { ...feature, stories: filteredStories };
              }
              return null;
            })
            .filter((f): f is Feature => f !== null);

          const hasMatchingFeatures = filteredFeatures.length > 0;
          const isDirectlyAssigned = epic.assignedMembers.includes(memberId);

          if (hasMatchingFeatures || isDirectlyAssigned) {
            return { ...epic, features: filteredFeatures };
          }
          return null;
        })
        .filter((e): e is Epic => e !== null);

      const hasMatchingEpics = filteredEpics.length > 0;
      const isDirectlyAssigned = initiative.assignedMembers.includes(memberId);

      if (hasMatchingEpics || isDirectlyAssigned) {
        return { ...initiative, epics: filteredEpics };
      }
      return null;
    })
    .filter((i): i is Initiative => i !== null);
}

/**
 * Calculate total sprints based on configuration
 */
export function calculateTotalSprints(
  sprintsPerIncrement: number,
  incrementsPerQuarter: number,
  quarters: number = 3
): number {
  return sprintsPerIncrement * incrementsPerQuarter * quarters;
}

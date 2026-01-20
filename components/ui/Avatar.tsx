import { TeamMember } from '@/lib/types';
import { getInitials, getAvatarColor } from '@/lib/utils';

interface AvatarProps {
  member: TeamMember;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function Avatar({ member, size = 'md', showTooltip = true }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(
        member.name
      )} rounded-full flex items-center justify-center text-white font-medium ${
        showTooltip ? 'cursor-help' : ''
      }`}
      title={showTooltip ? `${member.name} (${member.role})` : undefined}
    >
      {getInitials(member.name)}
    </div>
  );
}

interface AvatarGroupProps {
  members: TeamMember[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ members, maxDisplay = 3, size = 'sm' }: AvatarGroupProps) {
  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = members.length - maxDisplay;

  if (members.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center -space-x-2">
      {displayMembers.map((member) => (
        <div key={member.id} className="ring-2 ring-white rounded-full">
          <Avatar member={member} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`${
            size === 'sm' ? 'w-6 h-6 text-xs' : size === 'md' ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-base'
          } bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium ring-2 ring-white cursor-help`}
          title={members
            .slice(maxDisplay)
            .map((m) => m.name)
            .join(', ')}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

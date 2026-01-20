'use client';

import { useState } from 'react';
import { useRoadmapData } from '@/hooks/useRoadmapData';
import { TeamMember } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';
import { TeamMemberForm } from '@/components/forms/TeamMemberForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { isTeamMemberAssigned } from '@/lib/utils';

export default function TeamPage() {
  const { data, isLoading, addTeamMember, updateTeamMember, deleteTeamMember } = useRoadmapData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500">Failed to load team data</div>
      </div>
    );
  }

  const handleDelete = (member: TeamMember) => {
    if (isTeamMemberAssigned(member.id, data.initiatives)) {
      alert(`Cannot delete ${member.name} because they are assigned to work items. Please unassign them first.`);
      return;
    }
    setDeletingMember(member);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Team Members</h2>
          <p className="mt-1 text-sm text-gray-500">
            {data.teamMembers.length} team member{data.teamMembers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Add Team Member
        </button>
      </div>

      {data.teamMembers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No team members yet. Add your first team member to get started.</p>
          <button
            onClick={() => setFormOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.teamMembers.map((member) => {
            const isAssigned = isTeamMemberAssigned(member.id, data.initiatives);

            return (
              <div
                key={member.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <Avatar member={member} size="lg" showTooltip={false} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    {member.email && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{member.email}</p>
                    )}
                    {isAssigned && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Assigned to work items
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setFormOpen(true);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="flex-1 px-3 py-1.5 text-sm text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    title={isAssigned ? 'Cannot delete - member is assigned to work items' : 'Remove team member'}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Team Member Form */}
      <TeamMemberForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingMember(null);
        }}
        onSubmit={(data) => {
          if (editingMember) {
            updateTeamMember(editingMember.id, data);
          } else {
            addTeamMember(data);
          }
          setEditingMember(null);
        }}
        member={editingMember || undefined}
        mode={editingMember ? 'edit' : 'create'}
      />

      {/* Delete Confirmation */}
      {deletingMember && (
        <ConfirmDialog
          isOpen={!!deletingMember}
          onClose={() => setDeletingMember(null)}
          onConfirm={() => {
            deleteTeamMember(deletingMember.id);
            setDeletingMember(null);
          }}
          title="Remove Team Member"
          message={`Are you sure you want to remove ${deletingMember.name} from the team?`}
          confirmText="Remove"
          variant="danger"
        />
      )}
    </div>
  );
}

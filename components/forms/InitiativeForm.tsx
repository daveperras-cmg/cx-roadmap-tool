'use client';

import { useState } from 'react';
import { Initiative, TeamMember, WorkItemStatus } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { validateRequired } from '@/lib/utils';

interface InitiativeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Initiative>) => void;
  teamMembers: TeamMember[];
  initiative?: Initiative;
  mode: 'create' | 'edit';
}

const STATUS_OPTIONS: WorkItemStatus[] = ['Not Started', 'In Progress', 'Completed', 'Blocked'];

export function InitiativeForm({
  isOpen,
  onClose,
  onSubmit,
  teamMembers,
  initiative,
  mode,
}: InitiativeFormProps) {
  const [title, setTitle] = useState(initiative?.title || '');
  const [description, setDescription] = useState(initiative?.description || '');
  const [problemStatement, setProblemStatement] = useState(initiative?.problemStatement || '');
  const [desiredOutcome, setDesiredOutcome] = useState(initiative?.desiredOutcome || '');
  const [status, setStatus] = useState<WorkItemStatus>(initiative?.status || 'Not Started');
  const [assignedMembers, setAssignedMembers] = useState<string[]>(initiative?.assignedMembers || []);
  const [sprintNumber, setSprintNumber] = useState<string>(initiative?.sprintNumber?.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!validateRequired(title)) {
      newErrors.title = 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      type: 'Initiative',
      title: title.trim(),
      description: description.trim() || undefined,
      problemStatement: problemStatement.trim() || undefined,
      desiredOutcome: desiredOutcome.trim() || undefined,
      status,
      assignedMembers,
      sprintNumber: sprintNumber ? parseInt(sprintNumber) : undefined,
      isExpanded: initiative?.isExpanded ?? true,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'New Initiative' : 'Edit Initiative'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Customer Portal Modernization"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief overview of the initiative"
          />
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
          <textarea
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What problem does this initiative solve?"
          />
        </div>

        {/* Desired Outcome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desired Outcome</label>
          <textarea
            value={desiredOutcome}
            onChange={(e) => setDesiredOutcome(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What is the expected result?"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WorkItemStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Sprint Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Number (Optional)</label>
          <input
            type="number"
            min="1"
            value={sprintNumber}
            onChange={(e) => setSprintNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 5"
          />
        </div>

        {/* Team Members */}
        <MultiSelect
          label="Assigned Team Members"
          options={teamMembers}
          selected={assignedMembers}
          onChange={setAssignedMembers}
          placeholder="Select team members..."
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            {mode === 'create' ? 'Create Initiative' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

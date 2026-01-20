'use client';

import { useState } from 'react';
import { useRoadmapData } from '@/hooks/useRoadmapData';
import { Initiative, Epic, Feature, Story } from '@/lib/types';
import { RoadmapCard } from '@/components/roadmap/RoadmapCard';
import { RoadmapFilters } from '@/components/roadmap/RoadmapFilters';
import { SprintTimeline } from '@/components/roadmap/SprintTimeline';
import { InitiativeForm } from '@/components/forms/InitiativeForm';
import { EpicForm } from '@/components/forms/EpicForm';
import { FeatureForm } from '@/components/forms/FeatureForm';
import { StoryForm } from '@/components/forms/StoryForm';
import { filterByTeamMember } from '@/lib/utils';

export default function RoadmapPage() {
  const {
    data,
    isLoading,
    addInitiative,
    updateInitiative,
    deleteInitiative,
    addEpic,
    updateEpic,
    deleteEpic,
    addFeature,
    updateFeature,
    deleteFeature,
    addStory,
    updateStory,
    deleteStory,
  } = useRoadmapData();

  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>();
  const [initiativeFormOpen, setInitiativeFormOpen] = useState(false);
  const [epicFormOpen, setEpicFormOpen] = useState(false);
  const [featureFormOpen, setFeatureFormOpen] = useState(false);
  const [storyFormOpen, setStoryFormOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<{
    type: 'initiative' | 'epic' | 'feature' | 'story';
    item: Initiative | Epic | Feature | Story;
    initiativeId?: string;
    epicId?: string;
    featureId?: string;
  } | null>(null);

  const [addingChildTo, setAddingChildTo] = useState<{
    type: 'epic' | 'feature' | 'story';
    initiativeId: string;
    epicId?: string;
    featureId?: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500">Failed to load roadmap data</div>
      </div>
    );
  }

  // Apply filter
  const displayedInitiatives = selectedMemberId
    ? filterByTeamMember(data.initiatives, selectedMemberId)
    : data.initiatives;

  const handleToggleExpand = (
    initiativeId: string,
    epicId?: string,
    featureId?: string,
    storyId?: string
  ) => {
    if (storyId && featureId && epicId) {
      // Toggle story (stories don't have children, but keep for consistency)
      updateStory(initiativeId, epicId, featureId, storyId, {
        isExpanded: !data.initiatives
          .find((i) => i.id === initiativeId)
          ?.epics.find((e) => e.id === epicId)
          ?.features.find((f) => f.id === featureId)
          ?.stories.find((s) => s.id === storyId)?.isExpanded,
      });
    } else if (featureId && epicId) {
      // Toggle feature
      updateFeature(initiativeId, epicId, featureId, {
        isExpanded: !data.initiatives
          .find((i) => i.id === initiativeId)
          ?.epics.find((e) => e.id === epicId)
          ?.features.find((f) => f.id === featureId)?.isExpanded,
      });
    } else if (epicId) {
      // Toggle epic
      updateEpic(initiativeId, epicId, {
        isExpanded: !data.initiatives
          .find((i) => i.id === initiativeId)
          ?.epics.find((e) => e.id === epicId)?.isExpanded,
      });
    } else {
      // Toggle initiative
      updateInitiative(initiativeId, {
        isExpanded: !data.initiatives.find((i) => i.id === initiativeId)?.isExpanded,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Sprint Roadmap</h2>
          <p className="mt-1 text-sm text-gray-500">
            {data.initiatives.length} initiative{data.initiatives.length !== 1 ? 's' : ''} • {data.teamMembers.length} team member{data.teamMembers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setInitiativeFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          New Initiative
        </button>
      </div>

      {/* Sprint Timeline */}
      <SprintTimeline sprintConfig={data.sprintConfig} />

      {/* Filters */}
      {data.teamMembers.length > 0 && (
        <RoadmapFilters
          teamMembers={data.teamMembers}
          selectedMemberId={selectedMemberId}
          onFilterChange={setSelectedMemberId}
        />
      )}

      {/* Roadmap */}
      {displayedInitiatives.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            {selectedMemberId
              ? 'No items found for this team member'
              : 'No initiatives yet. Create your first initiative to get started.'}
          </p>
          {!selectedMemberId && (
            <button
              onClick={() => setInitiativeFormOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Initiative
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedInitiatives.map((initiative) => (
            <RoadmapCard
              key={initiative.id}
              item={initiative}
              teamMembers={data.teamMembers}
              level="initiative"
              onEdit={() => {
                setEditingItem({ type: 'initiative', item: initiative });
                setInitiativeFormOpen(true);
              }}
              onDelete={() => deleteInitiative(initiative.id)}
              onToggleExpand={() => handleToggleExpand(initiative.id)}
              onAddChild={() => {
                setAddingChildTo({ type: 'epic', initiativeId: initiative.id });
                setEpicFormOpen(true);
              }}
            >
              {initiative.epics.map((epic) => (
                <RoadmapCard
                  key={epic.id}
                  item={epic}
                  teamMembers={data.teamMembers}
                  level="epic"
                  onEdit={() => {
                    setEditingItem({
                      type: 'epic',
                      item: epic,
                      initiativeId: initiative.id,
                    });
                    setEpicFormOpen(true);
                  }}
                  onDelete={() => deleteEpic(initiative.id, epic.id)}
                  onToggleExpand={() => handleToggleExpand(initiative.id, epic.id)}
                  onAddChild={() => {
                    setAddingChildTo({
                      type: 'feature',
                      initiativeId: initiative.id,
                      epicId: epic.id,
                    });
                    setFeatureFormOpen(true);
                  }}
                >
                  {epic.features.map((feature) => (
                    <RoadmapCard
                      key={feature.id}
                      item={feature}
                      teamMembers={data.teamMembers}
                      level="feature"
                      onEdit={() => {
                        setEditingItem({
                          type: 'feature',
                          item: feature,
                          initiativeId: initiative.id,
                          epicId: epic.id,
                        });
                        setFeatureFormOpen(true);
                      }}
                      onDelete={() => deleteFeature(initiative.id, epic.id, feature.id)}
                      onToggleExpand={() => handleToggleExpand(initiative.id, epic.id, feature.id)}
                      onAddChild={() => {
                        setAddingChildTo({
                          type: 'story',
                          initiativeId: initiative.id,
                          epicId: epic.id,
                          featureId: feature.id,
                        });
                        setStoryFormOpen(true);
                      }}
                    >
                      {feature.stories.map((story) => (
                        <RoadmapCard
                          key={story.id}
                          item={story}
                          teamMembers={data.teamMembers}
                          level="story"
                          onEdit={() => {
                            setEditingItem({
                              type: 'story',
                              item: story,
                              initiativeId: initiative.id,
                              epicId: epic.id,
                              featureId: feature.id,
                            });
                            setStoryFormOpen(true);
                          }}
                          onDelete={() =>
                            deleteStory(initiative.id, epic.id, feature.id, story.id)
                          }
                          onToggleExpand={() =>
                            handleToggleExpand(initiative.id, epic.id, feature.id, story.id)
                          }
                        />
                      ))}
                    </RoadmapCard>
                  ))}
                </RoadmapCard>
              ))}
            </RoadmapCard>
          ))}
        </div>
      )}

      {/* Forms */}
      <InitiativeForm
        isOpen={initiativeFormOpen}
        onClose={() => {
          setInitiativeFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={(data) => {
          if (editingItem?.type === 'initiative') {
            updateInitiative(editingItem.item.id, data);
          } else {
            addInitiative(data as any);
          }
          setEditingItem(null);
        }}
        teamMembers={data.teamMembers}
        initiative={editingItem?.type === 'initiative' ? (editingItem.item as Initiative) : undefined}
        mode={editingItem?.type === 'initiative' ? 'edit' : 'create'}
      />

      <EpicForm
        isOpen={epicFormOpen}
        onClose={() => {
          setEpicFormOpen(false);
          setEditingItem(null);
          setAddingChildTo(null);
        }}
        onSubmit={(data) => {
          if (editingItem?.type === 'epic') {
            updateEpic(editingItem.initiativeId!, editingItem.item.id, data);
          } else if (addingChildTo?.type === 'epic') {
            addEpic(addingChildTo.initiativeId, data as any);
          }
          setEditingItem(null);
          setAddingChildTo(null);
        }}
        teamMembers={data.teamMembers}
        epic={editingItem?.type === 'epic' ? (editingItem.item as Epic) : undefined}
        mode={editingItem?.type === 'epic' ? 'edit' : 'create'}
      />

      <FeatureForm
        isOpen={featureFormOpen}
        onClose={() => {
          setFeatureFormOpen(false);
          setEditingItem(null);
          setAddingChildTo(null);
        }}
        onSubmit={(data) => {
          if (editingItem?.type === 'feature') {
            updateFeature(editingItem.initiativeId!, editingItem.epicId!, editingItem.item.id, data);
          } else if (addingChildTo?.type === 'feature') {
            addFeature(addingChildTo.initiativeId, addingChildTo.epicId!, data as any);
          }
          setEditingItem(null);
          setAddingChildTo(null);
        }}
        teamMembers={data.teamMembers}
        feature={editingItem?.type === 'feature' ? (editingItem.item as Feature) : undefined}
        mode={editingItem?.type === 'feature' ? 'edit' : 'create'}
      />

      <StoryForm
        isOpen={storyFormOpen}
        onClose={() => {
          setStoryFormOpen(false);
          setEditingItem(null);
          setAddingChildTo(null);
        }}
        onSubmit={(data) => {
          if (editingItem?.type === 'story') {
            updateStory(
              editingItem.initiativeId!,
              editingItem.epicId!,
              editingItem.featureId!,
              editingItem.item.id,
              data
            );
          } else if (addingChildTo?.type === 'story') {
            addStory(addingChildTo.initiativeId, addingChildTo.epicId!, addingChildTo.featureId!, data as any);
          }
          setEditingItem(null);
          setAddingChildTo(null);
        }}
        teamMembers={data.teamMembers}
        story={editingItem?.type === 'story' ? (editingItem.item as Story) : undefined}
        mode={editingItem?.type === 'story' ? 'edit' : 'create'}
      />
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  RoadmapData,
  Initiative,
  Epic,
  Feature,
  Story,
  TeamMember,
  SprintConfig,
} from '@/lib/types';
import { loadRoadmapData, saveRoadmapData } from '@/lib/storage';
import { generateId } from '@/lib/utils';

/**
 * Custom hook for managing roadmap data with localStorage persistence
 */
export function useRoadmapData() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadedData = loadRoadmapData();
    setData(loadedData);
    setIsLoading(false);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (data && !isLoading) {
      saveRoadmapData(data);
    }
  }, [data, isLoading]);

  // Update data helper
  const updateData = useCallback((updater: (prev: RoadmapData) => RoadmapData) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  // Team Member CRUD operations
  const addTeamMember = useCallback(
    (member: Omit<TeamMember, 'id' | 'createdAt'>) => {
      updateData((prev) => ({
        ...prev,
        teamMembers: [
          ...prev.teamMembers,
          {
            ...member,
            id: generateId('tm'),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [updateData]
  );

  const updateTeamMember = useCallback(
    (id: string, updates: Partial<TeamMember>) => {
      updateData((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((tm) =>
          tm.id === id ? { ...tm, ...updates } : tm
        ),
      }));
    },
    [updateData]
  );

  const deleteTeamMember = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((tm) => tm.id !== id),
      }));
    },
    [updateData]
  );

  // Initiative CRUD operations
  const addInitiative = useCallback(
    (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'epics'>) => {
      updateData((prev) => ({
        ...prev,
        initiatives: [
          ...prev.initiatives,
          {
            ...initiative,
            id: generateId('init'),
            epics: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [updateData]
  );

  const updateInitiative = useCallback(
    (id: string, updates: Partial<Initiative>) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === id
            ? { ...init, ...updates, updatedAt: new Date().toISOString() }
            : init
        ),
      }));
    },
    [updateData]
  );

  const deleteInitiative = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.filter((init) => init.id !== id),
      }));
    },
    [updateData]
  );

  // Epic CRUD operations
  const addEpic = useCallback(
    (
      initiativeId: string,
      epic: Omit<Epic, 'id' | 'createdAt' | 'updatedAt' | 'features' | 'parentInitiativeId'>
    ) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: [
                  ...init.epics,
                  {
                    ...epic,
                    id: generateId('epic'),
                    parentInitiativeId: initiativeId,
                    features: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                ],
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  const updateEpic = useCallback(
    (initiativeId: string, epicId: string, updates: Partial<Epic>) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.map((epic) =>
                  epic.id === epicId
                    ? { ...epic, ...updates, updatedAt: new Date().toISOString() }
                    : epic
                ),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  const deleteEpic = useCallback(
    (initiativeId: string, epicId: string) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.filter((epic) => epic.id !== epicId),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  // Feature CRUD operations
  const addFeature = useCallback(
    (
      initiativeId: string,
      epicId: string,
      feature: Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'stories' | 'parentEpicId'>
    ) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.map((epic) =>
                  epic.id === epicId
                    ? {
                        ...epic,
                        features: [
                          ...epic.features,
                          {
                            ...feature,
                            id: generateId('feat'),
                            parentEpicId: epicId,
                            stories: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                          },
                        ],
                        updatedAt: new Date().toISOString(),
                      }
                    : epic
                ),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  const updateFeature = useCallback(
    (initiativeId: string, epicId: string, featureId: string, updates: Partial<Feature>) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.map((epic) =>
                  epic.id === epicId
                    ? {
                        ...epic,
                        features: epic.features.map((feature) =>
                          feature.id === featureId
                            ? { ...feature, ...updates, updatedAt: new Date().toISOString() }
                            : feature
                        ),
                        updatedAt: new Date().toISOString(),
                      }
                    : epic
                ),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  const deleteFeature = useCallback(
    (initiativeId: string, epicId: string, featureId: string) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.map((epic) =>
                  epic.id === epicId
                    ? {
                        ...epic,
                        features: epic.features.filter((feature) => feature.id !== featureId),
                        updatedAt: new Date().toISOString(),
                      }
                    : epic
                ),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  // Story CRUD operations
  const addStory = useCallback(
    (
      initiativeId: string,
      epicId: string,
      featureId: string,
      story: Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'parentFeatureId'>
    ) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.map((epic) =>
                  epic.id === epicId
                    ? {
                        ...epic,
                        features: epic.features.map((feature) =>
                          feature.id === featureId
                            ? {
                                ...feature,
                                stories: [
                                  ...feature.stories,
                                  {
                                    ...story,
                                    id: generateId('story'),
                                    parentFeatureId: featureId,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                  },
                                ],
                                updatedAt: new Date().toISOString(),
                              }
                            : feature
                        ),
                        updatedAt: new Date().toISOString(),
                      }
                    : epic
                ),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  const updateStory = useCallback(
    (
      initiativeId: string,
      epicId: string,
      featureId: string,
      storyId: string,
      updates: Partial<Story>
    ) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.map((epic) =>
                  epic.id === epicId
                    ? {
                        ...epic,
                        features: epic.features.map((feature) =>
                          feature.id === featureId
                            ? {
                                ...feature,
                                stories: feature.stories.map((story) =>
                                  story.id === storyId
                                    ? { ...story, ...updates, updatedAt: new Date().toISOString() }
                                    : story
                                ),
                                updatedAt: new Date().toISOString(),
                              }
                            : feature
                        ),
                        updatedAt: new Date().toISOString(),
                      }
                    : epic
                ),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  const deleteStory = useCallback(
    (initiativeId: string, epicId: string, featureId: string, storyId: string) => {
      updateData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.map((init) =>
          init.id === initiativeId
            ? {
                ...init,
                epics: init.epics.map((epic) =>
                  epic.id === epicId
                    ? {
                        ...epic,
                        features: epic.features.map((feature) =>
                          feature.id === featureId
                            ? {
                                ...feature,
                                stories: feature.stories.filter((story) => story.id !== storyId),
                                updatedAt: new Date().toISOString(),
                              }
                            : feature
                        ),
                        updatedAt: new Date().toISOString(),
                      }
                    : epic
                ),
                updatedAt: new Date().toISOString(),
              }
            : init
        ),
      }));
    },
    [updateData]
  );

  // Sprint Configuration
  const updateSprintConfig = useCallback(
    (updates: Partial<SprintConfig>) => {
      updateData((prev) => ({
        ...prev,
        sprintConfig: {
          ...prev.sprintConfig,
          ...updates,
        },
      }));
    },
    [updateData]
  );

  return {
    data,
    isLoading,
    // Team operations
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    // Initiative operations
    addInitiative,
    updateInitiative,
    deleteInitiative,
    // Epic operations
    addEpic,
    updateEpic,
    deleteEpic,
    // Feature operations
    addFeature,
    updateFeature,
    deleteFeature,
    // Story operations
    addStory,
    updateStory,
    deleteStory,
    // Sprint config
    updateSprintConfig,
  };
}

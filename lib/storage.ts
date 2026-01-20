import { RoadmapData } from './types';
import { defaultRoadmapData } from './sample-data';

/**
 * localStorage key for roadmap data
 */
const STORAGE_KEY = 'roadmap-data';

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Load roadmap data from localStorage
 * Returns default data if no data exists or if parsing fails
 */
export function loadRoadmapData(): RoadmapData {
  if (!isBrowser) {
    return defaultRoadmapData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      // First visit - save and return default data
      saveRoadmapData(defaultRoadmapData);
      return defaultRoadmapData;
    }

    const parsed = JSON.parse(stored) as RoadmapData;
    return parsed;
  } catch (error) {
    console.error('Failed to load roadmap data from localStorage:', error);
    // On error, return default data but don't overwrite potentially corrupted storage
    return defaultRoadmapData;
  }
}

/**
 * Save roadmap data to localStorage
 */
export function saveRoadmapData(data: RoadmapData): boolean {
  if (!isBrowser) {
    return false;
  }

  try {
    const updated = {
      ...data,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save roadmap data to localStorage:', error);
    return false;
  }
}

/**
 * Clear all roadmap data from localStorage
 */
export function clearRoadmapData(): boolean {
  if (!isBrowser) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear roadmap data from localStorage:', error);
    return false;
  }
}

/**
 * Reset to default data
 */
export function resetToDefaultData(): RoadmapData {
  if (isBrowser) {
    clearRoadmapData();
  }
  return loadRoadmapData();
}

/**
 * Export roadmap data as JSON string
 */
export function exportRoadmapData(): string {
  const data = loadRoadmapData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import roadmap data from JSON string
 */
export function importRoadmapData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as RoadmapData;
    // Basic validation
    if (!data.teamMembers || !data.initiatives || !data.sprintConfig) {
      throw new Error('Invalid roadmap data structure');
    }
    return saveRoadmapData(data);
  } catch (error) {
    console.error('Failed to import roadmap data:', error);
    return false;
  }
}

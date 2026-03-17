import { PillarScore } from '../types';

export function gradeColor(grade: PillarScore['grade']): string {
  switch (grade) {
    case 'A': return '#34C759'; // green
    case 'B': return '#30D158'; // light green
    case 'C': return '#FF9F0A'; // amber
    case 'D': return '#FF6B00'; // orange
    case 'F': return '#FF3B30'; // red
    default:  return '#8E8E93'; // grey — UNKNOWN or no data
  }
}

export function severityColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical': return '#FF3B30';
    case 'warning':  return '#FF9F0A';
    case 'info':     return '#007AFF';
  }
}

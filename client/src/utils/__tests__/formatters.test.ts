import { describe, it, expect } from 'vitest';
import {
  formatIssueKey,
  formatDate,
  formatRelativeTime,
  getPriorityBadgeClass,
} from '../formatters';

describe('formatters utility', () => {
  describe('formatIssueKey', () => {
    it('formats key and issue number correctly', () => {
      expect(formatIssueKey('wolf', 14)).toBe('WOLF-14');
      expect(formatIssueKey('APP', 1)).toBe('APP-1');
    });

    it('returns empty string if missing projectKey or number', () => {
      expect(formatIssueKey(undefined, 10)).toBe('');
      expect(formatIssueKey('WOLF', undefined)).toBe('');
    });
  });

  describe('formatDate', () => {
    it('returns formatted date string', () => {
      const formatted = formatDate('2026-09-25T00:00:00.000Z');
      expect(formatted).toContain('Sep');
      expect(formatted).toContain('2026');
    });

    it('returns None for null or undefined dates', () => {
      expect(formatDate(null)).toBe('None');
      expect(formatDate(undefined)).toBe('None');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns just now for very recent timestamps', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('returns relative minutes or hours for recent timestamps', () => {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatRelativeTime(tenMinsAgo)).toBe('10m ago');

      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');
    });

    it('returns empty string for null or undefined', () => {
      expect(formatRelativeTime(null)).toBe('');
    });
  });

  describe('getPriorityBadgeClass', () => {
    it('returns correct CSS class per priority', () => {
      expect(getPriorityBadgeClass('LOW')).toBe('badge-low');
      expect(getPriorityBadgeClass('MEDIUM')).toBe('badge-medium');
      expect(getPriorityBadgeClass('HIGH')).toBe('badge-high');
      expect(getPriorityBadgeClass('URGENT')).toBe('badge-urgent');
    });
  });
});

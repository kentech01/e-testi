// Subject lists for different grade ranges

export interface SubjectOption {
  label: string;
  value: string;
}

export const SUBJECTS_6_9: SubjectOption[] = [
  { label: 'Gjuhë Shqipe', value: 'gjuhe_shqipe' },
  { label: 'Letërsi', value: 'leteri' },
  { label: 'Gjuhë Angleze', value: 'gjuhe_angleze' },
  {
    label: 'Gjuhë e dytë e huaj (zakonisht Gjermanisht)',
    value: 'gjuhe_e_dyte_e_huaj',
  },
  { label: 'Matematikë', value: 'matematike' },
  { label: 'Fizikë', value: 'fizike' },
  { label: 'Kimi', value: 'kimi' },
  { label: 'Biologji', value: 'biologji' },
  { label: 'Histori', value: 'histori' },
  { label: 'Gjeografi', value: 'gjeografi' },
  { label: 'Edukatë Qytetare', value: 'edukate_qytetare' },
  { label: 'Edukatë Muzikore', value: 'edukate_muzikore' },
  { label: 'Edukatë Figurative', value: 'edukate_figurative' },
  { label: 'Edukatë Fizike', value: 'edukate_fizike' },
  { label: 'Teknologji / Teknikë', value: 'teknologji_tekinke' },
];

export const SUBJECTS_10_12: SubjectOption[] = [
  { label: 'Gjuhë Shqipe', value: 'gjuhe_shqipe' },
  { label: 'Matematikë', value: 'matematike' },
  { label: 'Anglisht', value: 'anglisht' },
  { label: 'Fizikë', value: 'fizike' },
  { label: 'Kimi', value: 'kimi' },
  { label: 'Biologji', value: 'biologji' },
  { label: 'Histori', value: 'histori' },
  { label: 'Gjeografi', value: 'gjeografi' },
  { label: 'Ekonomi', value: 'ekonomi' },
  { label: 'Informatikë', value: 'informatike' },
  { label: 'Lëndë profesionale', value: 'lende_profesionale' },
];

export type Subject = SubjectOption;

/**
 * Determines the grade range (6-9 or 10-12) based on sector information
 * @param sectorName - The sector name or displayName
 * @returns '6-9' | '10-12' | null if cannot be determined
 */
export function getGradeRangeFromSector(
  sectorName: string
): '6-9' | '10-12' | null {
  const name = sectorName.toLowerCase();

  // Check for matura or high school indicators (10-12)
  if (
    name.includes('matura') ||
    name.includes('maturë') ||
    name.includes('10') ||
    name.includes('11') ||
    name.includes('12') ||
    name.includes('liceu') ||
    name.includes('gjimnaz')
  ) {
    return '10-12';
  }

  // Check for middle school indicators (6-9)
  if (
    name.includes('6') ||
    name.includes('7') ||
    name.includes('8') ||
    name.includes('9') ||
    name.includes('shkollë e mesme')
  ) {
    return '6-9';
  }

  // Default to null if unclear
  return null;
}

/**
 * Gets the list of subjects for a given grade range
 * @param gradeRange - The grade range ('6-9' or '10-12')
 * @returns Array of subject options with label and value
 */
export function getSubjectsForGradeRange(
  gradeRange: '6-9' | '10-12' | null
): SubjectOption[] {
  if (gradeRange === '6-9') {
    return [...SUBJECTS_6_9];
  } else if (gradeRange === '10-12') {
    return [...SUBJECTS_10_12];
  }
  // If unclear, return all subjects (union of both, removing duplicates by value)
  const allSubjects = [...SUBJECTS_6_9, ...SUBJECTS_10_12];
  const uniqueSubjects = allSubjects.filter(
    (subject, index, self) =>
      index === self.findIndex((s) => s.value === subject.value)
  );
  return uniqueSubjects;
}

/**
 * Gets the subject label from a value
 * @param value - The subject value (e.g., 'gjuhe_shqipe')
 * @returns The subject label or the value if not found
 */
export function getSubjectLabel(value: string): string {
  const allSubjects = [...SUBJECTS_6_9, ...SUBJECTS_10_12];
  const subject = allSubjects.find((s) => s.value === value);
  return subject?.label || value;
}

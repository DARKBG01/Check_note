import { Student, Subject, Grade } from "@/types/student";

export const mockSubjects: Subject[] = [
  { id: "s1", name: "Mathématiques", coefficient: 4 },
  { id: "s2", name: "Physique", coefficient: 3 },
  { id: "s3", name: "Informatique", coefficient: 5 },
  { id: "s4", name: "Français", coefficient: 2 },
  { id: "s5", name: "Anglais", coefficient: 2 },
];

export const mockStudents: Student[] = [
  { id: "e1", firstName: "Aminata", lastName: "Diallo", email: "aminata.diallo@univ.edu", class: "L3 Info" },
  { id: "e2", firstName: "Moussa", lastName: "Traoré", email: "moussa.traore@univ.edu", class: "L3 Info" },
  { id: "e3", firstName: "Fatou", lastName: "Konaté", email: "fatou.konate@univ.edu", class: "L2 Math" },
  { id: "e4", firstName: "Ibrahim", lastName: "Sanogo", email: "ibrahim.sanogo@univ.edu", class: "L3 Info" },
  { id: "e5", firstName: "Aïcha", lastName: "Coulibaly", email: "aicha.coulibaly@univ.edu", class: "L2 Math" },
  { id: "e6", firstName: "Oumar", lastName: "Sidibé", email: "oumar.sidibe@univ.edu", class: "L1 Physique" },
  { id: "e7", firstName: "Mariam", lastName: "Bah", email: "mariam.bah@univ.edu", class: "L3 Info" },
  { id: "e8", firstName: "Seydou", lastName: "Keïta", email: "seydou.keita@univ.edu", class: "L1 Physique" },
];

export const mockGrades: Grade[] = [
  { id: "g1", studentId: "e1", subjectId: "s1", value: 16, date: "2025-01-15" },
  { id: "g2", studentId: "e1", subjectId: "s2", value: 14, date: "2025-01-15" },
  { id: "g3", studentId: "e1", subjectId: "s3", value: 18, date: "2025-01-20" },
  { id: "g4", studentId: "e1", subjectId: "s4", value: 12, date: "2025-01-22" },
  { id: "g5", studentId: "e2", subjectId: "s1", value: 11, date: "2025-01-15" },
  { id: "g6", studentId: "e2", subjectId: "s2", value: 13, date: "2025-01-15" },
  { id: "g7", studentId: "e2", subjectId: "s3", value: 15, date: "2025-01-20" },
  { id: "g8", studentId: "e3", subjectId: "s1", value: 17, date: "2025-01-15" },
  { id: "g9", studentId: "e3", subjectId: "s4", value: 14, date: "2025-01-22" },
  { id: "g10", studentId: "e4", subjectId: "s3", value: 19, date: "2025-01-20" },
  { id: "g11", studentId: "e4", subjectId: "s1", value: 13, date: "2025-01-15" },
  { id: "g12", studentId: "e5", subjectId: "s1", value: 8, date: "2025-01-15" },
  { id: "g13", studentId: "e5", subjectId: "s4", value: 15, date: "2025-01-22" },
  { id: "g14", studentId: "e6", subjectId: "s2", value: 10, date: "2025-01-15" },
  { id: "g15", studentId: "e6", subjectId: "s5", value: 12, date: "2025-01-25" },
  { id: "g16", studentId: "e7", subjectId: "s3", value: 16, date: "2025-01-20" },
  { id: "g17", studentId: "e7", subjectId: "s1", value: 14, date: "2025-01-15" },
  { id: "g18", studentId: "e8", subjectId: "s2", value: 9, date: "2025-01-15" },
  { id: "g19", studentId: "e8", subjectId: "s5", value: 11, date: "2025-01-25" },
];

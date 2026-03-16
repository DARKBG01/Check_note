import { useState, useCallback } from "react";
import { Student, Subject, Grade } from "@/types/student";
import { mockStudents, mockSubjects, mockGrades } from "@/data/mockData";

export function useStudentStore() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);

  const addStudent = useCallback((student: Omit<Student, "id">) => {
    const newStudent: Student = { ...student, id: `e${Date.now()}` };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  }, []);

  const addGrade = useCallback((grade: Omit<Grade, "id">) => {
    const newGrade: Grade = { ...grade, id: `g${Date.now()}` };
    setGrades((prev) => [...prev, newGrade]);
    return newGrade;
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
  }, []);

  const getStudentGrades = useCallback(
    (studentId: string) => grades.filter((g) => g.studentId === studentId),
    [grades]
  );

  const getStudentAverage = useCallback(
    (studentId: string) => {
      const studentGrades = grades.filter((g) => g.studentId === studentId);
      if (studentGrades.length === 0) return null;
      let totalWeighted = 0;
      let totalCoeff = 0;
      studentGrades.forEach((g) => {
        const subject = subjects.find((s) => s.id === g.subjectId);
        const coeff = subject?.coefficient ?? 1;
        totalWeighted += g.value * coeff;
        totalCoeff += coeff;
      });
      return totalCoeff > 0 ? totalWeighted / totalCoeff : null;
    },
    [grades, subjects]
  );

  const getOverallAverage = useCallback(() => {
    const averages = students
      .map((s) => getStudentAverage(s.id))
      .filter((a): a is number => a !== null);
    if (averages.length === 0) return 0;
    return averages.reduce((sum, a) => sum + a, 0) / averages.length;
  }, [students, getStudentAverage]);

  const getSubjectAverage = useCallback(
    (subjectId: string) => {
      const subjectGrades = grades.filter((g) => g.subjectId === subjectId);
      if (subjectGrades.length === 0) return null;
      return subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length;
    },
    [grades]
  );

  return {
    students,
    subjects,
    grades,
    addStudent,
    addGrade,
    deleteStudent,
    getStudentGrades,
    getStudentAverage,
    getOverallAverage,
    getSubjectAverage,
  };
}

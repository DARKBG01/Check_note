export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  class: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  value: number;
  date: string;
  comment?: string;
}

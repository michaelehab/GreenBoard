export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  joinedAt: Date;
  departmentId: string;
}

export interface Student extends User {
  level: number;
}

export interface Instructor extends User {}

export interface College {
  id: string;
  name: string;
  phone: string;
  email: string;
  adminPassword: string;
  location: string;
  foundedAt: number; // For now, to be changed
}

export interface School {
  id: string;
  name: string;
  phone: string;
  email: string;
  adminPassword: string;
  collegeId: string;
}

export interface Department {
  id: string;
  name: string;
  email: string;
  adminPassword: string;
  schoolId: string;
}

export interface Course {
  id: string;
  courseCode: string;
  name: string;
  password: string;
  departmentId: string;
}

export interface CourseData {
  id: string;
  courseCode: string;
  name: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  url: string;
  postedAt: number;
  courseId: string;
}

export interface CoursePost extends Post {}

export interface StudentQuestion extends Post {}

export interface Comment {
  id: string;
  comment: string;
  postedAt: number;
}

export interface PostComment extends Comment {
  userId: string;
  postId: string;
}

export interface InstructorAnswer extends Comment {
  instructorId: string;
  questionId: string;
}

export interface Quiz {
  id: string;
  name: string;
  quizDate: Date;
  isActive: boolean;
  courseId: string;
}

export interface QuizQuestion {
  question_number: number;
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  rightChoice: string;
  quizId: string;
  weight: number;
}

export interface Grade {
  grade: number;
  studentId: string;
  quizId: string;
  takenAt: Date;
}

export interface GradeWithName {
  grade: number;
  quizName: string;
  takenAt: Date;
  studentId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedAt: number;
  departmentId: string;
  schoolId: string;
  collegeId: string;
}

export interface UserRegistrationData {
  collegeId: string;
  schoolId: string;
  departmentName: string;
  schoolName: string;
  collegeName: string;
}

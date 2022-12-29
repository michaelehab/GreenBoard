export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  joinedAt: number;
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

export interface SchoolData {
  id: string;
  name: string;
  phone: string;
  email: string;
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

export interface CoursePost extends Post {
  instructorId: string;
}

export interface StudentQuestion extends Post {
  studentId: string;
}

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
  quizDate: number;
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
  takenAt: number;
}

export interface GradeWithName {
  grade: number;
  quizName: string;
  takenAt: number;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
}

export interface QuizWithName {
  id: string;
  quizName: string;
  quizDate: number;
  courseId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedAt: number;
  departmentId: string | null;
  schoolId: string | null;
  collegeId: string;
}

export interface UserRegistrationData {
  collegeId: string;
  schoolId: string;
  departmentName: string;
  schoolName: string;
  collegeName: string;
}

export interface UserDataAndComment extends Comment {
  commentId: string;
  postId: string;
  comment: string;
  postedAt: number;
  firstName: string;
  lastName: string;
}

export interface UserDataAndPost extends Post {
  firstName: string;
  lastName: string;
}

export interface QuizTrial {
  studentId: string;
  quizId: string;
  trialDate: number;
}

export interface ClientQuizQuestion {
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  weight: number;
}

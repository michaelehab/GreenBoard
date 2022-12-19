import { type } from "os";
import {
  College,
  Course,
  CoursePost,
  Department,
  Instructor,
  Post,
  PostComment,
  School,
  Student,
  StudentQuestion,
  Comment,
  InstructorAnswer,
  Quiz,
  QuizQuestion,
  Grade,
  GradeWithName,
} from "./types";

export interface SignInRequest {
  email: string;
  password: string;
}

// Student APIs
export type StudentSignUpRequest = Pick<
  Student,
  | "email"
  | "firstName"
  | "lastName"
  | "password"
  | "phone"
  | "level"
  | "departmentId"
>;

export interface StudentSignUpResponse {
  jwt: string;
}

export interface StudentSignInResponse {
  student: Pick<
    Student,
    | "id"
    | "email"
    | "firstName"
    | "lastName"
    | "phone"
    | "level"
    | "departmentId"
  >;
  jwt: string;
}

// Instructor APIs
export type InstructorSignUpRequest = Pick<
  Instructor,
  "email" | "firstName" | "lastName" | "password" | "phone" | "departmentId"
>;

export interface InstructorSignUpResponse {
  jwt: string;
}

export interface InstructorSignInResponse {
  instructor: Pick<
    Instructor,
    "email" | "firstName" | "lastName" | "id" | "phone" | "departmentId"
  >;
  jwt: string;
}

// College APIs
export type CollegeSignUpRequest = Pick<
  College,
  "email" | "foundedAt" | "location" | "name" | "phone" | "adminPassword"
>;
export interface CollegeSignUpResponse {
  jwt: string;
}

export interface CollegeSignInResponse {
  college: Pick<
    College,
    "id" | "email" | "foundedAt" | "location" | "name" | "phone"
  >;
  jwt: string;
}

export type CollegeUpdateRequest = Partial<College>;
export interface CollegeUpdateResponse {
  college: Pick<
    College,
    "id" | "email" | "foundedAt" | "location" | "name" | "phone"
  >;
}

export interface CollegeResetPasswordRequest {
  newPassword: string;
}
export interface CollegeResetPasswordResponse {}

// School APIs
export type SchoolSignUpRequest = Pick<
  School,
  "name" | "phone" | "adminPassword" | "email" | "collegeId"
>;

export interface SchoolSignUpResponse {
  jwt: string;
}

export interface SchoolSignInResponse {
  school: Pick<School, "id" | "email" | "name" | "phone" | "collegeId">;
  jwt: string;
}

export type SchoolUpdateRequest = Partial<School>;
export interface SchoolUpdateResponse {
  school: Pick<School, "id" | "email" | "collegeId" | "name" | "phone">;
}

export interface SchoolResetPasswordRequest {
  newPassword: string;
}
export interface SchoolResetPasswordResponse {}

// Department APIs
export type DepartmentSignUpRequest = Pick<
  Department,
  "name" | "adminPassword" | "email" | "schoolId"
>;

export interface DepartmentSignUpResponse {
  jwt: string;
}

export interface DepartmentSignInResponse {
  department: Pick<Department, "id" | "email" | "name" | "schoolId">;
  jwt: string;
}

export type DepartmentUpdateRequest = Partial<Department>;
export interface DepartmentUpdateResponse {
  department: Pick<Department, "id" | "email" | "schoolId" | "name">;
}

export interface DepartmentResetPasswordRequest {
  newPassword: string;
}
export interface DepartmentResetPasswordResponse {}

// Course APIs
export type CreateCourseRequest = Pick<
  Course,
  "courseCode" | "name" | "password"
  // DepartmentId will be fetched from the signed in user token
>;

export interface CreateCourseResponse {
  course: Pick<Course, "id" | "courseCode" | "name" | "departmentId">;
}

export interface CourseEnrollRequest {
  courseId: string;
  password: string;
  // UserId should be found in JWT token
}

export interface CourseEnrollResponse {}

// Post APIs
export type CreatePostRequest = Pick<Post, "title" | "url" | "content">;

export interface CreateCoursePostResponse {
  post: CoursePost;
}

export interface CreateStudentQuestionResponse {
  question: StudentQuestion;
}

export interface ListCoursePostsRequest {} // Course Id will be a url param
export interface ListCoursePostsResponse {
  posts: CoursePost[];
}

export interface GetCoursePostRequest {} // Course Id will be a url param
export interface GetCoursePostResponse {
  post: CoursePost;
}

export interface GetCourseStudentsQuestionsRequest {} // Course Id will be a url param
export interface GetCourseStudentsQuestionsResponse {
  questions: StudentQuestion[];
}

export interface GetCourseStudentQuestionRequest {} // Course Id will be a url param
export interface GetCourseStudentQuestionResponse {
  question: StudentQuestion;
}

//Post comment APIs
export type CreateCommentRequest = Pick<Comment, "comment">;

export interface CreatePostCommentResponse {
  postComment: PostComment;
}

export interface ListPostCommentRequest {} // post Id will be a url param
export interface ListPostCommentResponse {
  postComment: PostComment[];
}

export interface GetPostCommentsRequest {} // post Id will be a url param
export interface GetPostCommentsResponse {
  postComment: PostComment;
}

//Instructor answers APIs
export type CreateInstructorAnswerRequest = Pick<InstructorAnswer, "comment">;

export interface CreateInstructorAnswerResponse {
  instructorAnswer: InstructorAnswer;
}

export interface ListInstructorsAnswersRequest {} // post Id will be a url param
export interface ListInstructorsAnswersResponse {
  instructorAnswer: InstructorAnswer[];
}

export interface GetInstructorAnswerRequest {} // post Id will be a url param
export interface GetInstructorAnswerResponse {
  instructorAnswer: InstructorAnswer;
}

//Quiz API
export interface CreateQuizRequest {
  quiz: Pick<Quiz, "name" | "isActive" | "quizDate">;
  questions: Pick<
    QuizQuestion,
    | "question_number"
    | "question"
    | "choiceA"
    | "choiceB"
    | "choiceC"
    | "choiceD"
    | "rightChoice"
    | "weight"
  >[];
}

export interface CreateQuizResponse {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export interface GetQuizRequest {}
export interface GetQuizResponse {
  quiz: Quiz;
  questions: QuizQuestion[];
}

export interface SubmitQuizRequest {
  answers: string[];
}

export interface SubmitQuizResponse {
  grade: number;
}

export interface ListGradesRequest {}
export interface ListGradesResponse {
  grades: GradeWithName[];
}

export interface GetQuizGradesRequest {}
export interface GetQuizGradesResponse {
  grades: GradeWithName[]; // A single grade in case of student request
}

export interface GetStudentGradeRequest {}
export interface GetStudentGradeResponse {
  grades: GradeWithName[];
}

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
  Announcement,
  Grade,
  GradeWithName,
  CourseData,
  QuizWithName,
  UserDataAndComment,
  UserDataAndPost,
  ClientQuizQuestion,
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
  | "phoneNumber"
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
    | "phoneNumber"
    | "level"
    | "departmentId"
  >;
  jwt: string;
}

export type StudentUpdateRequest = Partial<Student>;
export interface StudentUpdateResponse {
  student: Pick<Student, "email" | "firstName" | "lastName" | "phoneNumber">;
}
// Instructor APIs
export type InstructorSignUpRequest = Pick<
  Instructor,
  | "email"
  | "firstName"
  | "lastName"
  | "password"
  | "phoneNumber"
  | "departmentId"
>;

export interface InstructorSignUpResponse {
  jwt: string;
}

export interface InstructorSignInResponse {
  instructor: Pick<
    Instructor,
    "email" | "firstName" | "lastName" | "id" | "phoneNumber" | "departmentId"
  >;
  jwt: string;
}

export type InstructorUpdateRequest = Partial<Instructor>;
export interface InstructorUpdateResponse {
  instructor: Pick<
    Instructor,
    "email" | "firstName" | "lastName" | "phoneNumber"
  >;
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

export interface GetCollegeRequest {}
export interface GetCollegeResponse {
  college: Pick<College, "email" | "foundedAt" | "location" | "name" | "phone">;
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

export interface GetSchoolRequest {}
export interface GetSchoolResponse {
  school: Pick<School, "name" | "phone" | "email">;
  collegeName: string;
}

export type SchoolUpdateRequest = Partial<School>;
export interface SchoolUpdateResponse {
  school: Pick<School, "email" | "collegeId" | "name" | "phone">;
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

export interface GetDepartmentRequest {}
export interface GetDepartmentResponse {
  department: Pick<Department, "name" | "email">;
  schoolName: string;
}

export type DepartmentUpdateRequest = Partial<Department>;
export interface DepartmentUpdateResponse {
  department: Pick<Department, "email" | "schoolId" | "name">;
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

export interface GetCourseDataRequest {}
export interface GetCourseDataResponse {
  course: CourseData;
}

export interface ListEnrolledInCoursesRequest {}
export interface ListEnrolledInCoursesResponse {
  courses: CourseData[];
}

export interface ListNotEnrolledInCoursesRequest {}
export interface ListNotEnrolledInCoursesResponse {
  courses: CourseData[];
}

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
  posts: UserDataAndPost[];
}

export interface GetCoursePostRequest {} // Course Id will be a url param
export interface GetCoursePostResponse {
  post: UserDataAndPost;
}

export interface GetCourseStudentsQuestionsRequest {} // Course Id will be a url param
export interface GetCourseStudentsQuestionsResponse {
  questions: UserDataAndPost[];
}

export interface GetCourseStudentQuestionRequest {} // Course Id will be a url param
export interface GetCourseStudentQuestionResponse {
  question: UserDataAndPost;
}

//Post comment APIs
export type CreateCommentRequest = Pick<Comment, "comment">;

export interface CreatePostCommentResponse {
  postComment: PostComment;
}

export interface ListPostCommentRequest {} // post Id will be a url param
export interface ListPostCommentResponse {
  postComment: UserDataAndComment[];
}

export interface GetPostCommentsRequest {} // post Id will be a url param
export interface GetPostCommentsResponse {
  postComment: UserDataAndComment;
}

//Instructor answers APIs
export type CreateInstructorAnswerRequest = Pick<InstructorAnswer, "comment">;

export interface CreateInstructorAnswerResponse {
  instructorAnswer: InstructorAnswer;
}

export interface ListInstructorsAnswersRequest {} // post Id will be a url param
export interface ListInstructorsAnswersResponse {
  InstructorDataAndAnswer: UserDataAndComment[];
}

export interface GetInstructorAnswerRequest {} // post Id will be a url param
export interface GetInstructorAnswerResponse {
  InstructorDataAndAnswer: UserDataAndComment;
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

export type ToggleQuizActivationRequest = Pick<Quiz, "isActive">;
export interface ToggleQuizActivationResponse {
  isActive: boolean;
}

export interface GetQuizRequest {}
export interface GetQuizResponse {
  quiz: Quiz;
  questions: Partial<QuizQuestion>[];
}

export interface SubmitQuizRequest {
  answers: string[];
}

export interface SubmitQuizResponse {
  grade: number;
}

export interface ListAvailableQuizzesRequest {}
export interface ListAvailableQuizzesResponse {
  quizzes: QuizWithName[];
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

//Announcement API
export type CreateAnnouncementRequest = Pick<Announcement, "title" | "content">;

export interface CreateAnnouncementResponse {
  announcement: Announcement;
}

export interface ListAnnouncementsRequest {}
export interface ListAnnouncementsResponse {
  collegeName: string;
  schoolName: string;
  departmentName: string;
  collegeAnnouncements: Announcement[];
  schoolAnnouncements: Announcement[];
  departmentAnnouncements: Announcement[];
}

export interface GetAnnouncementRequest {} // post Id will be a url param
export interface GetAnnouncementResponse {
  announcement: Announcement;
}

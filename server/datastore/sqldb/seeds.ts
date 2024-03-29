import {
  College,
  Department,
  School,
  Instructor,
  Student,
  Course,
  Enrollment,
  Post,
  CoursePost,
  StudentQuestion,
  Quiz,
  QuizQuestion,
  Grade,
  Announcement,
} from "@greenboard/shared";

// SEED_DEPARTMENT, SEED_DEPARTMENT2 belongs to SEED_SCHOOL
// SEED_SCHOOL belongs to SEED_COLLEGE
// SEED_INSTRUCTOR and SEED_STUDENT belong to SEED_DEPARTMENT
// SEED_INSTRUCTOR2 and SEED_STUDENT2 belong to SEED_DEPARTMENT2
// SEED_COURSE belongs to SEED_DEPARTMENT
// SEED_INSTRUCTOR and SEED_STUDENT are enrolled in SEED_COURSE

export const SEED_COLLEGE_PASSWORD = "SeedCollegeAdminPassword";

export const SEED_COLLEGE: College = {
  name: "College1",
  location: "Location1",
  phone: "Phone1",
  email: "Email1",
  adminPassword: "", // getPasswordHashed(SEED_COLLEGE_PASSWORD)
  foundedAt: 2022,
  id: "COLLEGE001",
};

export const SEED_SCHOOL_PASSWORD = "SeedSchoolAdminPassword";

export const SEED_SCHOOL: School = {
  id: "SCHOOL001",
  name: "School1",
  phone: "Phone1",
  email: "Email1",
  adminPassword: "", // getPasswordHashed(SEED_SCHOOL_PASSWORD)
  collegeId: SEED_COLLEGE.id,
};

export const SEED_DEPARTMENT_PASSWORD = "SeedDepartmentAdminPassword";

export const SEED_DEPARTMENT: Department = {
  id: "DEPT001",
  name: "Department1",
  email: "Email1",
  adminPassword: "", // getPasswordHashed(SEED_DEPARTMENT_PASSWORD)
  schoolId: SEED_SCHOOL.id,
};

export const SEED_DEPARTMENT2: Department = {
  id: "DEPT002",
  name: "Department2",
  email: "Email2",
  adminPassword: "", // getPasswordHashed(SEED_DEPARTMENT_PASSWORD)
  schoolId: SEED_SCHOOL.id,
};

export const SEED_INSTRUCTOR_PASSWORD = "SeedInstructorPassword";

export const SEED_INSTRUCTOR: Instructor = {
  id: "INSTR001",
  firstName: "FName",
  lastName: "LName",
  phoneNumber: "Phone1",
  email: "Email1",
  password: "", // getPasswordHashed(SEED_INSTRUCTOR_PASSWORD)
  joinedAt: Date.now(),
  departmentId: SEED_DEPARTMENT.id,
};

export const SEED_INSTRUCTOR2: Instructor = {
  id: "INSTR002",
  firstName: "FName2",
  lastName: "LName2",
  phoneNumber: "Phone2",
  email: "Email2",
  password: "", // getPasswordHashed(SEED_INSTRUCTOR_PASSWORD)
  joinedAt: Date.now(),
  departmentId: SEED_DEPARTMENT2.id,
};

export const SEED_STUDENT_PASSWORD = "SeedStudentPassword";

export const SEED_STUDENT: Student = {
  id: "STD001",
  firstName: "FName1",
  lastName: "LName1",
  phoneNumber: "Phone123",
  email: "Email123",
  password: "", // getPasswordHashed(SEED_STUDENT_PASSWORD)
  joinedAt: Date.now(),
  departmentId: SEED_DEPARTMENT.id,
  level: 1,
};

export const SEED_STUDENT2: Student = {
  id: "STD002",
  firstName: "FName2",
  lastName: "LName2",
  phoneNumber: "Phone1234",
  email: "Email1234",
  password: "", // getPasswordHashed(SEED_STUDENT_PASSWORD)
  joinedAt: Date.now(),
  departmentId: SEED_DEPARTMENT2.id,
  level: 2,
};

export const SEED_COURSE_PASSWORD = "SeedCoursePassword";

export const SEED_COURSE: Course = {
  id: "COURSE001",
  name: "CourseName",
  courseCode: "COURSECODE1",
  password: "", // getPasswordHashed(SEED_COURSE_PASSWORD)
  departmentId: SEED_DEPARTMENT.id,
};

export const SEED_STUDENT_ENROLLMENT: Enrollment = {
  userId: SEED_STUDENT.id,
  courseId: SEED_COURSE.id,
  id: "ENROLLMENT001",
};

export const SEED_INSTRUCTOR_ENROLLMENT: Enrollment = {
  userId: SEED_INSTRUCTOR.id,
  courseId: SEED_COURSE.id,
  id: "ENROLLMENT002",
};

export const SEED_COURSE_POST: CoursePost = {
  id: "COURSEPOST001",
  title: "Second Post title",
  url: "https://www.google.com",
  content: "This is a post content",
  postedAt: 2022,
  courseId: SEED_COURSE.id,
  instructorId: SEED_INSTRUCTOR.id,
};

export const SEED_STUDENT_QUESTION: StudentQuestion = {
  id: "STUDENTQUESTION001",
  title: "student question title",
  url: "https://www.google.com",
  content: "This is a question content",
  postedAt: 2022,
  courseId: SEED_COURSE.id,
  studentId: SEED_STUDENT.id,
};

//SEED_QUIZ AND SEED_QUIZ_QUESTIONS are for testing if the quiz is inactive
export const SEED_QUIZ: Quiz = {
  id: "Quiz0001",
  name: "Final Quiz",
  isActive: false,
  quizDate: Date.parse("2023-03-08"),
  courseId: SEED_COURSE.id,
};

export const SEED_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    quizId: SEED_QUIZ.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 1,
    weight: 1,
  },
  {
    quizId: SEED_QUIZ.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 2,
    weight: 2,
  },
  {
    quizId: SEED_QUIZ.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 3,
    weight: 3,
  },
];

//SEED_QUIZ_TAKEN AND SEED_QUIZ_QUESTIONS_TAKEN are for testing if the quiz is taken by a student before
export const SEED_QUIZ_TAKEN: Quiz = {
  id: "Quiz0003",
  name: " Quiz 1",
  isActive: false,
  quizDate: Date.parse("2023-03-08"),
  courseId: SEED_COURSE.id,
};

export const SEED_QUIZ_QUESTIONS_TAKEN: QuizQuestion[] = [
  {
    quizId: SEED_QUIZ_TAKEN.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 1,
    weight: 1,
  },
  {
    quizId: SEED_QUIZ_TAKEN.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 2,
    weight: 2,
  },
  {
    quizId: SEED_QUIZ_TAKEN.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 3,
    weight: 3,
  },
];

export const SEED_GRADE_STUDENT: Grade = {
  studentId: SEED_STUDENT.id,
  quizId: SEED_QUIZ_TAKEN.id,
  grade: 8.7,
  takenAt: Date.now(),
};

// SEED_QUIZ_OPEN and SEED_QUIZ_OPEN_QUESTIONS are used
// to test a student's ability to take the quiz and get a grade
export const SEED_QUIZ_OPEN: Quiz = {
  id: "Quiz0005",
  name: "Quiz 2",
  isActive: true,
  quizDate: Date.parse("2023-03-08"),
  courseId: SEED_COURSE.id,
};

export const SEED_QUIZ_OPEN_QUESTIONS: QuizQuestion[] = [
  {
    quizId: SEED_QUIZ_OPEN.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 1,
    weight: 1,
  },
  {
    quizId: SEED_QUIZ_OPEN.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 2,
    weight: 2,
  },
  {
    quizId: SEED_QUIZ_OPEN.id,
    question: "How are you?",
    choiceA: "happy",
    choiceB: "Very happy",
    choiceC: "Extremely happy",
    choiceD: "So happy",
    rightChoice: "A",
    question_number: 3,
    weight: 3,
  },
];

export const SEED_COLLEGE_ANNOUNCEMENT: Announcement = {
  id: "COLLEGE_ANNOUNCEMENT_ID",
  title: "College Announcement",
  content: "This is a College Announcement",
  postedAt: 2022,
  departmentId: null,
  schoolId: null,
  collegeId: SEED_COLLEGE.id,
};

export const SEED_SCHOOL_ANNOUNCEMENT: Announcement = {
  id: "SCHOOL_ANNOUNCEMENTL_ID",
  title: "SCHOOL Announcement",
  content: "This is a SCHOOL Announcement",
  postedAt: 2022,
  departmentId: null,
  schoolId: SEED_SCHOOL.id,
  collegeId: SEED_COLLEGE.id,
};

export const SEED_DEPARTMENT_ANNOUNCEMENT: Announcement = {
  id: "DEPARTMENT_ANNOUNCEMENT_ID",
  title: "DEPARTMENT Announcement",
  content: "This is a DEPARTMENT Announcement",
  postedAt: 2022,
  departmentId: SEED_DEPARTMENT.id,
  schoolId: SEED_SCHOOL.id,
  collegeId: SEED_COLLEGE.id,
};

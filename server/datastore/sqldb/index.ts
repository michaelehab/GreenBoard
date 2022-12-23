import {
  User,
  Student,
  College,
  School,
  Department,
  Instructor,
  Course,
  Enrollment,
  CoursePost,
  Post,
  StudentQuestion,
  Comment,
  PostComment,
  InstructorAnswer,
  Quiz,
  QuizQuestion,
  Grade,
  Announcement,
  UserRegistrationData,
  GradeWithName,
  CourseData,
} from "@greenboard/shared";
import path from "path";
import { Database, open as sqliteOpen } from "sqlite";
import sqlite3 from "sqlite3";

import { DataStore } from "..";
import { getPasswordHashed } from "../../utils";
import {
  SEED_COLLEGE,
  SEED_SCHOOL,
  SEED_DEPARTMENT,
  SEED_COURSE,
  SEED_STUDENT,
  SEED_INSTRUCTOR,
  SEED_COLLEGE_PASSWORD,
  SEED_SCHOOL_PASSWORD,
  SEED_DEPARTMENT_PASSWORD,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_STUDENT_PASSWORD,
  SEED_COURSE_PASSWORD,
  SEED_INSTRUCTOR2,
  SEED_STUDENT2,
  SEED_DEPARTMENT2,
  SEED_STUDENT_ENROLLMENT,
  SEED_INSTRUCTOR_ENROLLMENT,
  SEED_COURSE_POST,
  SEED_STUDENT_QUESTION,
  SEED_QUIZ,
  SEED_QUIZ_QUESTIONS,
  SEED_QUIZ_TAKEN,
  SEED_QUIZ_QUESTIONS_TAKEN,
  SEED_GRADE_STUDENT,
  SEED_QUIZ_OPEN,
  SEED_QUIZ_OPEN_QUESTIONS,
  SEED_COLLEGE_ANNOUNCEMENT,
  SEED_DEPARTMENT_ANNOUNCEMENT,
  SEED_SCHOOL_ANNOUNCEMENT,
} from "./seeds";

export class SQLDataStore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  public async openDb(dbPath: string) {
    try {
      this.db = await sqliteOpen({
        filename: dbPath,
        driver: sqlite3.Database,
      });
    } catch (e) {
      console.error("Failed to open database at path:", dbPath, "err:", e);
      process.exit(1);
    }

    // To keep the referential integrity
    this.db.run("PRAGMA foreign_keys = ON");

    await this.db.migrate({
      migrationsPath: path.join(__dirname, "migrations"),
    });

    if (dbPath == ":memory:") {
      await this.seedDb();
    }

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      "INSERT INTO users(id, firstName, lastName, email, password, phoneNumber, joinedAt, departmentId) VALUES (?,?,?,?,?,?,?,?)",
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phone,
      user.joinedAt,
      user.departmentId
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.get<User>("SELECT * FROM users WHERE id = ?", id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.db.get<User>(
      "SELECT * FROM users WHERE email = ?",
      email
    );
  }

  async getUserByPhoneNumber(phone: string): Promise<User | undefined> {
    return await this.db.get<User>(
      "SELECT * FROM users WHERE phoneNumber = ?",
      phone
    );
  }

  async createStudent(student: Student): Promise<void> {
    await this.createUser(student);

    await this.db.run(
      "INSERT INTO students(id, level) VALUES (?,?)",
      student.id,
      student.level
    );
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    return await this.db.get<Student>(
      "SELECT * FROM users JOIN students ON users.id = students.id WHERE users.id = ?",
      id
    );
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return await this.db.get<Student>(
      "SELECT * FROM users JOIN students ON users.id = students.id WHERE users.email = ?",
      email
    );
  }

  async getStudentByPhoneNumber(phone: string): Promise<Student | undefined> {
    return await this.db.get<Student>(
      "SELECT * FROM users JOIN students ON users.id = students.id WHERE users.phoneNumber = ?",
      phone
    );
  }

  async createCollege(college: College): Promise<void> {
    await this.db.run(
      "INSERT INTO colleges(id, name, phone, email, adminPassword, location, foundedAt) VALUES (?,?,?,?,?,?,?)",
      college.id,
      college.name,
      college.phone,
      college.email,
      college.adminPassword,
      college.location,
      college.foundedAt
    );
  }

  async updateCollege(college: College): Promise<void> {
    await this.db.run(
      "UPDATE colleges SET name = ?, phone = ?, email = ? WHERE id = ?",
      college.name,
      college.phone,
      college.email,
      college.id
    );
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    return await this.db.get<College>(
      "SELECT * FROM colleges WHERE id = ?",
      id
    );
  }

  async getCollegeByEmail(email: string): Promise<College | undefined> {
    return await this.db.get<College>(
      "SELECT * FROM colleges WHERE email = ?",
      email
    );
  }

  async createSchool(school: School): Promise<void> {
    await this.db.run(
      "INSERT INTO schools(id, name, phone, email, adminPassword, collegeId) VALUES (?,?,?,?,?,?)",
      school.id,
      school.name,
      school.phone,
      school.email,
      school.adminPassword,
      school.collegeId
    );
  }

  async getSchoolById(id: string): Promise<School | undefined> {
    return await this.db.get<School>("SELECT * FROM schools WHERE id = ?", id);
  }

  async getSchoolByEmail(email: string): Promise<School | undefined> {
    return await this.db.get<School>(
      "SELECT * FROM schools WHERE email = ?",
      email
    );
  }

  async createDepartment(department: Department): Promise<void> {
    await this.db.run(
      "INSERT INTO departments(id, name, email, adminPassword, schoolId) VALUES (?,?,?,?,?)",
      department.id,
      department.name,
      department.email,
      department.adminPassword,
      department.schoolId
    );
  }

  async getDepartmentById(id: string): Promise<Department | undefined> {
    return await this.db.get<Department>(
      "SELECT * FROM departments WHERE id = ?",
      id
    );
  }

  async getDepartmentByEmail(email: string): Promise<Department | undefined> {
    return await this.db.get<Department>(
      "SELECT * FROM departments WHERE email = ?",
      email
    );
  }

  async updateDepartment(department: Department): Promise<void> {
    await this.db.run(
      "UPDATE departments SET name = ?, email = ? WHERE id = ?",
      department.name,
      department.email,
      department.id
    );
  }

  async createInstructor(instructor: Instructor): Promise<void> {
    await this.createUser(instructor);

    await this.db.run("INSERT INTO Instructors(id) VALUES (?)", instructor.id);
  }

  async getInstructorById(id: string): Promise<Instructor | undefined> {
    return await this.db.get<Instructor>(
      "SELECT * FROM users JOIN instructors ON users.id = instructors.id WHERE users.id = ?",
      id
    );
  }

  async getInstructorByEmail(email: string): Promise<Instructor | undefined> {
    return await this.db.get<Instructor>(
      "SELECT * FROM users JOIN instructors ON users.id = instructors.id WHERE users.email = ?",
      email
    );
  }

  async getInstructorByPhoneNumber(
    phone: string
  ): Promise<Instructor | undefined> {
    return await this.db.get<Instructor>(
      "SELECT * FROM users JOIN instructors ON users.id = instructors.id WHERE users.phoneNumber = ?",
      phone
    );
  }

  async updateSchool(school: School): Promise<void> {
    await this.db.run(
      "UPDATE Schools SET name = ?, phone = ?, email = ? WHERE id = ?",
      school.name,
      school.phone,
      school.email,
      school.id
    );
  }

  async createCourse(course: Course): Promise<void> {
    await this.db.run(
      "INSERT INTO courses(id,courseCode,name,password,departmentId) VALUES(?,?,?,?,?)",
      course.id,
      course.courseCode,
      course.name,
      course.password,
      course.departmentId
    );
  }

  async getCourseByCode(courseCode: string): Promise<Course | undefined> {
    return await this.db.get<Course>(
      "SELECT * from courses where courseCode=?",
      courseCode
    );
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    return await this.db.get<Course>("SELECT * from courses where id=?", id);
  }

  async listEnrolledCourse(userId: string): Promise<CourseData[]> {
    return this.db.all<CourseData[]>(
      "SELECT courses.id, courses.courseCode, courses.name from courses JOIN enrollments ON enrollments.courseId = courses.id AND enrollments.userId = ?",
      userId
    );
  }

  async listAvailableCourses(
    userId: string,
    departmentId: string
  ): Promise<CourseData[]> {
    return this.db.all<CourseData[]>(
      "SELECT courses.id, courses.courseCode, courses.name from courses WHERE departmentId = ? EXCEPT SELECT courses.id, courses.courseCode, courses.name from courses JOIN enrollments ON enrollments.courseId = courses.id AND enrollments.userId = ?",
      departmentId,
      userId
    );
  }

  async createEnrollment(enrollment: Enrollment): Promise<void> {
    await this.db.run(
      "INSERT INTO enrollments(id, userId, courseId) VALUES (?,?,?)",
      enrollment.id,
      enrollment.userId,
      enrollment.courseId
    );
  }

  async checkEnrollment(
    userId: string,
    courseId: string
  ): Promise<Enrollment | undefined> {
    return await this.db.get<Enrollment>(
      "SELECT * from enrollments where userId = ? AND courseId = ? ",
      userId,
      courseId
    );
  }

  async createPost(post: Post): Promise<void> {
    await this.db.run(
      "INSERT INTO posts(id, title, content, url, postedAt, courseId) VALUES (?,?,?,?,?,?)",
      post.id,
      post.title,
      post.content,
      post.url,
      post.postedAt,
      post.courseId
    );
  }
  async createCoursePost(coursePost: CoursePost): Promise<void> {
    await this.createPost(coursePost);
    await this.db.run("INSERT INTO course_posts(id) VALUES (?)", coursePost.id);
  }
  async getCoursePostById(postId: string): Promise<CoursePost | undefined> {
    return await this.db.get<CoursePost>(
      "SELECT * FROM posts JOIN course_posts ON course_posts.id = posts.id WHERE posts.id = ?",
      postId
    );
  }
  async listCoursePostsByCourseId(courseId: string): Promise<CoursePost[]> {
    return await this.db.all<CoursePost[]>(
      "SELECT * FROM posts JOIN course_posts ON course_posts.id = posts.id WHERE posts.courseId = ? ORDER BY postedAt DESC",
      courseId
    );
  }
  async createStuQuestion(StudentQuestion: StudentQuestion): Promise<void> {
    await this.createPost(StudentQuestion);
    await this.db.run(
      "INSERT INTO students_questions(id) VALUES(?)",
      StudentQuestion.id
    );
  }
  async getStdQuestionById(
    StudentQuestionId: string
  ): Promise<StudentQuestion | undefined> {
    return await this.db.get<StudentQuestion>(
      "SELECT * FROM posts JOIN students_questions ON students_questions.id = posts.id WHERE posts.id = ?",
      StudentQuestionId
    );
  }
  async listStuQuestionByCourseId(
    courseId: string
  ): Promise<StudentQuestion[]> {
    return await this.db.all<StudentQuestion[]>(
      "SELECT * FROM posts JOIN students_questions ON students_questions.id = posts.id WHERE posts.courseId = ? ORDER BY postedAt DESC",
      courseId
    );
  }
  async createComment(Comment: Comment): Promise<void> {
    await this.db.run(
      "INSERT INTO comments(id,comment,postedAt) VALUES (?,?,?) ",
      Comment.id,
      Comment.comment,
      Comment.postedAt
    );
  }
  async createPostComment(PostComment: PostComment): Promise<void> {
    await this.createComment(PostComment);
    await this.db.run(
      "INSERT INTO post_comments(id,userId,postId) VALUES (?,?,?)",
      PostComment.id,
      PostComment.userId,
      PostComment.postId
    );
  }
  async getPostCommentById(
    postCommentId: string
  ): Promise<PostComment | undefined> {
    return await this.db.get<PostComment>(
      "SELECT * FROM comments JOIN post_comments ON post_comments.id = comments.id WHERE comments.id = ?",
      postCommentId
    );
  }
  async listPostCommentsByPostId(PostId: string): Promise<PostComment[]> {
    return await this.db.all<PostComment[]>(
      "SELECT * FROM comments JOIN post_comments ON post_comments.id = comments.id WHERE postId=?",
      PostId
    );
  }
  async createInstructorAnswer(
    InstructorAnswer: InstructorAnswer
  ): Promise<void> {
    await this.createComment(InstructorAnswer);
    await this.db.run(
      "INSERT INTO instructors_answers(id,instructorId,questionId) VALUES (?,?,?)",
      InstructorAnswer.id,
      InstructorAnswer.instructorId,
      InstructorAnswer.questionId
    );
  }
  async getInstructorAnswerById(
    AnswerId: string
  ): Promise<InstructorAnswer | undefined> {
    return await this.db.get<InstructorAnswer>(
      "SELECT * FROM comments JOIN instructors_answers ON instructors_answers.id = comments.id WHERE comments.id = ?",
      AnswerId
    );
  }
  async listInstructorAnswerByPostId(
    questionId: string
  ): Promise<InstructorAnswer[]> {
    return await this.db.all<InstructorAnswer[]>(
      "SELECT * FROM comments JOIN instructors_answers ON instructors_answers.id = comments.id WHERE questionId=?",
      questionId
    );
  }
  async createQuiz(quiz: Quiz): Promise<void> {
    await this.db.run(
      "INSERT INTO quizzes(id,name,quizDate,isActive,courseId) VALUES(?,?,?,?,?)",
      quiz.id,
      quiz.name,
      quiz.quizDate,
      quiz.isActive,
      quiz.courseId
    );
  }

  async createQuizQuestion(quizQuestion: QuizQuestion): Promise<void> {
    await this.db.run(
      "INSERT INTO quizzes_questions(question_number,question,choiceA,choiceB,choiceC,choiceD,rightChoice,quizId,weight) VALUES (?,?,?,?,?,?,?,?,?)",
      quizQuestion.question_number,
      quizQuestion.question,
      quizQuestion.choiceA,
      quizQuestion.choiceB,
      quizQuestion.choiceC,
      quizQuestion.choiceD,
      quizQuestion.rightChoice,
      quizQuestion.quizId,
      quizQuestion.weight
    );
  }

  async getQuizById(id: string): Promise<Quiz | undefined> {
    return await this.db.get<Quiz>("SELECT * FROM quizzes where id= ?", id);
  }

  async getQuizQuestionsByQuizId(
    QuizId: string
  ): Promise<QuizQuestion[] | undefined> {
    return await this.db.all<QuizQuestion[]>(
      "SELECT * FROM quizzes_questions where quizId=?",
      QuizId
    );
  }

  async createGrade(grade: Grade): Promise<void> {
    await this.db.run(
      "INSERT INTO grades(grade,studentId,quizId,takenAt) VALUES(?,?,?,?)",
      grade.grade,
      grade.studentId,
      grade.quizId,
      grade.takenAt
    );
  }

  async getGrade(studentId: string, quizId: string) {
    return await this.db.get<Grade>(
      "SELECT * FROM grades where studentId= ? and quizId=?",
      studentId,
      quizId
    );
  }

  async createAnnouncement(announcement: Announcement): Promise<void> {
    await this.db.run(
      "INSERT INTO announcements(id,title,content,postedAt,departmentId,schoolId,collegeId) VALUES(?,?,?,?,?,?,?)",
      announcement.id,
      announcement.title,
      announcement.content,
      announcement.postedAt,
      announcement.departmentId,
      announcement.schoolId,
      announcement.collegeId
    );
  }

  async getAnnouncementById(
    announcementId: string
  ): Promise<Announcement | undefined> {
    return await this.db.get<Announcement>(
      "SELECT * FROM announcements where id=? ",
      announcementId
    );
  }

  async listAnnouncementsOfCollegeByCollegeId(
    collegeId: string
  ): Promise<Announcement[]> {
    return await this.db.all<Announcement[]>(
      "SELECT * FROM announcements WHERE schoolId IS NULL AND departmentId IS NULL and collegeId=?",
      collegeId
    );
  }
  async listAnnouncementsOfSchoolBySchoolId(
    schoolId: string
  ): Promise<Announcement[]> {
    return await this.db.all<Announcement[]>(
      "SELECT * FROM announcements WHERE schoolId=? AND departmentId IS NULL",
      schoolId
    );
  }

  async listAnnouncementsOfDepartmentByDepartmentId(
    departmentId: string
  ): Promise<Announcement[]> {
    return await this.db.all<Announcement[]>(
      "SELECT * FROM announcements WHERE departmentId=?",
      departmentId
    );
  }

  async getUserRegistrationDatabyDepartmentId(
    departmentId: string
  ): Promise<UserRegistrationData | undefined> {
    return await this.db.get<UserRegistrationData>(
      "SELECT DISTINCT colleges.Id as collegeId,schools.id as schoolId,departments.name as departmentName,schools.name as schoolName,colleges.name as collegeName FROM schools,colleges,departments,users WHERE users.departmentId=departments.id and schoolId=schools.id and collegeId=colleges.id and departmentId=?",
      departmentId
    );
  }

  async getStudentGradesWithNameByCourseId(
    studentId: string,
    courseId: string
  ): Promise<GradeWithName[]> {
    return await this.db.all<GradeWithName[]>(
      "SELECT grades.grade, quizzes.name as quizName, grades.takenAt, grades.studentId from grades JOIN quizzes ON quizzes.id = grades.quizId WHERE grades.studentId = ? AND quizzes.courseId = ?",
      studentId,
      courseId
    );
  }
  async getQuizGradesWithNameById(quizId: string): Promise<GradeWithName[]> {
    return await this.db.all<GradeWithName[]>(
      "SELECT grades.grade, quizzes.name as quizName, grades.takenAt, grades.studentId from grades JOIN quizzes ON quizzes.id = grades.quizId WHERE grades.quizId = ?",
      quizId
    );
  }

  async getStudentGradeWithName(
    studentId: string,
    quizId: string
  ): Promise<GradeWithName | undefined> {
    return await this.db.get<GradeWithName>(
      "SELECT grades.grade, quizzes.name as quizName, grades.takenAt, grades.studentId from grades JOIN quizzes ON quizzes.id = grades.quizId WHERE grades.quizId = ? AND grades.studentId = ?",
      quizId,
      studentId
    );
  }

  private seedDb = async () => {
    SEED_COLLEGE.adminPassword = getPasswordHashed(SEED_COLLEGE_PASSWORD);
    await this.createCollege(SEED_COLLEGE);

    SEED_SCHOOL.adminPassword = getPasswordHashed(SEED_SCHOOL_PASSWORD);
    await this.createSchool(SEED_SCHOOL);

    SEED_DEPARTMENT.adminPassword = getPasswordHashed(SEED_DEPARTMENT_PASSWORD);
    await this.createDepartment(SEED_DEPARTMENT);

    SEED_DEPARTMENT2.adminPassword = getPasswordHashed(
      SEED_DEPARTMENT_PASSWORD
    );
    await this.createDepartment(SEED_DEPARTMENT2);

    SEED_INSTRUCTOR.password = getPasswordHashed(SEED_INSTRUCTOR_PASSWORD);
    await this.createInstructor(SEED_INSTRUCTOR);

    SEED_INSTRUCTOR2.password = getPasswordHashed(SEED_INSTRUCTOR_PASSWORD);
    await this.createInstructor(SEED_INSTRUCTOR2);

    SEED_STUDENT.password = getPasswordHashed(SEED_STUDENT_PASSWORD);
    await this.createStudent(SEED_STUDENT);

    SEED_STUDENT2.password = getPasswordHashed(SEED_STUDENT_PASSWORD);
    await this.createStudent(SEED_STUDENT2);

    SEED_COURSE.password = getPasswordHashed(SEED_COURSE_PASSWORD);
    await this.createCourse(SEED_COURSE);

    await this.createEnrollment(SEED_STUDENT_ENROLLMENT);

    await this.createEnrollment(SEED_INSTRUCTOR_ENROLLMENT);

    await this.createCoursePost(SEED_COURSE_POST);

    await this.createStuQuestion(SEED_STUDENT_QUESTION);

    await this.createQuiz(SEED_QUIZ);

    for (let i = 0; i < SEED_QUIZ_QUESTIONS.length; i++) {
      await this.createQuizQuestion(SEED_QUIZ_QUESTIONS[i]);
    }

    await this.createQuiz(SEED_QUIZ_TAKEN);

    for (let i = 0; i < SEED_QUIZ_QUESTIONS_TAKEN.length; i++) {
      await this.createQuizQuestion(SEED_QUIZ_QUESTIONS_TAKEN[i]);
    }

    await this.createGrade(SEED_GRADE_STUDENT);

    await this.createQuiz(SEED_QUIZ_OPEN);

    for (let i = 0; i < SEED_QUIZ_OPEN_QUESTIONS.length; i++) {
      await this.createQuizQuestion(SEED_QUIZ_OPEN_QUESTIONS[i]);
    }

    await this.createAnnouncement(SEED_COLLEGE_ANNOUNCEMENT);

    await this.createAnnouncement(SEED_DEPARTMENT_ANNOUNCEMENT);

    await this.createAnnouncement(SEED_SCHOOL_ANNOUNCEMENT);
  };
}

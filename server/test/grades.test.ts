import { GradeWithName, SubmitQuizRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSE,
  SEED_GRADE_STUDENT,
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR2,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_QUIZ,
  SEED_QUIZ_OPEN,
  SEED_QUIZ_TAKEN,
  SEED_STUDENT,
  SEED_STUDENT2,
  SEED_STUDENT_PASSWORD,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Quiz Grades tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let studentAuthHeader: object;
  let instructorAuthHeader: object;
  let studentNotInCourseAuthHeader: object;
  let instructorNotInCourseAuthHeader: object;

  const asnwer1: SubmitQuizRequest = {
    answers: ["A", "B", "C"],
  }; // Grade should be 1/6 * 100 = 16.67%

  const asnwer2: SubmitQuizRequest = {
    answers: ["B", "A", "C"],
  }; // Grade should be 2/6 * 100 = 33.33%

  const asnwer3: SubmitQuizRequest = {
    answers: ["B", "C", "A"],
  }; // Grade should be 3/6 * 100 = 50%

  const asnwer4: SubmitQuizRequest = {
    answers: ["A", "A", "C"],
  }; // Grade should be 3/6 * 100 = 50%

  const asnwer5: SubmitQuizRequest = {
    answers: ["B", "A", "A"],
  }; // Grade should be 5/6 * 100 = 83.33%

  const asnwer6: SubmitQuizRequest = {
    answers: ["A", "B", "A"],
  }; // Grade should be 4/6 * 100 = 66.67%

  const asnwer7: SubmitQuizRequest = {
    answers: ["A", "A", "A"],
  }; // Grade should be 6/6 * 100 = 100%

  const seedGradeWithName: GradeWithName = {
    quizName: SEED_QUIZ_TAKEN.name,
    takenAt: SEED_GRADE_STUDENT.takenAt,
    grade: SEED_GRADE_STUDENT.grade,
    studentId: SEED_STUDENT.id,
  };

  beforeAll(async () => {
    client = await getTestServer();

    studentAuthHeader = await getAuthToken(
      "/api/v1/student/signin",
      SEED_STUDENT.email,
      SEED_STUDENT_PASSWORD
    );

    instructorAuthHeader = await getAuthToken(
      "/api/v1/instructor/signin",
      SEED_INSTRUCTOR.email,
      SEED_INSTRUCTOR_PASSWORD
    );

    studentNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/student/signin",
      SEED_STUDENT2.email,
      SEED_STUDENT_PASSWORD
    );

    instructorNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/instructor/signin",
      SEED_INSTRUCTOR2.email,
      SEED_INSTRUCTOR_PASSWORD
    );
  });

  beforeEach(async () => {
    client = await getTestServer();
  });

  describe("Submit Quiz tests", () => {
    it("Submit quiz as an instructor in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer1)
        .set(instructorAuthHeader)
        .expect(403);
      expect(result.body.grade).toBeUndefined();
    });

    it("Submit quiz as an instructor in invalid course Id -- POST /api/v1/course/:courseId/quiz/:quizId returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/invalidCourseId/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer1)
        .set(instructorAuthHeader)
        .expect(403);

      expect(result.body.grade).toBeUndefined();
    });

    it("Submit quiz as an instructor not in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer1)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.grade).toBeUndefined();
    });

    it("Submit quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer1)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grade).toBeDefined();
      expect(result.body.grade).toBeCloseTo(16.67);
    });

    it("Submit quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer2)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grade).toBeDefined();
      expect(result.body.grade).toBeCloseTo(33.33);
    });

    it("Submit quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer3)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grade).toBeDefined();
      expect(result.body.grade).toEqual(50);
    });

    it("Submit quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer4)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grade).toBeDefined();
      expect(result.body.grade).toEqual(50);
    });

    it("Submit quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer5)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grade).toBeDefined();
      expect(result.body.grade).toBeCloseTo(83.33);
    });

    it("Submit quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer6)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grade).toBeDefined();
      expect(result.body.grade).toBeCloseTo(66.67);
    });

    it("Submit quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer7)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grade).toBeDefined();
      expect(result.body.grade).toEqual(100);
    });

    it("Submit quiz as a student not in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer7)
        .set(studentNotInCourseAuthHeader)
        .expect(403);

      expect(result.body.grade).toBeUndefined();
    });

    it("Submit quiz as an student in invalid course Id -- POST /api/v1/course/:courseId/quiz/:quizId returns 404", async () => {
      const result = await client
        .post(`/api/v1/course/invalidCourseId/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer1)
        .set(studentAuthHeader)
        .expect(404);

      expect(result.body.grade).toBeUndefined();
    });

    it("Submit quiz as an student in invalid quiz Id -- POST /api/v1/course/:courseId/quiz/:quizId returns 404", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/InvalidQuizId`)
        .send(asnwer1)
        .set(studentAuthHeader)
        .expect(404);

      expect(result.body.grade).toBeUndefined();
    });

    it("Submit inactivated quiz as a student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ.id}`)
        .send(asnwer7)
        .set(studentAuthHeader)
        .expect(403);

      expect(result.body.grade).toBeUndefined();
    });

    it("Send empty object as student in course -- POST /api/v1/course/:courseId/quiz/:quizId returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send({})
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.grade).toBeUndefined();
    });

    it("Submit quiz as unauthorized -- POST /api/v1/course/:courseId/quiz/:quizId returns 401", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send(asnwer1)
        .expect(401);
      expect(result.body.grade).toBeUndefined();
    });

    it("Submit quiz as student in course with missing questions -- POST /api/v1/course/:courseId/quiz/:quizId returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}`)
        .send({
          answers: ["A"],
        })
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.grade).toBeUndefined();
    });
  });

  describe("View Grades", () => {
    it("View all grades as a student in course -- GET /api/v1/course/:courseId/grades returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/grades`)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grades).toHaveLength(1);
      expect(result.body.grades[0].grade).toBeCloseTo(SEED_GRADE_STUDENT.grade);
    });
    it("View all grades as a student not in course -- GET /api/v1/course/:courseId/grades returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/grades`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all grades as a student in invalid course -- GET /api/v1/course/:courseId/grades returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/InvalidCourseId/grades`)
        .set(studentAuthHeader)
        .expect(404);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all grades as a unauthenticated in course -- GET /api/v1/course/:courseId/grades returns 401", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/grades`)
        .expect(401);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all grades as a instructor in course -- GET /api/v1/course/:courseId/grades returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/grades`)
        .set(instructorAuthHeader)
        .expect(403);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all grades as a instructor not in course -- GET /api/v1/course/:courseId/grades returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/grades`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all grades as a instructor in invalid course -- GET /api/v1/course/:courseId/grades returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/InvalidCourseId/grades`)
        .set(instructorAuthHeader)
        .expect(403);

      expect(result.body.grades).toBeUndefined();
    });
    it("View a specific quiz grade as a student in course -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_TAKEN.id}/grades`
        )
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.grades).toBeDefined();
      expect(result.body.grades[0].quizName).toEqual(
        seedGradeWithName.quizName
      );
      expect(result.body.grades[0].grade).toBeCloseTo(seedGradeWithName.grade);
      expect(result.body.grades[0].studentId).toEqual(
        seedGradeWithName.studentId
      );
    });
    it("View a specific quiz grade as a student not in course -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_TAKEN.id}/grades`
        )
        .set(studentNotInCourseAuthHeader)
        .expect(403);

      expect(result.body.grades).toBeUndefined();
    });
    it("View a specific quiz grade as a student in wrong course -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/InvalidCourseId/quiz/${SEED_QUIZ_TAKEN.id}/grades`)
        .set(studentAuthHeader)
        .expect(404);

      expect(result.body.grades).toBeUndefined();
    });
    it("View a specific quiz grade as a student in course wrong grade -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/quiz/InvalidGradeId/grades`)
        .set(studentAuthHeader)
        .expect(404);

      expect(result.body.grades).toBeUndefined();
    });
    it("View a specific quiz grade as a unauthenticated in course -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 401", async () => {
      const result = await client
        .get(
          `/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_TAKEN.id}/grades`
        )
        .expect(401);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all students grades in a specific quiz as instructor in course -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_TAKEN.id}/grades`
        )
        .set(instructorAuthHeader)
        .expect(200);

      expect(result.body.grades).toHaveLength(1);
      expect(result.body.grades[0].quizName).toEqual(
        seedGradeWithName.quizName
      );
      expect(result.body.grades[0].grade).toBeCloseTo(seedGradeWithName.grade);
      expect(result.body.grades[0].studentId).toEqual(
        seedGradeWithName.studentId
      );
    });
    it("View all students grades in a specific quiz as instructor not in course -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ.id}/grades`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all students grades in a specific quiz as instructor in wrong course -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/InvalidCourseId/quiz/${SEED_QUIZ.id}/grades`)
        .set(instructorAuthHeader)
        .expect(404);

      expect(result.body.grades).toBeUndefined();
    });
    it("View all students grades in a specific quiz as instructor in course wrong quiz -- GET /api/v1/course/:courseId/quiz/:quizId/grades returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/quiz/InvalidQuizId/grades`)
        .set(instructorAuthHeader)
        .expect(404);

      expect(result.body.grades).toBeUndefined();
    });
    it("View a specific student grades as instructor in course -- GET /api/v1/course/:courseId/quiz/:quizId/student/:studentId returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_TAKEN.id}/student/${SEED_STUDENT.id}/grades`
        )
        .set(instructorAuthHeader)
        .expect(200);

      expect(result.body.grades).toHaveLength(1);
      expect(result.body.grades[0].name).toEqual(seedGradeWithName.quizName);
      expect(result.body.grades[0].grade).toBeCloseTo(seedGradeWithName.grade);
      expect(result.body.grades[0].studentId).toEqual(
        seedGradeWithName.studentId
      );
    });
    it("View a specific wrong student grades as instructor in course -- GET /api/v1/course/:courseId/quiz/:quizId/student/:studentId returns 200 (empty)", async () => {
      const result = await client
        .get(
          `/api/v1/course/${SEED_COURSE.id}/quiz/${SEED_QUIZ_OPEN.id}/student/InvalidStudentId`
        )
        .set(instructorAuthHeader)
        .expect(200);

      expect(result.body.grades).toHaveLength(0);
    });
  });
});

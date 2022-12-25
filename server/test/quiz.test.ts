import { CreateQuizRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSE,
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR2,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_QUIZ,
  SEED_QUIZ_QUESTIONS,
  SEED_QUIZ_TAKEN,
  SEED_STUDENT,
  SEED_STUDENT2,
  SEED_STUDENT_PASSWORD,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Quiz and Quiz's Question tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let studentAuthHeader: object;
  let instructorAuthHeader: object;
  let studentNotInCourseAuthHeader: object;
  let instructorNotInCourseAuthHeader: object;
  let quizId: string;

  const quiz1: CreateQuizRequest = {
    quiz: {
      name: "MidTerm Quiz",
      isActive: true,
      quizDate: new Date("2023-03-07"),
    },
    questions: [
      {
        question: "How are you?",
        choiceA: "Sad",
        choiceB: "Very Sad",
        choiceC: "Extremely Sad",
        choiceD: "So Sad",
        rightChoice: "A",
        question_number: 1,
        weight: 1,
      },
      {
        question: "How are you?",
        choiceA: "Sad",
        choiceB: "Very Sad",
        choiceC: "Extremely Sad",
        choiceD: "So Sad",
        rightChoice: "A",
        question_number: 2,
        weight: 2,
      },
      {
        question: "How are you?",
        choiceA: "Sad",
        choiceB: "Very Sad",
        choiceC: "Extremely Sad",
        choiceD: "So Sad",
        rightChoice: "A",
        question_number: 3,
        weight: 3,
      },
    ],
  };

  beforeAll(async () => {
    client = await getTestServer();

    studentAuthHeader = await getAuthToken(
      "/api/v1/students/signin",
      SEED_STUDENT.email,
      SEED_STUDENT_PASSWORD
    );

    instructorAuthHeader = await getAuthToken(
      "/api/v1/instructor/signin",
      SEED_INSTRUCTOR.email,
      SEED_INSTRUCTOR_PASSWORD
    );

    studentNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/students/signin",
      SEED_STUDENT2.email,
      SEED_STUDENT_PASSWORD
    );

    instructorNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/instructor/signin",
      SEED_INSTRUCTOR2.email,
      SEED_INSTRUCTOR_PASSWORD
    );
  });
  describe("Create Quiz tests", () => {
    it("create a new quiz as an instructor in course -- POST /api/v1/courses/:courseId/quizzes returns 200", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send(quiz1)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body).toBeDefined();
      expect(result.body.quiz.name).toEqual(quiz1.quiz.name);
      expect(result.body.quiz.isActive).toEqual(quiz1.quiz.isActive);
      expect(result.body.quiz.quizDate).toEqual(
        quiz1.quiz.quizDate.toISOString()
      );
      for (let i = 0; i < quiz1.questions.length; i++) {
        expect(result.body.questions[i].question_number).toEqual(
          quiz1.questions[i].question_number
        );
        expect(result.body.questions[i].question).toEqual(
          quiz1.questions[i].question
        );
        expect(result.body.questions[i].choiceA).toEqual(
          quiz1.questions[i].choiceA
        );
        expect(result.body.questions[i].choiceB).toEqual(
          quiz1.questions[i].choiceB
        );
        expect(result.body.questions[i].choiceC).toEqual(
          quiz1.questions[i].choiceC
        );
        expect(result.body.questions[i].choiceD).toEqual(
          quiz1.questions[i].choiceD
        );
        expect(result.body.questions[i].rightChoice).toEqual(
          quiz1.questions[i].rightChoice
        );
        expect(result.body.questions[i].weight).toEqual(
          quiz1.questions[i].weight
        );
      }
      quizId = result.body.quiz.id;
    });
    it("create a new quiz as an instructor in invalid course Id -- POST /api/v1/courses/:courseId/quizzes returns 404", async () => {
      const result = await client
        .post(`/api/v1/courses/invalidCourseId/quizzes`)
        .send(quiz1)
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("create a new quiz as an instructor not in course -- POST /api/v1/courses/:courseId/quizzes returns 403", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send(quiz1)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
    it("create a new quiz as a student -- POST /api/v1/courses/:courseId/quizzes returns 403", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send(quiz1)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
    it("Send empty object as instructor in course -- POST /api/v1/courses/:courseId/quizzes returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
    it("create a new quiz as unauthorized -- POST /api/v1/courses/:courseId/quizzes returns 401", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send(quiz1)
        .expect(401);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
    it("create a new quiz as an instructor in course with missing field in a question-- POST /api/v1/courses/:courseId/quizzes returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send({
          quiz: {
            name: "MidTerm Quiz",
            isActive: false,
            quizDate: new Date("2023-03-07"),
          },
          questions: [
            {
              question: "How are you?",
              choiceA: "Sad",
              choiceB: "Very Sad",
              choiceD: "So Sad",
              rightChoice: "A",
              question_number: 1,
              weight: 1,
            },
          ],
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
    it("create a new quiz as an instructor in course with missing field -- POST /api/v1/courses/:courseId/quizzes returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send({
          quiz: {
            name: "MidTerm Quiz",
            isActive: false,
            quizDate: new Date("2023-03-07"),
          },
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
    it("create a new quiz as an instructor in course with missing field in a quiz-- POST /api/v1/courses/:courseId/quizzes returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/quizzes`)
        .send({
          quiz: { name: "MidTerm Quiz" },
          questions: [
            {
              question: "How are you?",
              choiceA: "Sad",
              choiceB: "Very Sad",
              choiceC: "too sad",
              choiceD: "So Sad",
              rightChoice: "A",
              question_number: 1,
              weight: 1,
            },
          ],
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
  });

  describe("Get Quiz tests", () => {
    it("Get a quiz as an instructor in course -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${quizId}`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body).toBeDefined();
      expect(result.body.quiz.name).toEqual(quiz1.quiz.name);
      expect(result.body.quiz.isActive).toEqual(+quiz1.quiz.isActive);
      expect(result.body.quiz.quizDate).toEqual(
        quiz1.quiz.quizDate.toISOString()
      );
      for (let i = 0; i < quiz1.questions.length; i++) {
        expect(result.body.questions[i].question_number).toEqual(
          quiz1.questions[i].question_number
        );
        expect(result.body.questions[i].question).toEqual(
          quiz1.questions[i].question
        );
        expect(result.body.questions[i].choiceA).toEqual(
          quiz1.questions[i].choiceA
        );
        expect(result.body.questions[i].choiceB).toEqual(
          quiz1.questions[i].choiceB
        );
        expect(result.body.questions[i].choiceC).toEqual(
          quiz1.questions[i].choiceC
        );
        expect(result.body.questions[i].choiceD).toEqual(
          quiz1.questions[i].choiceD
        );
        expect(result.body.questions[i].rightChoice).toEqual(
          quiz1.questions[i].rightChoice
        );
        expect(result.body.questions[i].weight).toEqual(
          quiz1.questions[i].weight
        );
      }
    });

    it("get a quiz as a student in course -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${quizId}`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body).toBeDefined();
      expect(result.body.quiz.name).toEqual(quiz1.quiz.name);
      expect(result.body.quiz.isActive).toEqual(+quiz1.quiz.isActive);
      expect(result.body.quiz.quizDate).toEqual(
        quiz1.quiz.quizDate.toISOString()
      );
      for (let i = 0; i < quiz1.questions.length; i++) {
        expect(result.body.questions[i].question_number).toEqual(
          quiz1.questions[i].question_number
        );
        expect(result.body.questions[i].question).toEqual(
          quiz1.questions[i].question
        );
        expect(result.body.questions[i].choiceA).toEqual(
          quiz1.questions[i].choiceA
        );
        expect(result.body.questions[i].choiceB).toEqual(
          quiz1.questions[i].choiceB
        );
        expect(result.body.questions[i].choiceC).toEqual(
          quiz1.questions[i].choiceC
        );
        expect(result.body.questions[i].choiceD).toEqual(
          quiz1.questions[i].choiceD
        );
        expect(result.body.questions[i].rightChoice).toEqual(
          quiz1.questions[i].rightChoice
        );
        expect(result.body.questions[i].weight).toEqual(
          quiz1.questions[i].weight
        );
      }
    });

    it("get a quiz as a student in course but quiz is inactive-- Get /api/v1/courses/:courseId/quizzes/:quizId returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${SEED_QUIZ.id}`)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as a instructor in course but quiz is inactive-- Get /api/v1/courses/:courseId/quizzes/:quizId returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${SEED_QUIZ.id}`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body).toBeDefined();
      expect(result.body.quiz.name).toEqual(SEED_QUIZ.name);
      expect(result.body.quiz.isActive).toEqual(+SEED_QUIZ.isActive);
      for (let i = 0; i < quiz1.questions.length; i++) {
        expect(result.body.questions[i].question_number).toEqual(
          SEED_QUIZ_QUESTIONS[i].question_number
        );
        expect(result.body.questions[i].question).toEqual(
          SEED_QUIZ_QUESTIONS[i].question
        );
        expect(result.body.questions[i].choiceA).toEqual(
          SEED_QUIZ_QUESTIONS[i].choiceA
        );
        expect(result.body.questions[i].choiceB).toEqual(
          SEED_QUIZ_QUESTIONS[i].choiceB
        );
        expect(result.body.questions[i].choiceC).toEqual(
          SEED_QUIZ_QUESTIONS[i].choiceC
        );
        expect(result.body.questions[i].choiceD).toEqual(
          SEED_QUIZ_QUESTIONS[i].choiceD
        );
        expect(result.body.questions[i].rightChoice).toEqual(
          SEED_QUIZ_QUESTIONS[i].rightChoice
        );
        expect(result.body.questions[i].weight).toEqual(
          SEED_QUIZ_QUESTIONS[i].weight
        );
      }
    });

    it("get a quiz as a student in course but student has taken it before-- Get /api/v1/courses/:courseId/quizzes/:quizId returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${SEED_QUIZ_TAKEN.id}`)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as an instructor in invalid course Id -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/invalidCourseId/quizzes/${quizId}`)
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as an instructor in invalid quiz Id -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/InvalidQuizId`)
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as a student in invalid course Id -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/invalidCourseId/quizzes/${quizId}`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as an student in invalid quiz Id -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/InvalidQuizId`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as unauthorized -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 401", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${quizId}`)
        .expect(401);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as an instructor not in course -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${quizId}`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });

    it("get a quiz as a student not in course -- Get /api/v1/courses/:courseId/quizzes/:quizId returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/quizzes/${quizId}`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.quiz).toBeUndefined();
      expect(result.body.questions).toBeUndefined();
    });
  });
});

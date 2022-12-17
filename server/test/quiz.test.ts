import { CreateQuizRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSE,
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR2,
  SEED_INSTRUCTOR_PASSWORD,
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

  const quiz1: CreateQuizRequest = {
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
  describe("Quiz tests", () => {
    it("create a new quiz as an instructor in course -- POST /api/v1/course/:courseId/quiz returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
        .send(quiz1)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body).toBeDefined();
      expect(result.body.quiz.name).toEqual(quiz1.quiz.name);
      expect(result.body.quiz.isActive).toEqual(quiz1.quiz.isActive);
      expect(result.body.quiz.quizDate).toEqual(quiz1.quiz.quizDate);
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
    it("create a new quiz as an instructor in invalid course Id -- POST /api/v1/course/:courseId/quiz returns 404", async () => {
      const result = await client
        .post(`/api/v1/course/invalidCourseId/quiz`)
        .send(quiz1)
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body).toBeUndefined();
    });

    it("create a new quiz as an instructor not in course -- POST /api/v1/course/:courseId/quiz returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
        .send(quiz1)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body).toBeUndefined();
    });
    it("create a new quiz as a student -- POST /api/v1/course/:courseId/quiz returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
        .send(quiz1)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body).toBeUndefined();
    });
    it("Send empty object as instructor in course -- POST /api/v1/course/:courseId/quiz returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body).toBeUndefined();
    });
    it("create a new quiz as unauthorized -- POST /api/v1/course/:courseId/quiz returns 401", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
        .send(quiz1)
        .expect(401);
      expect(result.body).toBeUndefined();
    });
    it("create a new quiz as an instructor in course with missing field in a question-- POST /api/v1/course/:courseId/quiz returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
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
      expect(result.body).toBeUndefined();
    });
    it("create a new quiz as an instructor in course with missing field -- POST /api/v1/course/:courseId/quiz returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
        .send({
          quiz: {
            name: "MidTerm Quiz",
            isActive: false,
            quizDate: new Date("2023-03-07"),
          },
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body).toBeUndefined();
    });
    it("create a new quiz as an instructor in course with missing field in a quiz-- POST /api/v1/course/:courseId/quiz returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/quiz`)
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
      expect(result.body).toBeUndefined();
    });
  });
});

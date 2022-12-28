CREATE TABLE users (
  id varchar(255) PRIMARY KEY,
  firstName varchar(255) NOT NULL,
  lastName varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  phoneNumber varchar(255) UNIQUE NOT NULL,
  joinedAt int NOT NULL,
  departmentId varchar(255) NOT NULL,
  FOREIGN KEY (departmentId) REFERENCES departments (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE students (
  id varchar(255) PRIMARY KEY,
  level int NOT NULL,
  FOREIGN KEY (id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE instructors (
  id varchar(255) PRIMARY KEY,
  FOREIGN KEY (id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE courses (
  id varchar(255) PRIMARY KEY,
  courseCode varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  password varchar(255),
  departmentId varchar(255) NOT NULL,
  FOREIGN KEY (departmentId) REFERENCES departments (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE enrollments (
  id varchar(255) PRIMARY KEY,
  userId varchar(255) NOT NULL,
  courseId varchar(255) NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id) 
  ON UPDATE CASCADE 
  ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE quizzes (
  id varchar(255) PRIMARY KEY,
  name varchar(255) NOT NULL,
  quizDate datetime NOT NULL,
  isActive bit NOT NULL,
  courseId varchar(255) NOT NULL,
  FOREIGN KEY (courseId) REFERENCES courses (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE

);

CREATE TABLE quizzes_questions (
  question_number int,
  question varchar(255) NOT NULL,
  choiceA varchar(255) NOT NULL,
  choiceB varchar(255) NOT NULL,
  choiceC varchar(255) NOT NULL,
  choiceD varchar(255) NOT NULL,
  rightChoice char NOT NULL,
  quizId varchar(255),
  weight int,
  PRIMARY KEY (question_number, quizId),
  FOREIGN KEY (quizId) REFERENCES quizzes (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE posts (
  id varchar(255) PRIMARY KEY,
  title varchar(255) NOT NULL,
  content varchar(255) NOT NULL,
  url varchar(255) NOT NULL,
  postedAt int NOT NULL,
  courseId varchar(255) NOT NULL,
  FOREIGN KEY (courseId) REFERENCES courses (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE

);

CREATE TABLE students_questions (
  id varchar(255)  NOT NULL PRIMARY KEY,
  studentId varchar(255) NOT NULL ,
  FOREIGN KEY (id) REFERENCES posts (id)   
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE

);

CREATE TABLE course_posts (
  id varchar(255) NOT NULL PRIMARY KEY,
  instructorId varchar(255) NOT NULL,
  FOREIGN KEY (id) REFERENCES posts (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (instructorId) REFERENCES instructors (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE

);

CREATE TABLE grades (
  grade float NOT NULL,
  studentId varchar(255) NOT NULL,
  quizId varchar(255) NOT NULL,
  takenAt datetime NOT NULL,
  PRIMARY KEY (studentId, quizId),
  FOREIGN KEY (studentId) REFERENCES students (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (quizId) REFERENCES quizzes (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE

);

CREATE TABLE comments (
  id varchar(255) PRIMARY KEY,
  comment varchar(255) NOT NULL,
  postedAt int NOT NULL
);

CREATE TABLE post_comments (
  id varchar(255) PRIMARY KEY,
  userId varchar(255) NOT NULL,
  postId varchar(255) NOT NULL,
  FOREIGN KEY (id) REFERENCES comments (id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES course_posts (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE

);

CREATE TABLE instructors_answers (
  id varchar(255) PRIMARY KEY,
  instructorId varchar(255) NOT NULL,
  questionId varchar(255) NOT NULL,
  FOREIGN KEY (id) REFERENCES comments (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (instructorId) REFERENCES instructors (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (questionId) REFERENCES students_questions (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE colleges (
  id varchar(255) PRIMARY KEY,
  name varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  adminPassword varchar(255) NOT NULL,
  location varchar(255) NOT NULL,
  foundedAt int NOT NULL
);

CREATE TABLE schools (
  id varchar(255) PRIMARY KEY,
  name varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  adminPassword varchar(255) NOT NULL,
  collegeId varchar(255) NOT NULL,
  FOREIGN KEY (collegeId) REFERENCES colleges (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE departments (
  id varchar(255) PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  adminPassword varchar(255) NOT NULL,
  schoolId varchar(255) NOT NULL,
  FOREIGN KEY (schoolId) REFERENCES schools (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE announcements (
  id varchar(255) PRIMARY KEY,
  title varchar(255) NOT NULL,
  content varchar(255) NOT NULL,
  postedAt int NOT NULL,
  departmentId varchar(255) DEFAULT(NULL),
  schoolId varchar(255) DEFAULT(NULL),
  collegeId varchar(255) NOT NULL,
  FOREIGN KEY (departmentId) REFERENCES departments (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (schoolId) REFERENCES schools (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (collegeId) REFERENCES colleges (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE `users` (
  `id` varchar(255) PRIMARY KEY,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) UNIQUE NOT NULL,
  `joined_at` datetime NOT NULL,
  `department_id` varchar(255) NOT NULL,
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
);

CREATE TABLE `students` (
  `id` varchar(255) PRIMARY KEY,
  `level` int NOT NULL,
  FOREIGN KEY (`id`) REFERENCES `users` (`id`)
);

CREATE TABLE `instructors` (
  `id` varchar(255) PRIMARY KEY,
  FOREIGN KEY (`id`) REFERENCES `users` (`id`)
);

CREATE TABLE `courses` (
  `id` varchar(255) PRIMARY KEY,
  `course_code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255),
  `department_id` varchar(255) NOT NULL,
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
);

CREATE TABLE `enrollments` (
  `id` varchar(255) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
);

CREATE TABLE `quizzes` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `quiz_date` datetime NOT NULL,
  `is_active` boolean NOT NULL,
  `course_id` varchar(255) NOT NULL,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
);

CREATE TABLE `quizzes_questions` (
  `question_number` int,
  `question` varchar(255) NOT NULL,
  `choice_a` varchar(255) NOT NULL,
  `choice_b` varchar(255) NOT NULL,
  `choice_c` varchar(255) NOT NULL,
  `choice_d` varchar(255) NOT NULL,
  `right_choice` char NOT NULL,
  `quiz_id` varchar(255),
  FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`)
);

CREATE TABLE `posts` (
  `id` varchar(255) PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `posted_at` int NOT NULL,
  `course_id` varchar(255) NOT NULL,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
);

CREATE TABLE `students_questions` (
  `id` varchar(255) NOT NULL,
  FOREIGN KEY (`id`) REFERENCES `posts` (`id`)
);

CREATE TABLE `course_posts` (
  `id` varchar(255) NOT NULL,
  FOREIGN KEY (`id`) REFERENCES `posts` (`id`)
);

CREATE TABLE `grades` (
  `grade` float NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `quiz_id` varchar(255) NOT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`)
);

CREATE TABLE `comments` (
  `id` varchar(255) PRIMARY KEY,
  `comment` varchar(255) NOT NULL,
  `posted_at` int NOT NULL
);

CREATE TABLE `post_comments` (
  `id` varchar(255) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  FOREIGN KEY (`id`) REFERENCES `comments` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`post_id`) REFERENCES `course_posts` (`id`)
);

CREATE TABLE `instructors_answers` (
  `id` varchar(255) PRIMARY KEY,
  `instructor_id` varchar(255) NOT NULL,
  `question_id` varchar(255) NOT NULL,
  FOREIGN KEY (`id`) REFERENCES `comments` (`id`),
  FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`),
  FOREIGN KEY (`question_id`) REFERENCES `students_questions` (`id`)
);

CREATE TABLE `colleges` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `founded_at` int NOT NULL
);

CREATE TABLE `schools` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `college_id` varchar(255) NOT NULL,
  FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`)
);

CREATE TABLE `departments` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `school_id` varchar(255) NOT NULL,
  FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`)
);

CREATE TABLE `announcements` (
  `id` varchar(255) PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `posted_at` int NOT NULL,
  `department_id` varchar(255),
  `school_id` varchar(255),
  `college_id` varchar(255) NOT NULL,
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`),
  FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`)
);

CREATE UNIQUE INDEX `quizzes_questions_index_0` ON `quizzes_questions` (`question_number`, `quiz_id`);

CREATE UNIQUE INDEX `grades_index_1` ON `grades` (`student_id`, `quiz_id`);

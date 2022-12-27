CREATE TABLE `quizzes_logs` (
  `studentId` varchar(255) NOT NULL,
  `quizId` varchar(255) NOT NULL,
  PRIMARY KEY (studentId, quizId),
  FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`id`)
);
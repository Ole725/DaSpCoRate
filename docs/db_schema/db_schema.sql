-- --------------------------------------------------------
-- DaSpCoRate SQL Schema
--
-- Dieses Skript erstellt die Datenbanktabellen für das DaSpCoRate-Projekt.
-- Es wurde für MySQL 8.0 optimiert.
-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `trainers`
--
-- Diese Tabelle speichert die Informationen der Tanztrainer.
--
CREATE TABLE `trainers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(25) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tabellenstruktur für Tabelle `couples`
--
-- Diese Tabelle speichert die Informationen der Tanzpaare (Benutzer).
--
CREATE TABLE `couples` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mr_first_name` VARCHAR(255) NOT NULL,
  `mrs_first_name` VARCHAR(255) NOT NULL,
  `start_group` VARCHAR(255) NOT NULL,
  `start_class` VARCHAR(255) NOT NULL,
  `dance_style` VARCHAR(5) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(25) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tabellenstruktur für Tabelle `sessions`
--
-- Diese Tabelle speichert Details zu den einzelnen Trainingssessions.
-- Die trainer_id referenziert die `trainers`-Tabelle.
--
CREATE TABLE `sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `trainer_id` INT DEFAULT NULL, -- Kann NULL sein, falls der Trainer gelöscht wird oder nicht zugeordnet ist.
  `session_date` DATE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`trainer_id`) REFERENCES `trainers`(`id`) ON DELETE SET NULL
  -- ON DELETE SET NULL: Wenn ein Trainer gelöscht wird, wird seine trainer_id in den Sessions auf NULL gesetzt.
  -- Dies verhindert den Verlust von Sessions, ermöglicht aber die Trennung vom ursprünglichen Trainer.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tabellenstruktur für Tabelle `ratings`
--
-- Diese Tabelle speichert die Bewertungen für Paare in bestimmten Sessions und Runden.
--
CREATE TABLE `ratings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `session_id` INT NOT NULL,
  `couple_id` INT NOT NULL,
  `round` INT NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tabellenstruktur für Tabelle `session_enrollment`
--
-- Diese Tabelle verwaltet, welche Paare sich für welche Sessions angemeldet haben.
--
CREATE TABLE `session_enrollment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `session_id` INT NOT NULL,
  `couple_id` INT NOT NULL,
  `enrolled_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
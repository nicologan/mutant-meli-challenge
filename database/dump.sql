-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.1.37-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win32
-- HeidiSQL Versión:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para meli
CREATE DATABASE IF NOT EXISTS `meli` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `meli`;

-- Volcando estructura para tabla meli.dna
CREATE TABLE IF NOT EXISTS `dna` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `dna` text NOT NULL,
  `dna_type` enum('H','M') NOT NULL COMMENT 'Humano o Mutante',
  PRIMARY KEY (`id`),
  KEY `type` (`dna_type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla meli.dna: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `dna` DISABLE KEYS */;
/*!40000 ALTER TABLE `dna` ENABLE KEYS */;

-- Volcando estructura para tabla meli.stats
CREATE TABLE IF NOT EXISTS `stats` (
  `count_mutant_dna` bigint(20) unsigned DEFAULT '0',
  `count_human_dna` bigint(20) unsigned DEFAULT '0',
  `ratio` float unsigned DEFAULT '0',
  KEY `mutant_count` (`count_mutant_dna`),
  KEY `human_count` (`count_human_dna`),
  KEY `ratio` (`ratio`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla meli.stats: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `stats` DISABLE KEYS */;
INSERT INTO `stats` (`count_mutant_dna`, `count_human_dna`, `ratio`) VALUES
	(0, 0, 0);
/*!40000 ALTER TABLE `stats` ENABLE KEYS */;

-- Volcando estructura para disparador meli.dna_after_inster
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `dna_after_inster` AFTER INSERT ON `dna` FOR EACH ROW BEGIN
	IF NEW.dna_type = "M" THEN
		UPDATE stats set count_mutant_dna = count_mutant_dna + 1;
	END IF;
	UPDATE stats set count_human_dna = count_human_dna + 1;
	UPDATE stats set ratio = count_mutant_dna / count_human_dna;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

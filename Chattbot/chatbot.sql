-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 21 feb 2022 kl 14:10
-- Serverversion: 10.4.20-MariaDB
-- PHP-version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `chatbot`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `chatbot`
--

CREATE TABLE `chatbot` (
  `id` int(10) NOT NULL,
  `messages` varchar(50) NOT NULL,
  `replies` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumpning av Data i tabell `chatbot`
--

INSERT INTO `chatbot` (`id`, `messages`, `replies`) VALUES
(1, 'Hej', 'Hej, Hur mår du?'),
(2, 'Bra', 'Vad kul att höra, något mer du undrar över?'),
(3, 'dåligt', 'Haha smäääämst'),
(4, 'hejdå', 'Hejdå BIIITCH'),
(5, 'Varför så elak', 'oooh en liten snöflinga har dykit upp'),
(6, 'kan du berätta en hemlighet till mig', 'Aa visst, Nicola Tesla är Serb'),
(7, 'Har du haft någon rolig konversation?', 'Nej, alla konversationer är de samma konstant'),
(8, 'Finns det någon känd Kroat?', 'Nej, ingen, INGEN LINUS INGEN :D');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

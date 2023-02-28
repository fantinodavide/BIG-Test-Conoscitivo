-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Creato il: Feb 28, 2023 alle 22:01
-- Versione del server: 5.7.39
-- Versione PHP: 8.0.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_BIG`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `bancale`
--

CREATE TABLE `bancale` (
  `id` int(4) NOT NULL,
  `id_lotto` int(4) NOT NULL,
  `peso` int(2) NOT NULL,
  `codice` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `bancale`
--

INSERT INTO `bancale` (`id`, `id_lotto`, `peso`, `codice`) VALUES
(2, 2, 25, 'B2'),
(3, 1, 1, 'B5'),
(7, 3, 100, 'B6');

-- --------------------------------------------------------

--
-- Struttura della tabella `cliente`
--

CREATE TABLE `cliente` (
  `id` int(4) NOT NULL,
  `nome` varchar(20) NOT NULL,
  `cognome` varchar(20) NOT NULL,
  `indirizzo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `cliente`
--

INSERT INTO `cliente` (`id`, `nome`, `cognome`, `indirizzo`) VALUES
(1, 'Davide', 'Fantino', 'Viale Vittorio Veneto 13'),
(3, 'Mario', 'Rossi', 'Via Roma 1, Roma (XXXXX)');

-- --------------------------------------------------------

--
-- Struttura della tabella `etichetta`
--

CREATE TABLE `etichetta` (
  `id` int(4) NOT NULL,
  `id_cliente` int(4) NOT NULL,
  `id_bancale` int(4) NOT NULL,
  `data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `etichetta`
--

INSERT INTO `etichetta` (`id`, `id_cliente`, `id_bancale`, `data`) VALUES
(3, 1, 2, '2023-02-28 17:08:59'),
(5, 3, 3, '2023-02-28 17:14:44'),
(10, 3, 7, '2023-02-28 17:23:57');

-- --------------------------------------------------------

--
-- Struttura della tabella `lotti`
--

CREATE TABLE `lotti` (
  `id` int(4) NOT NULL,
  `id_prodotto` int(4) NOT NULL,
  `scadenza` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `lotti`
--

INSERT INTO `lotti` (`id`, `id_prodotto`, `scadenza`) VALUES
(1, 1, '2023-04-02'),
(2, 6, '2023-04-02'),
(3, 3, '2023-04-12');

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotto`
--

CREATE TABLE `prodotto` (
  `id` int(4) NOT NULL,
  `codice` varchar(20) NOT NULL,
  `descrizione` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `prodotto`
--

INSERT INTO `prodotto` (`id`, `codice`, `descrizione`) VALUES
(1, 'BAN123', 'banane blu'),
(2, 'mel3', 'mele arancioni e viola'),
(3, 'sard1', 'sardina uno'),
(5, 'spin', 'spinaccio'),
(6, 'LIM0N3', 'limoni verdi'),
(7, 'FK1', 'fichi');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `bancale`
--
ALTER TABLE `bancale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lotto` (`id_lotto`) USING BTREE;

--
-- Indici per le tabelle `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `etichetta`
--
ALTER TABLE `etichetta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente` (`id_cliente`),
  ADD KEY `bancale` (`id_bancale`);

--
-- Indici per le tabelle `lotti`
--
ALTER TABLE `lotti`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prodotto` (`id_prodotto`);

--
-- Indici per le tabelle `prodotto`
--
ALTER TABLE `prodotto`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `bancale`
--
ALTER TABLE `bancale`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT per la tabella `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `etichetta`
--
ALTER TABLE `etichetta`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `lotti`
--
ALTER TABLE `lotti`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `prodotto`
--
ALTER TABLE `prodotto`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `bancale`
--
ALTER TABLE `bancale`
  ADD CONSTRAINT `lotto` FOREIGN KEY (`id_lotto`) REFERENCES `lotti` (`id`) ON UPDATE CASCADE;

--
-- Limiti per la tabella `etichetta`
--
ALTER TABLE `etichetta`
  ADD CONSTRAINT `bancale` FOREIGN KEY (`id_bancale`) REFERENCES `bancale` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON UPDATE CASCADE;

--
-- Limiti per la tabella `lotti`
--
ALTER TABLE `lotti`
  ADD CONSTRAINT `prodotto` FOREIGN KEY (`id_prodotto`) REFERENCES `prodotto` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2015. Júl 10. 17:50
-- Kiszolgáló verziója: 5.6.24
-- PHP verzió: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Adatbázis: `enekeskonyv`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `language`
--

CREATE TABLE IF NOT EXISTS `language` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- A tábla adatainak kiíratása `language`
--

INSERT INTO `language` (`id`, `name`) VALUES
(1, 'Magyar'),
(2, 'English');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `song`
--

CREATE TABLE IF NOT EXISTS `song` (
  `id` int(11) NOT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `creator` int(11) NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `song` text COLLATE utf8_unicode_ci NOT NULL,
  `sheet_music` text COLLATE utf8_unicode_ci NOT NULL,
  `language` int(11) NOT NULL,
  `other_languages` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `labels` text COLLATE utf8_unicode_ci NOT NULL,
  `comment` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- A tábla adatainak kiíratása `song`
--

INSERT INTO `song` (`id`, `version`, `creator`, `title`, `song`, `sheet_music`, `language`, `other_languages`, `labels`, `comment`) VALUES
(1, 1, 0, 'ez egy cím', 'ez meg egy leíró', 'na ez meg egy kotta', 1, '0', '', ''),
(2, 1, 0, 'ez egy keres', 'ez meg egy leíró', 'na ez meg egy kotta', 1, '0', '', ''),
(3, 1, 0, 'ez egy másik', 'ez meg egy leíró', 'na ez meg egy kotta', 1, '0', '', ''),
(4, 1, 0, 'ebben is benne van, hogy cím', 'ez meg egy leíró', 'na ez meg egy kotta', 1, '0', '', ''),
(5, 1, 0, 'ez egy cím', 'üöplokjhgf', '', 2, '0', '', ''),
(6, 1, 0, 'ez egy cím', 'üöplokjhgfÖÜÓŐÚÉÁŰÍ öüóőúéáűí ez most egy kicsit hosszabb lesz, remélem már kifolyik az ötven karakterből', '', 1, '0', '', ''),
(7, 1, 0, 'Példaének', 'Atyám két kezedben, te vagy a lakhatom...[a][v][r][b][/b][/r][/v][/a]', 'options stave-distance=30 space=10\ntabstave notation=true tablature=false key=C time=4/4', 2, NULL, '', ''),
(8, 1, 0, 'Ez egy másik példaének', 'asdasdasd', 'options stave-distance=30 space=10\ntabstave notation=true tablature=false key=C time=4/4', 1, '7', 'ez,egy,címke', 'Ez itt egy megjegyzés'),
(9, 1, 0, 'Hull a pelyhes fehér hó', '[a] A      /       D     A   D       A      E   A  [/a]\nHull a pelyhes fehér hó, jöjj el kedves Télapó!\n[a]A      /       D     A    D     A    E      A[/a]\nMinden gyermek várva vár, vidám ének hangja száll.\n[a]A      E      A      E   A     E     A    E[/a]\nVan zsákodban minden jó, piros alma, mogyoró,\n[a]A       A7       D      A    A      E        A    [/a]\nJöjj el hozzánk, várunk rád, kedves öreg Télapó.\n\nNagy szakállú Télapó jó gyermek barátja.\nCukrot, diót, mogyorót rejteget a zsákja.\nAmerre jár reggelig kis cipőcske megtelik,\nmegtölti a Télapó, ha üresen látja!', 'options stave-distance=30 space=10\ntabstave notation=true tablature=false key=C time=4/4', 1, '0', 'télapó,hó,fehér,gyerek,vidám', ''),
(10, 1, 18, 'Creator Teszt', 'most ez nincs[v]asd[/v]', 'options stave-distance=30 space=10 width=1176\ntabstave notation=true tablature=false key=C time=4/4', 1, '0', 'teszt', '');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `songbook`
--

CREATE TABLE IF NOT EXISTS `songbook` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `public` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- A tábla adatainak kiíratása `songbook`
--

INSERT INTO `songbook` (`id`, `userid`, `title`, `public`) VALUES
(1, 12, 'Érdekes', 0),
(2, 12, 'EZisöüóőú', 0),
(3, 12, 'Valami új', 0),
(4, 12, 'Hozzáadom', 0),
(5, 12, 'Nev', 0),
(6, 18, 'kitaláltam', 0),
(8, 18, 'kitaláltam2', 0),
(9, 18, 'ABC', 0),
(10, 18, 'ASD', 0),
(11, 18, '1 hónap múlva lesz a szülinapom!!!!!!!!!!!44négy', 0),
(12, 18, '', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `themes`
--

CREATE TABLE IF NOT EXISTS `themes` (
  `id` int(11) NOT NULL,
  `title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `public` int(1) NOT NULL DEFAULT '1',
  `creator` int(11) NOT NULL,
  `theme` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'in custom definition'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- A tábla adatainak kiíratása `themes`
--

INSERT INTO `themes` (`id`, `title`, `public`, `creator`, `theme`) VALUES
(1, 'Rózsaszín', 1, 18, 'Kereső háttér:searchbar-background:background-color:#e765f5;Háttér:body-background:background-color:#F0F8FF;Kör gomb háttér:circle-button-background:background-color:#F44336;Kártya háttér:card-panel:background-color:#FFFFFF'),
(2, 'próba', 0, 18, 'Kereső háttér:searchbar-background:background-color:#85c3f2;Háttér:body-background:background-color:#F0F8FF;Kör gomb háttér:circle-button-background:background-color:#F44336;Kártya háttér:card-panel:background-color:#FFFFFF'),
(3, 'próba2', 1, 18, 'Kereső háttér:searchbar-background:background-color:#64b5f6;Háttér:body-background:background-color:#F0F8FF;Kör gomb háttér:circle-button-background:background-color:#F44336;Kártya háttér:card-panel:background-color:#FFFFFF'),
(4, 'próba6', 0, 18, 'Kereső háttér:searchbar-background:background-color:#59a2d9;Háttér:body-background:background-color:#F0F8FF;Kör gomb háttér:circle-button-background:background-color:#F44336;Kártya háttér:card-panel:background-color:#FFFFFF'),
(5, 'próba7', 1, 18, 'Kereső háttér:searchbar-background:background-color:#eb7ef7;Háttér:body-background:background-color:#abcdeb;Kör gomb háttér:circle-button-background:background-color:#38f2ba;Kártya háttér:card-panel:background-color:#fafaed'),
(6, 'színes', 0, 18, 'Kereső háttér:searchbar-background:background-color:#00ffb3;Háttér:body-background:background-color:#bfc3c7;Kör gomb háttér:circle-button-background:background-color:#F44336;Kártya háttér:card-panel:background-color:#ebfaec');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `session` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `firstname` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `pass` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `chosentheme` int(11) NOT NULL DEFAULT '0',
  `admin` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='A felhasználók itt vannak eltárolva';

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `session`, `lastname`, `firstname`, `username`, `email`, `pass`, `date`, `chosentheme`, `admin`) VALUES
(12, 'asd', 'Albert', 'Csat', 'abc3', 'asd@sad.hu', 'NocNbz6oZYtUI', '2015-07-09 09:31:17', 0, 0),
(15, '', 'Csatári', 'Albert', 'csatari2', 'albert.csatari@gmail.com', 'NoTYSsIs4GzBs', '0000-00-00 00:00:00', 0, 0),
(16, '', 'Csatári', 'Albert', 'asdasd', 'albert.csatari@gmail.com', 'NoSML2UrO5JCc', '0000-00-00 00:00:00', 0, 0),
(18, 'e659f5be50a8b77ef27a9e19fa5351061c18179cb55d462b477ee57e7ab9775e', 'Csatári', 'Albert', 'csatari', 'csatari2864@gmail.com', 'NoTYSsIs4GzBs', '2015-07-10 11:20:26', 0, 0),
(19, '', 'Réti', 'Noémi', 'ananasliget', 'noemireti73@gmail.com', 'NoMqp.IKiwJbs', '2015-04-06 15:56:55', 0, 0),
(20, '619976ab557aab88dc58a51874adf144424585afb0dfd597082653281763f000', 'Varga ', 'Ferenc', 'korház22', 'ferenc@gmail.com', 'NouU/0WbQyy/w', '2015-07-03 17:33:19', 0, 0);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `songbook`
--
ALTER TABLE `songbook`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `language`
--
ALTER TABLE `language`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT a táblához `song`
--
ALTER TABLE `song`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT a táblához `songbook`
--
ALTER TABLE `songbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT a táblához `themes`
--
ALTER TABLE `themes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

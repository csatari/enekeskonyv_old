-- enekeskonyv adatbázis

-- enek tábla
CREATE TABLE IF NOT EXISTS `enek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cim` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `leiro` text COLLATE utf8_unicode_ci NOT NULL,
  `kotta` text COLLATE utf8_unicode_ci NOT NULL,
  `nyelv` int(11) NOT NULL,
  `masnyelven` int(11) DEFAULT NULL,
  `cimkek` text COLLATE utf8_unicode_ci NOT NULL,
  `megjegyzes` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- tesztadatok
INSERT INTO `enek` (`id`, `cim`, `leiro`, `kotta`, `nyelv`) VALUES
(1, 'ez egy cím', 'ez meg egy leíró', 'na ez meg egy kotta', 0),
(2, 'ez egy keres', 'ez meg egy leíró', 'na ez meg egy kotta', 0),
(3, 'ez egy másik', 'ez meg egy leíró', 'na ez meg egy kotta', 0),
(4, 'ebben is benne van, hogy cím', 'ez meg egy leíró', 'na ez meg egy kotta', 0);

--
-- Tábla szerkezet ehhez a táblához `enekeskonyv`
--

CREATE TABLE IF NOT EXISTS `enekeskonyv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

--
-- Tábla szerkezet ehhez a táblához `nyelv`
--

CREATE TABLE IF NOT EXISTS `nyelv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- A tábla adatainak kiíratása `nyelv`
--

INSERT INTO `nyelv` (`id`, `nev`) VALUES
(1, 'Magyar'),
(2, 'English');

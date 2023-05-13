DROP DATABASE IF EXISTS SpotifyClone;
CREATE DATABASE IF NOT EXISTS SpotifyClone;

CREATE TABLE  SpotifyClone.plano (
  id_plano INT PRIMARY KEY  NOT NULL AUTO_INCREMENT,
  plano VARCHAR(255) NOT NULL,
  valor_plano DECIMAL(6,2) NOT NULL
  ) ENGINE = InnoDB;


CREATE TABLE SpotifyClone.usuario (
  id_pessoa_usuaria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nome_pessoa_usuaria VARCHAR(255) NOT NULL,
  idade INT NOT NULL,
  id_plano INT NOT NULL,
  data_assinatura DATE NOT NULL,
    FOREIGN KEY (id_plano) REFERENCES plano (id_plano)
) ENGINE = InnoDB;


CREATE TABLE SpotifyClone.artista (
  id_artista INT  PRIMARY KEY  NOT NULL AUTO_INCREMENT,
  artista VARCHAR(255) NOT NULL
) ENGINE = InnoDB;


CREATE TABLE SpotifyClone.album (
  id_album INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  album VARCHAR(255) NOT NULL,
  id_artista INT NOT NULL,
  ano_lancamento YEAR NOT NULL,
    FOREIGN KEY (id_artista) REFERENCES artista (id_artista)
 ) ENGINE = InnoDB;


CREATE TABLE SpotifyClone.musicas (
  id_musicas INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  musicas VARCHAR(255) NOT NULL,
  duracao_segundos BIGINT NOT NULL,
  id_album INT NOT NULL,
  id_artista INT NOT NULL,
    FOREIGN KEY (id_artista) REFERENCES SpotifyClone.artista (id_artista),
    FOREIGN KEY (id_album) REFERENCES SpotifyClone.album (id_album)
) ENGINE = InnoDB;


CREATE TABLE SpotifyClone.historico (
  data_reproducao DATETIME NOT NULL,
  id_pessoa_usuaria INT NOT NULL,
  id_musicas INT NOT NULL,
	
    CONSTRAINT PRIMARY KEY (id_musicas, data_reproducao,  id_pessoa_usuaria),
    FOREIGN KEY (id_pessoa_usuaria) REFERENCES usuario (id_pessoa_usuaria),
    FOREIGN KEY (id_musicas) REFERENCES musicas (id_musicas)
) ENGINE = InnoDB;


CREATE TABLE SpotifyClone.seguindo_artista (
  id_pessoa_usuaria INT NOT NULL,
  id_artista INT NOT NULL,
  
  CONSTRAINT PRIMARY KEY ( id_pessoa_usuaria, id_artista),
	FOREIGN KEY (id_pessoa_usuaria) REFERENCES usuario (id_pessoa_usuaria),
	FOREIGN KEY (id_artista) REFERENCES artista (id_artista)
) ENGINE = InnoDB;

INSERT INTO SpotifyClone.plano (plano, valor_plano) VALUES
('gratuito', 0),
('familiar', 7.99),
('universitario', 5.99),
('pessoal', 6.99);

INSERT INTO SpotifyClone.usuario (nome_pessoa_usuaria, idade, id_plano, data_assinatura) VALUES
 ('Barbara Liskov', 82, 1, '2019-10-20'),
 ('Robert Cecil Martin', 58, 1, '2017-01-06'),
 ('Ada Lovelace', 37, 4, '2017-12-30'),
 ('Martin Fowler', 46, 4, '2017-01-17'),
 ('Sandi Metz', 58, 4, '2018-04-29'),
 ('Paulo Freire', 19, 2, '2018-02-14'),
 ('Bell Hooks', 26, 2, '2018-01-05'),
 ('Christopher Alexander', 85, 3, '2019-06-05'),
 ('Judith Butler', 45, 3, '2020-05-13'),
 ('Jorge Amado', 58, 3, '2017-02-17');

 INSERT INTO SpotifyClone.artista (artista) VALUES 
('Beyoncé'),
('Queen'),
('Elis Regina'),
('Baco Exu do Blues'),
('Blind Guardian'),
('Nina Simone');

INSERT INTO SpotifyClone.album (album, id_artista, ano_lancamento) VALUES 
('Renaissance', 1, 2022),
('Jazz', 2, 1978),
('Hot Space', 2, 1982),
('Falso Brilhante', 3, 1998),
('Vento de Maio', 3, 2001),
('QVVJFA?', 4, 2003),
('Somewhere Far Beyond', 5, 2007),
('I Put A Spell On You', 6, 2012);

INSERT INTO SpotifyClone.musicas (musicas, duracao_segundos, id_album, id_artista) VALUES
 ("BREAK MY SOUL", 279, 1, 1),
  ("VIRGO'S GROOVE", 369, 1, 1),
  ("ALIEN SUPERSTAR", 116, 1, 1),
  ("Don't Stop Me Now", 203, 2, 2),
  ("Under Pressure", 152, 3, 2),
  ("Como Nossos Pais", 105, 4, 3),
  ("O Medo de Amar é o Medo de Ser Livre", 207, 5, 3),
  ("Samba em Paris", 267, 6, 4),
  ("The Bard's Song", 244, 7, 5),
  ("Feeling Good", 100, 8, 6);

INSERT INTO SpotifyClone.historico (id_pessoa_usuaria, id_musicas, data_reproducao) VALUES
  (1, 8, '2022-02-28 10:45:55'),
  (1, 2, '2020-05-02 05:30:35'),
  (1, 10, '2020-03-06 11:22:33'),
  (2, 10, '2022-08-05 08:05:17'),
  (2, 7, '2020-01-02 07:40:33'),
  (3, 10, '2020-11-13 16:55:13'),
  (3, 2, '2020-12-05 18:38:30'),
  (4, 8, '2021-08-15 17:10:10'),
  (5, 8, '2022-01-09 01:44:33'),
  (5, 5, '2020-08-06 15:23:43'),
  (6, 7, '2017-01-24 00:31:17'),
  (6, 1, '2017-10-12 12:35:20'),
  (7, 4, '2011-12-15 22:30:49'),
  (8, 4, '2012-03-17 14:56:41'),
  (9, 9, '2022-02-24 21:14:22'),
  (10, 3, '2015-12-13 08:30:22');

  INSERT INTO SpotifyClone.seguindo_artista (id_pessoa_usuaria, id_artista) VALUES 
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 2),
(4, 4),
(5, 5),
(5, 6),
(6, 6),
(6, 1),
(7, 6),
(9, 3),
(10, 2);
SELECT
	a.artista,
    alb.album
		FROM SpotifyClone.album AS alb
        INNER JOIN SpotifyClone.artista AS a
        ON alb.id_artista = a.id_artista
        WHERE a.artista = 'Elis Regina';
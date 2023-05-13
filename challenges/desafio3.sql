SELECT u.nome_pessoa_usuaria AS pessoa_usuaria, 
COUNT(h.id_pessoa_usuaria ) AS musicas_ouvidas,
ROUND(SUM(c.duracao_segundos)/60, 2) AS total_minutos

FROM SpotifyClone.usuario u
INNER JOIN SpotifyClone.historico h
ON u.id_pessoa_usuaria = h.id_pessoa_usuaria

INNER JOIN SpotifyClone.musicas c
ON c.id_musicas = h.id_musicas
GROUP BY u.nome_pessoa_usuaria
ORDER BY u.nome_pessoa_usuaria;

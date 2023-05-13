SELECT
mus.musicas AS cancao,
COUNT(his.id_musicas) AS reproducoes
FROM SpotifyClone.musicas AS mus
INNER JOIN SpotifyClone.historico AS his
ON his.id_musicas = mus.id_musicas
GROUP BY his.id_musicas
ORDER BY reproducoes DESC, mus.musicas LIMIT 2;
SELECT 
  ar.artista AS artista,
  al.album AS album,
  COUNT(sa.id_artista) AS pessoas_seguidoras
FROM SpotifyClone.artista ar
INNER JOIN SpotifyClone.album al
ON ar.id_artista = al.id_artista
INNER JOIN SpotifyClone.seguindo_artista sa
ON al.id_artista = sa.id_artista
GROUP BY artista, album
ORDER BY pessoas_seguidoras DESC, artista, album;
SELECT 
  COUNT(id_musicas) AS cancoes,
  COUNT(distinct id_artista) AS artistas,
  COUNT(distinct id_album) AS albuns
FROM SpotifyClone.musicas;
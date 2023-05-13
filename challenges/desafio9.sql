SELECT COUNT(h.id_pessoa_usuaria) AS musicas_no_historico
FROM SpotifyClone.historico h
INNER JOIN SpotifyClone.usuario u
ON h.id_pessoa_usuaria = u.id_pessoa_usuaria
WHERE u.nome_pessoa_usuaria = 'Barbara Liskov';
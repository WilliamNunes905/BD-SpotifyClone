SELECT 
us.nome_pessoa_usuaria AS pessoa_usuaria,
IF(MAX(YEAR(data_reproducao)) >= 2021, 'Ativa', 'Inativa') AS status_pessoa_usuaria
FROM SpotifyClone.usuario AS us
INNER JOIN SpotifyClone.historico AS his
ON us.id_pessoa_usuaria = his.id_pessoa_usuaria
GROUP BY us.nome_pessoa_usuaria
ORDER BY us.nome_pessoa_usuaria;
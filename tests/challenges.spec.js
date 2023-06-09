const { readFileSync } = require('fs');
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
const expectedResults = require('./expected_results');
const { hasForeignKey, duplicateForeignKey } = require('./assets/utils');

const {
  MYSQL_USER = 'root',
  MYSQL_PASSWORD,
  MYSQL_HOSTNAME = 'localhost',
  MYSQL_PORT = 3306,
} = process.env;

const desafio1Sql = readFileSync(
  path.resolve(__dirname, '../challenges/desafio1.sql'),
  'utf8',
);
const desafio1ParsedJson = JSON.parse(
  readFileSync(path.resolve(__dirname, '../challenges/desafio1.json'), 'utf8'),
);

const desafio10Sql = readFileSync(
  path.resolve(__dirname, '../challenges/desafio10.sql'),
  'utf8',
);
const desafio10ParsedJson = JSON.parse(
  readFileSync(path.resolve(__dirname, '../challenges/desafio10.json'), 'utf8'),
);

describe('Queries de seleção', function () {
  let sequelize;

  const restoreDump = () =>
    sequelize.query(desafio1Sql.concat(' ', desafio10Sql), {
      type: 'raw',
      logging: console.log,
    });

  beforeAll(async function () {
    const connection = await mysql.createConnection({
      host: MYSQL_HOSTNAME,
      password: MYSQL_PASSWORD,
      user: MYSQL_USER,
      port: MYSQL_PORT,
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS SpotifyClone;');

    sequelize = new Sequelize('SpotifyClone', MYSQL_USER, MYSQL_PASSWORD, {
      host: MYSQL_HOSTNAME,
      port: MYSQL_PORT,
      dialect: 'mysql',
      dialectOptions: {
        multipleStatements: true,
      },
    });

    try {
      await restoreDump();
    } catch (error) {
      console.log('Erro ao restaurar o dump!');
      console.log(error);
      process.exit(1);
    }
  });

  afterAll(async function () {
    await sequelize.query('DROP DATABASE SpotifyClone;', { type: 'RAW' });
    await restoreDump();
    sequelize.close();
  });

  describe('01 - Normalize as tabelas para a 3ª Forma Normal', function () {
    describe('Verifica os planos', function () {
      const {
        coluna_plano: planColumn,
        tabela_plano: planTable,
        tabela_pessoas_usuarias: userTable,
      } = desafio1ParsedJson;

      it('A tabela de planos não deve estar contida em outra tabela', function () {
        expect(planTable).not.toBe(userTable);
      });
      
      it('A tabela de planos deve estar corretamente populada', async function () {
        const countQuery = `
        SELECT COUNT(${planColumn}) AS quantidade_planos FROM SpotifyClone.${planTable};
        `;
        const plansCount = await sequelize.query(countQuery, { type: 'SELECT' });
        
        expect(plansCount).toEqual(expectedResults.desafio1.quantidade_planos);
      });

      it('A tabela de planos deve se relacionar com outras tabelas corretamente',
        async function () {
        expect(await hasForeignKey(userTable, planTable, sequelize)).toBeTruthy();
      });
    });

    describe('Verifica o histórico de reprodução', function () {
      const {
        coluna_historico_de_reproducoes: reproductionHistoryColumn,
        tabela_historico_de_reproducoes: reproductionHistoryTable,
        tabela_pessoas_usuarias: userTable,
        tabela_cancoes: songTable,
      } = desafio1ParsedJson;

      it('A tabela de histórico de reprodução não deve estar contida em outra tabela', function () {
        expect(reproductionHistoryTable).not.toBe(userTable);
        expect(reproductionHistoryTable).not.toBe(songTable);
      });

      it('A tabela de histórico de reprodução deve estar corretamente populada', async function () {
        const query = `
        SELECT COUNT(${reproductionHistoryColumn}) AS musicas_escutadas
        FROM SpotifyClone.${reproductionHistoryTable};
        `;
        const reproductionHistoryCount = await sequelize.query(query, {
          type: 'SELECT',
        });
        
        expect(reproductionHistoryCount).toEqual(
          expectedResults.desafio1.musicas_escutadas,
        );
      });

      it('A tabela de histórico de reprodução deve se relacionar com outras tabelas corretamente',
        async function () {
        expect(
          await hasForeignKey(reproductionHistoryTable, songTable, sequelize),
        ).toBeTruthy();
        expect(
          await hasForeignKey(reproductionHistoryTable, userTable, sequelize),
        ).toBeTruthy();
      });

      it('Não deve ser possivel inserir dados duplicados na tabela de histórico de reprodução',
        async function () {
        expect(
          await duplicateForeignKey(reproductionHistoryTable, sequelize),
        ).toBeTruthy();
        await restoreDump();
      });
    });

    describe('Verifica pessoas seguindo artistas', function () {
      const {
        coluna_seguindo_artistas: followedArtistColumn,
        tabela_seguindo_artistas: followingTable,
        tabela_pessoas_usuarias: userTable,
        tabela_artista: artistTable,
      } = desafio1ParsedJson;

      it('A tabela de pessoas seguindo artistas não deve estar contida em outra tabela',
        function () {
        expect(followingTable).not.toBe(userTable);
        expect(followingTable).not.toBe(artistTable);
      });

      it('A tabela de pessoas seguindo artistas deve estar corretamente populada',
        async function () {
        const query = `
        SELECT COUNT(${followedArtistColumn}) AS artistas_seguidos
        FROM SpotifyClone.${followingTable};
        `;
        
        const followedArtistsCount = await sequelize.query(query, {
          type: 'SELECT',
        });
        
        expect(followedArtistsCount).toEqual(
          expectedResults.desafio1.artistas_seguidos,
        );
      });

      it('A tabela de pessoas seguindo artistas deve se relacionar com outras tabelas corretamente',
        async function () {
        expect(
          await hasForeignKey(followingTable, artistTable, sequelize),
        ).toBeTruthy();
        expect(
          await hasForeignKey(followingTable, userTable, sequelize),
        ).toBeTruthy();     
      });

      it('Não deve ser possivel inserir valores duplicados na tabela', async function () {
        expect(
          await duplicateForeignKey(followingTable, sequelize),
        ).toBeTruthy();
        await restoreDump();
      });
    });

    describe('Verifica os álbuns', function () {
      const {
        coluna_album: albumColumn,
        tabela_album: albumTable,
        tabela_artista: artistTable,
      } = desafio1ParsedJson;

      it('A tabela de álbuns não deve estar contida em outra tabela', function () {
        expect(albumTable).not.toBe(artistTable);
      });
    
      it('A tabela de álbuns deve estar corretamente populada', async function () {
        const query = `
        SELECT COUNT(${albumColumn}) AS quantidade_albuns
        FROM SpotifyClone.${albumTable};
        `;
        const albumsCount = await sequelize.query(query, { type: 'SELECT' });
        
        expect(albumsCount).toEqual(expectedResults.desafio1.quantidade_albuns);
      });

      it('A tabela de álbuns deve se relacionar com outras tabelas corretamente',
        async function () {  
        expect(
          await hasForeignKey(albumTable, artistTable, sequelize),
        ).toBeTruthy();
      });
    });

    describe('Verifica as canções', function () {
      const {
        coluna_cancoes: songColumn,
        tabela_cancoes: songTable,
        tabela_album: albumTable,
      } = desafio1ParsedJson;

      it('A tabela de canções não deve estar contida em outra tabela', function () {  
        expect(songTable).not.toBe(albumTable);
      });

      it('A tabela de canções deve estar corretamente populada', async function () {
        const query = `
        SELECT COUNT(${songColumn}) AS quantidade_cancoes 
        FROM SpotifyClone.${songTable};
        `;
        const songsCount = await sequelize.query(query, { type: 'SELECT' });
        
        expect(songsCount).toEqual(expectedResults.desafio1.quantidade_cancoes);
      });

      it('A tabela de canções deve se relacionar com outras tabelas corretamente',
        async function () {  
          expect(
            await hasForeignKey(songTable, albumTable, sequelize),
          ).toBeTruthy();
      });
    });

    describe('Verifica as pessoas usuárias', function () {
      const {
        coluna_pessoas_usuarias: userColumn,
        tabela_pessoas_usuarias: userTable,
      } = desafio1ParsedJson;

      it('A tabela de pessoas usuárias deve estar corretamente populada', async function () {
        const query = `
        SELECT COUNT(${userColumn}) AS quantidade_pessoas_usuarias
        FROM SpotifyClone.${userTable};
        `;
        const usersCount = await sequelize.query(query, { type: 'SELECT' });
        
        expect(usersCount).toEqual(
          expectedResults.desafio1.quantidade_pessoas_usuarias,
        );
      });
    });

    describe('Verifica as pessoas artistas', function () {
      const { coluna_artista: artistColumn, tabela_artista: artistTable } = desafio1ParsedJson;

      it('A tabela de pessoas artistas deve estar corretamente populada', async function () {
        const query = `
        SELECT COUNT(${artistColumn}) AS quantidade_artistas
        FROM SpotifyClone.${artistTable};
        `;
        
        const artistsCount = await sequelize.query(query, { type: 'SELECT' });
        
        expect(artistsCount).toEqual(
          expectedResults.desafio1.quantidade_artistas,
        );
      });
    });
  });

  describe('02 - Exibe as estatísticas musicais', function () {
    it('Verifica o desafio 2', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio2.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio2);
    });
  });

  describe('03 - Exibe o histórico de reprodução para cada pessoa usuária', function () {
    it('Verifica o desafio 3', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio3.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio3);
    });
  });

  describe('04 - Exibe a condição da pessoa usuária se está ativa ou inativa', function () {
    it('Verifica o desafio 4', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio4.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio4);
    });
  });

  describe('05 - Exibe top 2 hits mais tocados no momento', function () {
    it('Verifica o desafio 5', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio5.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio5);
    });
  });

  describe('06 - Exibe o relatório de faturamento da empresa', function () {
    it('Verifica o desafio 6', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio6.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio6);
    });
  });

  describe('07 - Exibe uma relação de todos os álbuns produzidos por cada artista', function () {
    it('Verifica o desafio 7', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio7.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio7);
    });
  });

  describe('08 - Exibe uma relação de álbuns produzidos pela artista Elis Regina', function () {
    it('Verifica o desafio 8', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio8.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio8);
    });
  });

  describe('09 - Exibe a quantidade de músicas no histórico de Barbara Liskov', function () {
    it('Verifica o desafio 9', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio9.sql'),
        'utf8',
      );

      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio9);
    });
  });

  describe('10 - Normalize a tabela de canções favoritas para a 3ª Forma Normal', function () {
    describe('Verifica as canções favoritas', function () {
      const { tabela_pessoas_usuarias: userTable, tabela_cancoes: songTable } = desafio1ParsedJson;
      const {
        coluna_cancoes_favoritas: favoriteSongsColumn,
        tabela_cancoes_favoritas: favoriteSongsTable,
      } = desafio10ParsedJson;

      it('A tabela de canções favoritas não deve estar contida em outra tabela', function () {
        expect(favoriteSongsTable).not.toBe(userTable);
        expect(favoriteSongsTable).not.toBe(songTable);
      });

      it('A tabela de canções favoritas deve estar corretamente populada', async function () {
        const query = `
        SELECT COUNT(${favoriteSongsColumn}) AS cancoes_favoritas
        FROM SpotifyClone.${favoriteSongsTable};
        `;
        const favoriteSongsCount = await sequelize.query(query, {
          type: 'SELECT',
        });

        expect(favoriteSongsCount).toEqual(
          expectedResults.desafio10.cancoes_favoritas,
        );
      });

      it('A tabela de canções favoritas deve se relacionar com outras tabelas corretamente',
        async function () {
        expect(
          await hasForeignKey(favoriteSongsTable, songTable, sequelize),
        ).toBeTruthy();
        expect(
          await hasForeignKey(favoriteSongsTable, userTable, sequelize),
        ).toBeTruthy();
      });
      
      it('Não deve ser possivel inserir valores duplicados na tabela', async function () {
        expect(
          await duplicateForeignKey(favoriteSongsTable, sequelize),
        ).toBeTruthy();
        await restoreDump();
      });
    });
  });

  describe('11 - Exibe o top 3 de álbuns com mais músicas favoritadas', function () {
    it('Verifica o desafio 11', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio11.sql'),
        'utf8',
      );
      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio11);
    });
  });

  describe('12 - Exibe o ranking de pessoas artistas', function () {
    it('Verifica o desafio 12', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio12.sql'),
        'utf8',
      );
      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });

      expect(result).toEqual(expectedResults.desafio12);
    });
  });

  describe('13 - Exibe a relação de pessoas usuárias e favoritadas por faixa etária', function () {
    it('Verifica o desafio 13', async function () {
      const challengeQuery = readFileSync(
        path.resolve(__dirname, '../challenges/desafio13.sql'),
        'utf8',
      );
      const result = await sequelize.query(challengeQuery, { type: 'SELECT' });
      console.log({ result });
      expect(result).toEqual(expectedResults.desafio13);
    });
  });
});

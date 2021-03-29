const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const SqliteDatabase = require('sqlite3').verbose().Database;
const GameModel = require('./models/GameModel');
const UserModel = require('./models/UserModel');
const SessionModel = require('./models/sessionModel')

class Database {

  constructor() {
    console.debug('new Database Object');
    const databasePath = path.join(__dirname, '.', 'db.sqlite');
    this.db = new SqliteDatabase(databasePath);
    this.createTables();
  }


  async createTables() {
    // Create the User table
    await this.db.run('CREATE TABLE IF NOT EXISTS User (name TEXT NOT NULL, password TEXT NOT NULL, UNIQUE(name))', [], (err) => {
      console.log('Created User table');
      if (err) {
        console.error(`Error creating User Table: ${err.message}`);
      }
    });

    await this.db.run('CREATE TABLE IF NOT EXISTS Session ' +
        '(authToken TEXT NOT NULL, ' +
        'userId INTEGER NOT NULL, ' +
        'socketRoom TEXT, ' +
        'FOREIGN KEY(userId) REFERENCES User(rowid), ' +
        'UNIQUE(authToken))',
        [],
        ((err) => {
          console.log('Created Session Table')
          if (err) {
            console.error(`Error creating Session Table: ${err.message}`);
          }
        }));

    // Create the Game table
    await this.db.run('CREATE TABLE IF NOT EXISTS Game ' +
      '(name TEXT NOT NULL, ' +
      'user1Id INTEGER NOT NULL, ' +
      'user2Id INTEGER, ' +
      'currentPlayer INTEGER NOT NULL, ' +
      'gameState TEXT, ' +
      'gameOver INTEGER NOT NULL, ' +
      'draw INTEGER, ' +
      'winner INTEGER, ' +
      'FOREIGN KEY (user1Id, user2Id) REFERENCES User (rowid, rowid))',
      [], (err) => {
        console.log('Created Game table');
        if (err) {
          console.error(`Error creating Game Table: ${err.message}`);
        }
      });
  }


  async getUserById(userId) {
    const query = 'SELECT rowid, * FROM User WHERE rowid = ?';
    return new Promise((resolve, reject) => {
      this.db.get(query, [userId], (err, row) => {
        if (err || row === undefined) {
          reject(new Error(`Failed fetching user with id: ${userId}`));
        } else {
          resolve(new UserModel(row.rowid, row.name, row.password));
        }
      });
    });
  }

  async getUserByName(username) {
    const query = 'SELECT rowid, * FROM User WHERE name = ?';
    return new Promise((resolve, reject) => {
      this.db.get(query, [username], (err, row) => {
        if (err || row === undefined) {
          reject(new Error(`Failed fetching user with name: ${username}`));
        } else {
          resolve(new UserModel(row.rowid, row.name, row.password));
        }
      });
    });
  }

  async addUser(name, password) {
    const query = 'INSERT INTO User VALUES (?, ?)';

    return new Promise((resolve, reject) => {
      this.db.run(query, [name, password], (err) => {
        if (err) {
          reject(new Error(`Error inserting new User: ${err.message}`));
        } else {
          resolve('OK');
        }
      });
    });
  }


  async addGame(userId, lobbyName) {
    const query = 'INSERT INTO Game (name, user1Id, user2Id, gameOver, draw, winner) VALUES (?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
      const rowAdded = function ra(err) {
        if (err) {
          reject(new Error(`Error inserting new Game: ${err.message}`));
        } else {
          const lastId = this.lastID;
          resolve({
            status: 'OK',
            rowid: lastId,
          });
        }
      };
      this.db.run(query, [lobbyName, userId, null, 0, 0, null], rowAdded);
    });

  }

  async joinGame(gameId, userId) {
    //TODO Check if the game already has two players?
    const query = 'UPDATE Game set user2Id = ? WHERE rowid = ? and user2Id is null';
    return new Promise((resolve, reject) => {
      this.db.run(query, [userId, gameId], (err) => {
        if (err) {
          console.log(`Failed to join game with id: ${gameId} for player with id: ${userId}, err: ${err.message}`);
          reject(new Error(`Failed to join game with id: ${gameId} for player with id: ${userId}`));
        } else {
          resolve({status: 'OK'});
        }
      });
    })
  }

  async getGameById(gameId) {
    const query = `SELECT g.ROWID as gameId, name, (select name from User where User.ROWID = user1Id) as user1Name, 
       (select name from User where user2Id) as user2Name, user1Id,
       user2Id,
       currentPlayer,
       gameState,
       gameOver,
       draw,
       winner,
       name
       FROM Game g
       where gameId = ?`
    return new Promise((resolve, reject) => {
      this.db.get(query, [gameId], (err, row) => {
        if (err || row === undefined) {
          reject(new Error(`Failed fetching game with id: ${gameId}`));
        } else {
          resolve(new GameModel(
            row.gameId,
            row.name,
            { userName: row.user1Name, userId: row.user1Id },
            { userName: row.user2Name, userId: row.user2Id },
            row.currentPlayer,
            row.gameState,
            row.gameOver,
            row.draw,
            row.winner
          ))
          ;
        }
      });
    });
  }

  //Returns all the games that a user can join(Only one connected player)
  async getJoinableGames(id) {
    const query = 'SELECT Game.rowid as gameId, ' +
      'Game.name as gameName, ' +
      'User.name as opponentName, * FROM Game ' +
      'INNER JOIN User on Game.user1Id = User.rowid WHERE Game.user2Id is NULL AND Game.user1Id != ?';
    const games = [];

    return new Promise((resolve, reject) => {
      this.db.all(query, [id], (err, rows) => {
        if (err) {
          console.error(err);
          reject(new Error('Error fetching joinable games from database'));
        } else {
          console.log('Has fetched joinable Games');
          rows.forEach((row) => {
            games.push(new GameModel(
              row.gameId,
              row.gameName,
              { userId: row.user1Id, userName: row.opponentName },
              { userId: row.user2Id, userName: row.user2Name },
              row.currentPlayer,
              row.gameState,
              row.gameOver,
              row.draw,
              row.winner
            ));
          });
          resolve(games);
        }
      });
    });
  }

  async getActiveGamesForUser(userId) {
    const query = 'SELECT ' +
      'game.rowid as gameId, ' +
      'game.name as gameName, ' +
      'user1.name as user1Name, ' +
      'user2.name as user2Name, ' +
      '* FROM Game as game ' +
      'LEFT JOIN User as user1 on game.user1Id = user1.rowid ' +
      'LEFT JOIN User as user2 on game.user2Id = user2.rowid ' +
      'WHERE ' +
      'game.user1Id = ? ' +
      'or ' +
      'game.user2Id = ? ' +
      'AND ' +
      'game.gameOver = 0';
    const games = [];

    return new Promise((resolve, reject) => {
      this.db.all(query, [userId, userId], (err, rows) => {
        if (err) {
          console.error(err);
          reject(new Error('Error fetching active games from database'));
        } else {
          console.log('Has fetched active Games');
          rows.forEach((row) => {
            games.push(new GameModel(row.gameId,
              row.gameName,
              {id: row.user1Id, name: row.user1Name},
              {id: row.user2Id, name: row.user2Name},
              row.currentPlayer,
              row.gameState,
              row.gameOver,
              row.draw,
              row.winner
            ));
          });
          resolve(games);
        }
      });
    });
  }


  async userGaveUp(gameId, winner) {
    const query = 'UPDATE GAME SET gameOver = ?, winner = ? WHERE ROWID = ?';
    return new Promise((resolve, reject) => {
      this.db.run(query, [1, winner.userId, gameId], (err) => {
        if (err) {
          reject(new Error(`Failed fetching game with id: ${gameId}`));
        } else {
          console.log('updated winner of match');
          resolve();
        }
      });
    });
  }

  async getActiveGameById(gameId) {
    const query = 'SELECT ' +
      'game.rowid as gameId, ' +
      'game.name as gameName, ' +
      'user1.name as user1Name, ' +
      'user2.name as user2Name, ' +
      '* FROM Game as game ' +
      'LEFT JOIN User as user1 on game.user1Id = user1.rowid ' +
      'LEFT JOIN User as user2 on game.user2Id = user2.rowid ' +
      'WHERE ' +
      'gameId = ? ';

    return new Promise((resolve, reject) => {
      this.db.get(query, [gameId], (err, row) => {
        if (err || row === undefined) {
          console.error(err);
          reject(new Error('Error fetching active game by id from database'));
        } else {
          console.log(`Has fetched active game with id: ${gameId}`);

          resolve(new GameModel(row.gameId,
            row.gameName,
            {id: row.user1Id, name: row.user1Name},
            {id: row.user2Id, name: row.user2Name},
            row.currentPlayer,
            row.gameState,
            row.gameOver,
            row.draw,
            row.winner
          ));
        }
      });
    });
  }


  async getGameHistoryForUser(userId) {
    const query = 'SELECT rowid, * FROM Game ' +
      'WHERE ' +
      'user1Id = ? ' +
      'or ' +
      'user2Id = ? ' +
      'AND ' +
      'gameOver = 1';
    const games = [userId, userId];

    return new Promise((resolve, reject) => {
      this.db.all(query, [], (err, rows) => {
        if (err) {
          console.error(err);
          reject(new Error('Error fetching active games from database'));
        } else {
          console.log('Has fetched active Games');
          rows.forEach((row) => {
            games.push(new GameModel(row.rowid,
              row.name,
              row.user1Id,
              row.user2Id,
              row.currentPlayer,
              row.gameState,
              row.gameOver,
              row.draw,
              row.winner
            ));
          });
          resolve(games);
        }
      });
    });
  }

  async updateGame(gameId, fen) {
    const query = `UPDATE GAME
                    SET gameState = ?
                    WHERE
                        ROWID = ?`
    return new Promise((resolve, reject) => {
      this.db.run(query, [fen, gameId], (err) => {
        if (err) {
          reject(new Error(`Failed fetching game with id: ${gameId}`));
        } else {
          console.log('updated gamestate')
          resolve();
        }
      });
    });
  }


  async getSessions() {
    const query = 'SELECT * FROM Session INNER JOIN User on User.rowid = Session.userId';

    let sessions = [];

    return new Promise((resolve, reject) => {
      this.db.all(query, [], (err, rows) => {
        if (err) {
          console.error(err);
          reject(new Error('Error fetching sessions from database'));
        } else {
          console.log('Has fetched sessions');
          rows.forEach((row) => {
            sessions.push(new SessionModel(row.authToken,
                new UserModel(row.userId, row.name, null),
                row.socketRoom));
          });
          resolve(sessions);
        }
      });
    });
  }

  async addSession(authToken, userId) {
    const query = 'INSERT INTO Session VALUES (?, ?, ?)';

    return new Promise((resolve, reject) => {
      this.db.run(query, [authToken, userId, null], (err) => {
        if (err) {
          reject(new Error(`Error inserting new Session: ${err.message}`));
        } else {
          resolve('OK');
        }
      });
    });
  }

  async updateSessionSocketRoom(authToken, socketRoom) {
    const query = 'UPDATE Session set socketRoom = ? WHERE authToken = ?';

    return new Promise((resolve, reject) => {
      this.db.run(query, [socketRoom, authToken], (err) => {
        if (err) {
          reject(new Error(`Error updating socketRoom: ${err.message}`));
        } else {
          resolve('OK');
        }
      });
    });
  }

  async removeSession(authToken) {
    const query = 'DELETE FROM Session WHERE authToken = ?';

    return new Promise((resolve, reject) => {
      this.db.run(query, [authToken], (err) => {
        if (err) {
          reject(new Error(`Error removing Session: ${err.message}`));
        } else {
          resolve('OK');
        }
      });
    });

  }


}


module.exports = new Database();

const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const SqliteDatabase = require('sqlite3').verbose().Database;
const Game = require('./models/Game');
const User = require('./models/User');

class Database {

    constructor() {
        console.debug('new Database Object');
        const databasePath = path.join(__dirname, '../server', 'db.sqlite');
        this.db = new SqliteDatabase(databasePath);
        this.createTables();
    }


    async createTables() {
        // Create the User table
        await this.db.run('CREATE TABLE IF NOT EXISTS User (name TEXT NOT NULL, password TEXT NOT NULL)', [], (err) => {
            console.log('Created User table');
            if (err) {
                console.error(err.message);
            }
        });

        // Create the Game table
        await this.db.run('CREATE TABLE IF NOT EXISTS Game ' +
            '(user1Id INTEGER NOT NULL, ' +
            'user2Id INTEGER, ' +
            'currentPlayer INTEGER NOT NULL, ' +
            'gameState TEXT, ' +
            'gameOver INTEGER NOT NULL, ' +
            'draw INTEGER, ' +
            'winner INTEGER, ' +
            'FOREIGN KEY (user1Id, user2Id) REFERENCES User (rowid))',
            [], (err) => {
            console.log('Created Game table');
            if (err) {
                console.error(err.message);
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
                    resolve(new User(row.rowid, row.name, row.password));
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


    async addGame(userId) {
        const query = 'INSERT INTO Game VALUES (?, ?, ?, ?, ?, ?, ?)';

        return new Promise((resolve, reject) => {
            const rowAdded = function ra(err) {
                if (err) {
                    reject(new Error(`Error inserting new Time Slot: ${err.message}`));
                } else {
                    const lastId = this.lastID;
                    console.log(`Last ID: ${lastId}`);
                    resolve({
                        status: 'OK',
                        rowid: lastId,
                    });
                }
            };
            this.db.run(query, [userId, null, 0, '', 0, 0, null], rowAdded);
        });

    }


    //Returns all the games that a user can join(Only one connected player)
    async getJoinableGames() {
        const query = 'SELECT rowid, * FROM Game WHERE user1Id = NULL or user2Id = NULL';
        const games = [];

        return new Promise((resolve, reject) => {
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    console.error(err);
                    reject(new Error('Error fetching joinable games from database'));
                } else {
                    rows.forEach((row) => {
                        games.push(new Game(row.rowid,
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








}


module.exports = new Database();

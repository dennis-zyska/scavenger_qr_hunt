'use strict';
const express = require('express');

const {Server: WebSocketServer} = require("socket.io");

const http = require('http');
const cors = require('cors');
const {Database, aql} = require("arangojs");
const path = require("path");
const {
    checkAnswer,
    generateRandomString,
    randomAssign,
    randomizeAndRepeatIndices
} = require(path.resolve(__dirname, "./utils.js"));


/**
 * Webserver
 *
 * @author Dennis Zyska
 * @type {Server}
 */
module.exports = class Server {
    constructor(db_url) {
        this.app = express();
        this.db = new Database({url: db_url});

        this.app.use(express.static(`${__dirname}/dist/`));
        // all further urls reference to frontend
        this.app.use("/*", express.static(`${__dirname}/dist/index.html`));
        this.app.use(cors({
            origin: ['*', // allow all origins
            ], credentials: true
        }));
        this.httpServer = http.createServer(this.app);
        this.connectedSockets = 0;
        this.io = new WebSocketServer(this.httpServer, {
            cors: {
                origin: "*"
            }
        });
        this.io.on('connection', (socket) => {
            this.connectedSockets++;
            const sendGame = async () => {
                // send game to the client
                if (socket.data.entered) {
                    await sendPlayers();
                    await sendTeams();
                } else {
                    const settings = await getSettings();
                    if (settings) {
                        if (!('game_code' in settings) || settings.game_code === '') {
                            socket.data.entered = true;
                            await updateSession({entered: true});
                            await sendGame();
                            return;
                        } else {
                            socket.emit('settings', {visitorLocale: settings.visitorLocale, locale: settings.locale});
                            socket.emit('visitor', true);
                            return;
                        }
                    } else {
                        socket.emit("settings", null);
                    }
                }
                await sendSettings();
                await sendSpots();
                await sendSession();
                await sendCurrentOnline();
            }

            const enterGame = async (game_code) => {
                // enter game
                const settings = await getSettings();
                if (settings.game_code === game_code) {
                    socket.data.entered = true;
                    socket.emit('visitor', false);
                    await updateSession({entered: true});
                    await sendGame();
                } else {
                    socket.emit('error', 'Game code is not correct');
                }
            }

            const getPlayers = async () => {
                // get all users to the client
                const allPlayers = await this.db.query(aql`
                          FOR doc IN players
                          RETURN doc
                        `);
                return await allPlayers.all();
            }
            const sendPlayers = async () => {
                // send all users to the client
                this.io.emit('players', await getPlayers());
            }

            const getSpots = async () => {
                // get all users to the client
                const allSpots = await this.db.query(aql`
                          FOR doc IN spots
                          RETURN doc
                        `);
                return await allSpots.all();
            }
            const sendSpots = async () => {
                // send all users to the client
                socket.emit('spots', await getSpots());
            }

            const getTeams = async () => {
                // get all users to the client
                const allTeams = await this.db.query(aql`
                          FOR doc IN teams
                          RETURN doc
                        `);
                return await allTeams.all();
            }
            const getTeam = async (teamCode) => {
                const team = await this.db.query(aql`
                            FOR team IN teams
                            FILTER team.code == ${teamCode}
                            RETURN team
                        `);
                if (team.hasNext) {
                    return await team.next();
                } else {
                    return null;
                }
            }
            const sendTeams = async () => {
                // send all users to the client
                this.io.emit('teams', await getTeams());
            }

            const getQuests = async () => {
                // get all users to the client
                const allQuests = await this.db.query(aql`
                          FOR doc IN questions
                          RETURN doc
                        `);
                return await allQuests.all();
            }

            const sendQuests = async () => {
                // send all users to the client
                socket.emit('quests', await getQuests());
            }

            const getStats = async () => {
                // get all users to the client
                const allStats = await this.db.query(aql`
                          FOR doc IN stats
                          RETURN doc
                        `);
                return await allStats.all();
            }

            const addStats = async (stats) => {
                const statsCollection = this.db.collection('stats');
                const newStats = await statsCollection.save(stats);
                // send to room stats
                this.io.to("stats").emit('addStats', await statsCollection.document(newStats._key));
            }

            const sendStats = async () => {
                // send all users to the client
                socket.emit('allStats', await getStats());
            }

            const getSettings = async () => {
                const settings = await this.db.query(aql`
                          FOR settings IN settings
                          SORT settings.created DESC
                          LIMIT 1
                          RETURN settings
                        `);
                if (settings.hasNext) {
                    return await settings.next();
                } else {
                    return null;
                }
            }
            const sendSettings = async () => {
                const settings = await getSettings();
                if (settings) {
                    delete settings.seed;
                    if (!socket.data.entered) {
                        delete settings.game_code;
                    }
                    const tasks = this.db.collection('tasks');
                    // get length of tasks
                    const all = await tasks.count();
                    settings.num_tasks = all.count;

                    this.io.emit('settings', settings);
                } else {
                    this.io.emit('settings', null);
                }
            }
            const updateSettings = async (data) => {
                const current_settings = await getSettings();
                if (current_settings) {
                    const settings = this.db.collection('settings');
                    await settings.update(current_settings, data);
                    await sendSettings();
                }
            }

            const createSession = async (admin = false) => {
                const sessions = this.db.collection('sessions');
                let current_session = {
                    session_key: generateRandomString(10),
                    created: new Date(),
                    last_saved: new Date(),
                    admin: admin,
                    entered: socket.data.entered,
                    disconnected: false,
                }
                await sessions.save(current_session);
                const session = await getSession(current_session.session_key)
                socket.data.db_session_key = session._key;
                socket.data.session = current_session.session_key;
                await sendSession();
                return current_session.session_key;
            }
            const updateSession = async (data) => {
                if (!socket.data.db_session_key) {
                    await createSession();
                }
                const session = await getSession(socket.data.session);
                if (session) {
                    const sessions = this.db.collection('sessions');
                    await sessions.update(session._key, Object.assign(data, {last_saved: new Date()}));
                    await sendGame();
                }
            }
            const getSession = async (session_key) => {
                const sessions = await this.db.query(aql`
                          FOR doc IN sessions
                          FILTER doc.session_key == ${session_key}
                          RETURN doc
                        `);
                if (sessions.hasNext) {
                    return await sessions.next();
                } else {
                    return null;
                }
            }
            const sendSession = async () => {
                const session = await getSession(socket.data.session);
                if (session) {
                    socket.emit('session', session);
                }
            }
            const sendCurrentOnline = async () => {
                this.io.emit('online', this.connectedSockets);
            }

            // SOCKETS --------------------------------------
            socket.on('load', async (data) => {
                try {
                    if (data.session) {
                        const session = await getSession(data.session);
                        if (session) {
                            socket.data.db_session_key = session._key;
                            socket.data.session = session.session_key;
                            if (session.entered) {
                                socket.data.entered = true;
                            }
                            if (session.admin) {
                                socket.emit('admin', {without_redirect: true});
                                socket.data.admin = true;
                            }
                            await updateSession({
                                last_reload: new Date(), loads_count: session.loads_count + 1, disconnected: false,
                            });
                        } else {
                            socket.emit('reset', true);
                            await createSession();
                        }
                    } else {
                        await createSession();
                    }

                    if (data.game_code) {
                        await enterGame(data.game_code);
                    }
                    await sendGame();

                    console.log("Loaded client: " + socket.data.session)
                } catch (e) {
                    console.log("Error loading: ", e);
                }
            })
            socket.on('login', async (data) => {
                try {
                    if (data === process.env.ADMIN_PASS) {
                        socket.emit('success', {code: 201});
                        socket.emit('admin', true);
                        socket.data.admin = true;
                        await updateSession({admin: true});
                    } else {
                        socket.emit('error', {code: 401});
                    }
                } catch (e) {
                    console.log("Error log in: ", e);
                }
            })
            socket.on('disconnect', async () => {
                try {
                    this.connectedSockets--;
                    await updateSession({disconnected: true})
                    await sendCurrentOnline();
                } catch (e) {
                    console.log("Error disconnecting");
                }
            });

            // Socket Getters
            socket.on('get_teams', async () => {
                await sendTeams();
            });
            socket.on('get_players', async () => {
                await sendPlayers();
            });

            // Game
            socket.on('setup', async (data) => {
                try {

                    // Truncate collections
                    await Promise.all(['players', 'spots', 'questions', 'tasks', 'teams', 'sessions']
                        .map(async (c) => {
                            this.db.collection(c).truncate();
                        }));

                    // Load collections
                    const collection = this.db.collection('settings');
                    const spots = this.db.collection('spots');
                    const questions = this.db.collection('questions');
                    const tasks = this.db.collection('tasks');

                    // Extract data
                    await Promise.all(data.spots.map(async (spot) => {
                        await spots.save(spot);
                    }));
                    delete data.spots;

                    // Import quests
                    const quests = require('../quests.json');
                    await Promise.all(quests.questions.map(async (q) => {
                        await questions.save(q);
                    }));
                    await Promise.all(quests.tasks.map(async (t) => {
                        await tasks.save(t);
                    }));

                    await collection.save({...data, created: new Date()});
                    socket.emit('success', {code: 202});
                    socket.emit('setup_done', true);
                } catch (e) {
                    console.log("Error setup: ", e);
                }
            });
            socket.on('enter', async (data) => {
                try {
                    await enterGame(data);
                } catch (e) {
                    console.log("Error entering: ", e);
                }
            });
            socket.on("joinTeam", async (teamCode) => {
                try {
                    const team = await getTeam(teamCode);
                    if (team) {
                        await updateSession({team: team._key});
                        socket.emit('success', {code: 203});
                        const settings = await getSettings();
                        await enterGame(settings.game_code);
                        await sendGame();
                    } else {
                        socket.emit('error', {code: 402});
                    }
                } catch (e) {
                    console.log("Error joining team: ", e);
                }
            });
            socket.on('getQuest', async (questKey) => {
                try {
                    const quests = this.db.collection('questions');
                    const session = await getSession(socket.data.session);
                    const quest = await quests.document(questKey);
                    const teams = this.db.collection('teams');
                    const team = await teams.document(session.team);

                    if (quest && quest.teams.includes(session.team)) {
                        if ('quests_correct' in team && team.quests_correct.includes(quest._key)) {
                            socket.emit('error', {code: 403});
                            socket.emit('questError', null);
                            return;
                        }
                        delete quest.answers;
                        socket.emit('questData', quest);
                    } else {
                        socket.emit('error', {code: 404});
                    }

                } catch (e) {
                    console.log("Error getting quest: ", e);
                }
            });
            socket.on('spotFound', async (spotKey) => {
                try {
                    await addStats({
                        type: 'spotScan',
                        spot: spotKey,
                        time: Date.now(),
                        session: socket.data.db_session_key
                    })
                } catch (e) {
                    console.log("Error spot found: ", e);
                }
            });
            socket.on('startQuest', async (spotKey) => {
                    try {
                        const spots = this.db.collection('spots');
                        const spot = await spots.document(spotKey);
                        if (spot) {
                            const session = await getSession(socket.data.session);
                            const teams = this.db.collection('teams');
                            const questions = this.db.collection('questions');
                            const teamData = await teams.document(session.team);

                            // Get question - check first if question already exists for spot
                            let question = null;
                            if ('teams' in spot && spot.teams.includes(teamData._key)) {
                                // Get question from spot
                                question = await questions.document(spot.question[teamData._key]);
                            } else {
                                // Get random question
                                let remainingQuestions = await this.db.query(aql`
                                  FOR doc IN questions
                                  FILTER !HAS(doc, "teams") OR ${teamData._key} NOT IN doc.teams
                                  SORT RAND()
                                  LIMIT 1
                                  RETURN doc
                                `);
                                if (remainingQuestions.hasNext) {
                                    question = await remainingQuestions.next();
                                    // Update data points
                                    const stats = {
                                        time: Date.now(), team: session.team,
                                    }
                                    await spots.update(spotKey, {
                                        stats: ('stats' in spot) ? [...spot.stats, stats] : [stats],
                                        teams: ('teams' in spot) ? [...spot.teams, teamData._key] : [teamData._key],
                                        question: ('question' in spot) ? {
                                            ...spot.question,
                                            [teamData._key]: question._key
                                        } : {[teamData._key]: question._key}
                                    });
                                    await questions.update(question._key, {teams: ('teams' in question) ? [...question.teams, teamData._key] : [teamData._key]})
                                    await teams.update(session.team, {
                                        questions: ('questions' in teamData) ? [...teamData.questions, question._key] : [question._key],
                                        spots: ('spots' in teamData) ? [...teamData.spots, spot._key] : [spot._key]
                                    });


                                } else {
                                    // No more quests, but we want to give points!
                                    const stats = {
                                        time: Date.now(), team: session.team,
                                    }
                                    await spots.update(spotKey, {
                                        stats: ('stats' in spot) ? [...spot.stats, stats] : [stats],
                                        teams: ('teams' in spot) ? [...spot.teams, teamData._key] : [teamData._key],
                                    });
                                    await teams.update(session.team, {
                                        spots: ('spots' in teamData) ? [...teamData.spots, spot._key] : [spot._key]
                                    });
                                }
                                await addStats({
                                    type: 'startQuest',
                                    spot: spotKey,
                                    team: session.team,
                                    time: Date.now(),
                                    session: socket.data.db_session_key
                                })
                            }

                            // send question
                            if (question) {
                                socket.emit('quest', question._key);
                            } else {
                                socket.emit('quest', false);
                            }

                            await sendTeams();

                        } else {
                            socket.emit('error', {code: 405});
                        }

                    } catch
                        (e) {
                        console.log("Error starting quest: ", e);
                    }
                }
            )
            ;
            socket.on('join', async (data) => {
                try {
                    if (data.name === "") {
                        socket.emit('error', {code: 406});
                        return;
                    }
                    // check if user already exists
                    const cursor = await this.db.query(aql`
                          FOR doc IN players
                          FILTER doc.name == ${data.name}
                          LIMIT 1
                          RETURN doc
                        `);
                    if (cursor.hasNext) {
                        socket.emit('error', {code: 407});
                    } else {
                        // insert user into database
                        const players = this.db.collection('players');

                        await players.save({
                            name: data.name, joined: new Date(), session: socket.data.db_session_key
                        });
                        socket.emit('success', {code: 200, userName: data.name});
                        await sendPlayers();
                    }
                } catch (e) {
                    console.log("Error Join: ", e);
                }
            });
            socket.on('remove', async (data) => {
                try {
                    const cursor = await this.db.query(aql`
                      RETURN LENGTH(
                        FOR doc IN players
                        FILTER doc.name == ${data.name}
                        REMOVE doc IN players
                        RETURN 1
                      )
                    `);
                    const deleted = await cursor.next();
                    if (deleted > 0) {
                        socket.emit('success', {code: 204, userName: data.name});
                        await sendPlayers();
                    } else {
                        socket.emit('error', {code: 408});
                    }
                } catch (e) {
                    console.log("Error Remove: ", e);
                }
            });
            socket.on('assign_teams', async (data) => {
                try {
                    if (socket.data.admin) {
                        const players = this.db.collection('players');
                        const teams = this.db.collection('teams');
                        const sessions = this.db.collection('sessions');
                        const tasks = this.db.collection('tasks');

                        teams.truncate();

                        const all_tasks = await tasks.all();
                        const all_tasks_data = await all_tasks.all();

                        const taskIndices = randomizeAndRepeatIndices(all_tasks_data, data['teams'])


                        const assignment = randomAssign(await getPlayers(), data['teams']);
                        assignment.map(async (teamMembers, index) => {
                            const new_team = await teams.save({
                                name: "Team " + (index + 1),
                                players: teamMembers.map(p => p._key),
                                task: all_tasks_data[taskIndices[index]]._key,
                                taskDescription: Object.fromEntries(Object.entries(all_tasks_data[taskIndices[index]]).filter(([k]) => ["topic", "description", "baseline"].includes(k))),
                                code: generateRandomString(4),
                                powerups: [],
                            });

                            await teamMembers.map(async (player) => {
                                players.update(player, {team: new_team._key});
                                sessions.update(player.session, {team: new_team._key});
                            });

                        });
                        await sendPlayers();
                        await sendTeams();
                        await updateSettings({assigned: true, game: data, started: new Date()});
                        await sendGame();
                        socket.emit("assigned");
                        socket.emit("success", {code: 205})
                    } else {
                        socket.emit("error", {code: 409});
                    }
                } catch (e) {
                    console.log("Error Assign: ", e);
                }
            });
            socket.on('solution', async (data) => {
                try {
                    // Check team has quest
                    const session = await getSession(socket.data.session);
                    const teams = this.db.collection('teams');
                    const tasks = this.db.collection('tasks');
                    const team = await teams.document(session.team);

                    if (team.questions.includes(data.quest)) {

                        // Check if team already answered this question
                        if ('quests_correct' in team && team.quests_correct.includes(data.quest)) {
                            socket.emit('error', {code: 403});
                            return;
                        }

                        const questions = this.db.collection('questions');
                        const question = await questions.document(data.quest);

                        const answerCorrect = checkAnswer(data.answer, question.answers);

                        if (answerCorrect) {
                            const task = await tasks.document(team.task);
                            const openPowerups = task.powerups.filter(item => !team.powerups.includes(item));
                            const randomPowerup = openPowerups[Math.floor(Math.random() * openPowerups.length)];
                            if (randomPowerup) {
                                await teams.update(team._key, {
                                    quests_correct: ('quests_correct' in team) ? [...team.quests_correct, data.quest] : [data.quest],
                                    powerups: ('powerups' in team) ? [...team.powerups, randomPowerup] : [randomPowerup]
                                });
                            } else {
                                await teams.update(team._key, {
                                    quests_correct: ('quests_correct' in team) ? [...team.quests_correct, data.quest] : [data.quest]
                                });
                            }
                            socket.emit('questSuccess', randomPowerup);
                            await sendTeams();
                            await addStats({
                                type: 'quest_success',
                                quest: data.quest,
                                answer: data.answer,
                                team: team._key,
                                time: Date.now(),
                                session: socket.data.db_session_key
                            });
                        } else {
                            socket.emit('error', {code: 410});
                            await teams.update(team._key, {
                                quests_incorrect: ('quests_incorrect' in team) ? [...team.quests_incorrect, data.quest] : [data.quest]
                            });
                            await addStats({
                                type: 'quest_error',
                                quest: data.quest,
                                question: question.question,
                                teamName: team.name,
                                answer: data.answer,
                                team: team._key,
                                time: Date.now(),
                                session: socket.data.db_session_key
                            });
                        }

                        const stats = {
                            team: team._key,
                            time: new Date(),
                            answer: data.answer,
                            correct: answerCorrect
                        };
                        questions.update(question._key, {stats: ('stats' in question) ? [...question.stats, stats] : [stats]});

                    }
                } catch (e) {
                    console.log("Error Solution: ", e);
                }
            });
            socket.on('aboStats', async (data) => {
                try {
                    // check if admin
                    if (socket.data.admin && data) {
                        socket.join('stats');
                        await sendStats();
                        await sendQuests();
                    } else {
                        socket.leave('stats');
                    }
                } catch (e) {
                    console.log("Error AboStats: ", e);
                }
            });

        });
        this.init(process.env.DB_NAME).then(() => {
            console.log("Init done")
        });
    }

    async init(database_name = "scavenger") {
        await this.db.listDatabases()
            .then((names) => {
                if (names.indexOf(database_name) > -1) {
                    this.db = this.db.database(database_name);
                    this.db.get().then(() => console.log("Using database " + database_name), error => console.error("Error connecting to database: " + error));
                } else {
                    this.db.createDatabase(database_name).then(() => {
                        console.log("Database created successfully: " + database_name)
                        this.db = this.db.database(database_name);
                    }, error => console.error("Error creating database: " + error));
                }
            });
        await Promise.all(['settings', 'spots', 'teams', 'players', 'sessions', 'questions', 'stats', 'tasks'].map(async (collection) => {

            try {
                await this.db.collection(collection).create();
            } catch (err) {
                console.log("Collection already exists");
            }
        }));
    }

    /**
     * Start the webserver
     * @param port
     */
    start(port) {
        console.log("Start Webserver...");
        this.http = this.httpServer.listen(port, () => {
            console.log("Server started: http://localhost:" + port);
        });
        return this.http;
    }


}

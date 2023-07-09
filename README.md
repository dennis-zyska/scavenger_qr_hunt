# Scavenger QR Hunt - Outdoor Teambuilding

Have you always wanted to organise a very special event for your team?

With the Scavenger QR Hunt, this is possible. Your teams will be sent on a scavenger hunt to find and scan QR spots
at your location. Your teams only needs a smartphone (no app installation is required). 

A specially adapted web application gives you an overview of what is happening during the game. You will find some
screenshots in the folder `screenshots` to get an idea.

### Quickstart

```sh
git clone <github-url> scavenger-qr-hunt
cd scavenger-qr-hunt
npm run docker #or
docker-compose build && docker-compose up
```

You can open the app at http://localhost:8050 by default. Follow the setup for a quick start.

To adapt the game to your needs follow the [Configuration](#configuration) section.

## The game

### What is it about?

The idea is to have a QR code based scavenger hunt where players are grouped into teams to scan QR codes placed in
different locations around an area. After scanning the QR codes, each team answers questions (quests) to collect
additional points.

Each team is also assigned a theme (defined in quests.json). If a team answers a question correctly, they are randomly
assigned a powerup related to their theme. The aim is that each team give a short presentation at the end of the game
using the additional power-ups collected. This should strengthen the team cohesion and the team spirit.

### How does it work?

For your scavenger hunt you need some spots in your area. Make sure the spots are not too far apart, such that the
participants can reach them on foot. The spots should be added to a [Google map](https://www.google.com/maps/d/?hl=de),
where you can export them as csv file.

For each spot an individual QR-Code is generated, which can be printed out and placed at the spot.
(See Admin Area for printing the spots)
An implemented map makes it possible to follow the route of the individual teams during the game to adapt spots to
future events.

Once a QR code has been scanned, the team has the option to open a quest where a question is randomly presented to the
team from a predefined list (quest.json). If the question is answered correctly, the team is assigned a power-up related
to their theme.

Note: The QR codes are based on the URL, the seed during installation and the name of the spot!
Make sure you are printing the spots only if you are sure that these parameters are not changing anymore!

Example Spots for the area
at [Georg-Christoph-Lichtenberg-Haus, Darmstadt](https://www.google.com/maps/d/edit?mid=1fWogq61d_NHjyYpqkpyDRx1trupYFC0&usp=sharing)

### How to play?

At the start of the game, all players should scan the initial QR code with their smartphones to join the game. Players
can also join directly via the URL "/join", but need the game code. The game code ensures that no other players will
join when scanning an already placed QR code.

__Tip:__ If logged in as admin, individual players can be removed after joining. To do this, press the trash bin once (
until red) and double-click on the respective player.

After all players joined the game (tip: ask twice!), the admin can start the game and assign the teams randomly. The
smartphones should automatically associate with the team (via a cookie). If this is not the case, players can join the
team by scanning the team QR code in the admin area or from another device of a correctly associated team member.

The teams can start scanning the QR codes now. The teams are hunting points by scanning QR codes, as well as answering
the quests. Thereby, only one member of each team have to scan each QR code.

__Note:__ The app won't display the admin login and join QR code on lower resolution smartphones. Make sure your browser
resolution is high enough for the game start (normally a beamer should be used).

## Features

- Game Code \
  Players can only join the game with the game code (e.g. to prevent outsiders from joining when finding a spot)
- Localization \
  The app is available in English and German. You can add more languages in the src/i18n folder. A different language
  for visitors can be set during setup, allowing playing games with international participants.
- Teams \
  Each team is assigned a theme (e.g. large language models) and get powerups related to their theme when answering a
  question correctly. The number of players per team can be adjusting during random assignment of the players to allow a
  flexible adaption on the event day.
- Quests \
  Define your own questions and answers in the quests.json file.
- Time Limit \
  The game can be limited to a certain time.
- Device Mapping \
  The app automatically associates the players' smartphones with the team assignment (with a cookie) allowing easy QR
  scan and quest answering.
- Smartphone Optimization \
  The app is optimized for smartphones and can be used as a web app (no installation required).
- Admin Interface \
  The admin interface allows you to start the game, assign teams, and see the progress of the teams.
- Statistics \
  Some statistics, e.g. showing the scans of the teams in a live map.

## Configuration

There are several places where you should adjust the game to your needs (before deploying it).

### .env file

This file should be adapted for the basic environment settings, e.g. the ports and the admin password.

### quests.json

This file includes the individual topics assigned to the teams and the questions asked during scanning the QR codes. In
the example, the topics are related to large language models (LLMs) and the questions to some presentations of the UKP
Day 2023.

### public/logo.png

The logo used to generate the QR codes.

### Import Spots

Go to the Google Spot Map and export the spots as csv (you have to log in first). Copy the csv file into the
folder `src/assets` and rename it to spots.csv

__Note:__ Sometimes cleaning the csv file is required.

### Admin Interface

Once it built you can apply new settings over the admin interface:

- http://\<ip\>:\<port\>/admin

## Build locally

You need node.js, npm and docker installed.

```sh
npm install     # install dependencies
npm run build   # build vue app
npm run db      # docker start db
npm run start   # start server
``` 

## Development

You need node.js and npm installed.

```sh
npm install    # install dependencies
npm run db     # docker start db
npm run start  # start server
npm run dev    # build vue app and start server
```

Note: You have to run the command in separate terminals!

## Limitations / Experiences

During the UKP Day 2023, we were able to test the game with 37 players and 8 teams / topics, and it went very well. As
it was a scientific event, each team should present their topics and ideas in a short presentation (max. 5min) at the
end of the game.

It should be noted, that some teams split up to collect more QR codes. Some teams are hunting for the QR codes until the
last minute, so calculate additional time for the teams to come back.

### Known bugs / issues

- The assignment page (StartGame.vue) was reloaded multiple times during start, maybe because some players reload the
  app and the settings was changed. I already fixed this bug, but it should be tested with more connections. Assignment
  was possible, but you should act fast (it also helped to request the player not to reload the app!).
- The page were users can join could still be opened during and after the game. Maybe it's worth to add this feature and
  forbidding that.
- One player joined after the game starts, so we assigned him to a team manually. The player therefore was not on the
  official team list. A feature could be to add users manually after the game starts by the admin. A last final prompt
  or confirmation that everyone has joined therefore makes sense!
- The generated colors for the team overview should be changed, as the contrast is bad, especially for beamers on a
  sunny day. (see [colormap](https://www.npmjs.com/package/colormap) in routes/Game.vue)

## References

- https://www.arangodb.com/tutorials/tutorial-node-js/
- https://arangodb.github.io/arangojs
- https://getbootstrap.com/docs/5.0/getting-started/introduction/
- https://vue3openlayers.netlify.app/
- https://vue-i18n.intlify.dev/guide

## Disclaimer

Note that this is a fun project developed in my leisure time for the UKP Day of
the [UKP Lab at TU Darmstadt](https://www.informatik.tu-darmstadt.de/ukp/ukp_home/index.en.jsp).

No warranty for anything is given.
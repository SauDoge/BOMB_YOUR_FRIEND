# BOMB_YOUR_FRIEND

<hr/>

## COMP4021 Project
### By Joaquin, Patrick and Arnold

<hr/>

## Table of Contents

- [Introduction](#introduction)
- [Controls](#controls)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [License](#license)

<hr/>

## Introduction

 The objective of the game is to clear a path through the maze to reach the end goal, while avoiding obstacles and enemies. Players can place bombs to destroy obstacles and enemies, and collect power-ups to increase their abilities. The last player standing wins the game.

<hr/>

## Controls

The game is played with keyboard. The default controls are:
 - Movement: Arrow keys
 - Place bomb: Spacebar

<hr/>

## Installation

### To install the game, follow these steps:

1. Clone the repository to your local machine.
    ```sh
    git clone https://github.com/SauDoge/BOMB_YOUR_FRIEND.git
    ```
2. Navigate to the project directory.
    ```sh
    cd BOMB_YOUR_FRIEND/
    ```
3. Install packages.
    ```sh
    npm install --prefix ./server/ && npm install --prefix ./client/
    ```
4. Build and run server.
    ```sh
    npm run --prefix ./server/ build && npm run --prefix ./server/ start
    ```

<hr/>

## Usage
### To start the game, run the following command:
```sh
npm run --prefix ./client start
```

This will start the server and open the game in your default web browser. You can also access the game by navigating to http://localhost:8080 in your web browser.

To play the game with multiple players, share the game link with your friends and have them join the same game room.

<hr/>

## Dependencies
### The game uses the following dependencies:
- socket.io: for real-time communication between the server and clients.
- socket.io-client: for real-time communication between the client and server.
- express: for serving the game files and handling HTTP requests.
- typescript: for adding type checking to the game code.
- bcrypt: for hashing and salting passwords.
- snowpack: for building and bundling the game files.

<hr/>

## Credits
This game is based on the original Bomberman game developed by Hudson Soft. The game assets were taken from various sources, including OpenGameArt.org and Kenney.nl.

<hr/>

## License
This game is licensed under the MIT License.





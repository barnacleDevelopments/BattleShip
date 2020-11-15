/*
==========================================
Assignment_4: Program 1
Author: Devin Davis
Date: November 7th, 2020
File: app.js
===========================================
*/

const readlineSync = require("readline-sync");
const fs = require("fs");


/**
 *
 * @param {string} filePath the file path location of the text file.
 * @param {function} func a calback function to handle the text.
 */

const processTextFile = (filePath, func) => {
  fs.readFile(filePath, "utf8", (err, contents) => {
    if(!err) {
      func(contents)
    } else {
      console.log(err)
    }
  });
}

class BattleGround {
    constructor(text) {
        this.setMap(text)
        this.setHitSpots(text)
        this.rows 
        this.columns
        this.createRows()
        this.totalHitSpots = 0;
        this.currentHitSpots = 0;
        this.hitList = [];
    }

    setMap(text) {
        let map = text.split("\n")
        map = map.map(row => {
            let strRow = row.split(",");
            return (strRow.map(str => parseInt(str)))

        })
        this.rows = map
        return map
    }

    setHitSpots(text) {
        for(let i = 0; i < text.length; i++) {
            console.log()
            if(text[i] === "1") {
                this.totalHitSpots++
            }
        }
    }

    createColumns() {
        let columns = []
        let column = []
        console.log(this.rows)
        for(let i = 0; i < this.rows.length; i++) {
            for(let j = 0; j < this.rows[i].length; j++) {
                column.push(this.rows[i][i])
            }
        }
  
    }

    createRows(text) {
        let rows = [];
        for(let i = 0; i < this.rows.length; i++) {
            this["row" + (i + 1)] = this.rows[i]
        }
    }

}

const isX = (x) => {
    let possibleX = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
   for(let i = 0; i < possibleX.length; i++) {
       if(possibleX[i] === x) {
        return true
       }
    
   }
}



const initializeGame = (map) => {
    let missiles = 30
    let y, x, hits, gameWon = false, gameOver = true, nukeProgress = 0

    const launchMissile = () => {
        missiles --
        if(map["row" + (x)][y] === 1) {
            console.log(`HIT!\nYou have ${missiles} remaining`)
            map.hitList.push({y:y, x:x})
            console.log(map.hitList)
            map.currentHitSpots++
            nukeProgress ++
        } else {
            console.log(`MISS!\nYou have ${missiles} remaining`)
            nukeProgress = 0
        }
    }

    const launchNuke = () => {

    }

    const askCoordinates = (func) => {
        let coords = readlineSync.question("Choose your target (Ex. A1): ");
        let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
        if(parseInt(coords[1]) <= 10 && isX(coords[0]) && coords.length === 2) {
            y = letters.indexOf(coords[0])
            x =  parseInt(coords[1])
            func()
        }
    }

    const promptNuke = (func) => {
        let nukeConfirmed = readlineSync.question("Nuke aquired! Fire when ready (type: nuke it) :");
        if(nukeConfirmed === "nuke it") {
            func()
        } else {
            askCoordinates()
        }

    }
   
    while(missiles > 0 && gameOver) {
        if(map.currentHitSpots === map.totalHitSpots && map.currentHitSpots !== 0) {
            gameOver = false;
            gameWon = true
        }

        if(nukeProgress < 3) {
            askCoordinates(launchMissile)
        } else {
            promptNukeBtn(launchNuke)
        }
    }

    return {
        getGameScore: () => {
            if(gameWon) {
                return `You had ${map.currentHitSpots} of ${map.totalHitSpots},
                which sank all the ships.\nYou won, congratulations soldier!`
            } else {
                return `You had ${map.currentHitSpots} of ${map.totalHitSpots},
                which didn't sink all the ships.\nStraighten up soldier!`
            }
       
        }
    }

}



// log output
processTextFile("map.txt", (contents) => {
    let map = new BattleGround(contents)
    let game = initializeGame(map);
    console.log(game.getGameScore())
})
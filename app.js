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
        this.hitList = [{y: 2, x: 4}];
        this.displayRows
        this.setDisplayMap()
    }

    /**
     * 
     * @param {string} y the y axis coordinates 
     * @param {string} x the x axis coordinates 
     */
    checkHitList(y, x) {
        let hasHit = false;
        this.hitList.forEach(hit => {
            if(hit.y === y && hit.x === x) {
                hasHit = true
            }
        });
        return hasHit
    }

    /**
     * 
     * @param {string} text formated battleship map. 
     * @description formats text formated battleship text into 2 dimensional array. 
     */
    setMap(text) {
        // two dimensional array
        this.rows = text.split("\n").map(row => {
            let strRow = row.split(",").map(str => parseInt(str));
            return strRow
        });

       
    }

    /**
     * 
     * @param {text} text formated battleship map. 
     * @description counts the number of ship hit spots on th battleship map. 
     */
    setHitSpots(text) {
        for(let i = 0; i < text.length; i++) {
            if(text[i] === "1") {
                this.totalHitSpots++
            }
        }
    }

    setDisplayMap() {
        let displayMap = ``
        let rowFormated = ``
        console.log("  A B C D E F G H I J")
        this.rows.forEach((row, i) => {
            row.forEach((spot, i) => {
                this.hitList.forEach(hit => {
                    console.log(spot, i)
                    console.log(hit.y, i)
                    if(spot === i) {
                        console.log("hit logged")
                        // displayMap = displayMap.concat(`${i} ${row.toString()}\n`);
                    }
                })
            });
        });
        console.log(displayMap)
    }

    /**
     * @description
     */
    createColumns() {
        let columns = []
        let column = []
        for(let i = 0; i < this.rows.length; i++) {
            for(let j = 0; j < this.rows[i].length; j++) {
                column.push(this.rows[i][i])
            }
        }
    }

    createRows() {
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

/**
 * 
 * @param {object} map a class object of the batlleship map.  
 */
const initializeGame = (map) => {
    let missiles = 30
    let y, x, hits, gameWon = false, gameOver = true, nukeProgress = 0
    /**
     * @description launches missile a specified coordinates.
     */
    const launchMissile = () => {
        missiles --
        if(map["row" + (x)][y] === 1) {
            if(map.checkHitList(y, x)) {
                console.log(`HIT! You have previously hit this ship\nYou have ${missiles} remaining`)
            } else {
                console.log(`HIT!\nYou have ${missiles} remaining`)
                map.hitList.push({y:y, x:x})
                map.currentHitSpots++
                nukeProgress ++
            }
        } else {
            console.log(`MISS!\nYou have ${missiles} remaining`)
            nukeProgress = 0
        }
    }

    /**
     * 
     * @param {func} func callback function to be executed once coordiates are aquired. 
     * @description prompts users for coordinates.
     */
    const askCoordinates = (func) => {
        let coords = readlineSync.question("Choose your target (Ex. A1): ");
        let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
        if(parseInt(coords[1]) <= 10 && isX(coords[0]) && coords.length === 2) {
            y = letters.indexOf(coords[0])
            x =  parseInt(coords[1])
            func()
        }
    }
    // const launchNuke = () => {

    // }

    // const promptNuke = (func) => {
    //     let nukeConfirmed = readlineSync.question("Nuke aquired! Fire when ready (type: nuke it) :");
    //     if(nukeConfirmed === "nuke it") {
    //         func()
    //     } else {
    //         askCoordinates()
    //     }

    // }
   
    // loop coordinate question until rockets are depleted || game ended
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
        /**
         * @description returns the current game report.
         */
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

// logs output
processTextFile("map.txt", (contents) => {
    let map = new BattleGround(contents)
    let game = initializeGame(map);
    console.log(game.getGameScore())
})
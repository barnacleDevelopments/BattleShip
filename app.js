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
      func(contents);
    } else {
      console.log(err);
    }
  });
}

class BattleGround {
    /**
     * 
     * @param {string} text a string of seperated rows of 1s and 0s. 
     */
    constructor(text) {
        this.convertMap(text);
        this.setHitSpots(text);
        this.rows ;
        this.totalHitSpots = this.setHitSpots(text);
        this.currentHitSpots = 0;
        this.hitList = [{y: 7, x: 5}];
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
    convertMap(text) {
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
        let totalSpots = 0
        this.rows.forEach(row => {
            row.forEach(spot => {
                if(spot === 1) {
                    totalSpots += 1;
                }
            });
        });
        return totalSpots;
    }

    setDisplayMap() {
        let that = this;

        /**
         * 
         * @param {number} colIndex a number referencing the column position.  
         * @param {number} rowIndex a number referecing the row position.
         * @description return a boolean stating wether the referenced position is a ship. 
         */
        const isShip = (colIndex, rowIndex) => {
            for(let hit of that.hitList) {
                if(hit.y === (colIndex) && hit.x === (rowIndex)) {
                    return true;
                }
            }
        }

        /**
         * 
         * @param {array} row grid column section.  
         * @param {number} rowIndex a number referecing the current row.
         * @description iterates over column section and places "x" markers on hit ships.
         */
        const buildRow = (row, rowIndex) => {
            let newRow = ""
            // loop each row index
            for(let i in row) {
                if(isShip(parseInt(i), parseInt(rowIndex))) {
                    newRow = newRow.concat("x "); 
                } else {
                    newRow = newRow.concat("- ");
                }
            } 

            if(newRow === "") {
                return "- - - - - - - - - - "
            } else {
                return newRow;
            }
        }

        /**
         * 
         * @description builds string representations of rows and formats them into a table. 
         */
        const buildTable = () => {
            let table = '   A B C D E F G H I J\n'
            for(let row in that.rows) {
                let rs = buildRow(that.rows[row], row);
                table =  table.concat(` ${parseInt(row) + 1} ${rs}\n`)
            }
            return table;
        }

        return buildTable(this.rows, this.hitList);
    }
}

/**
 * 
 * @param {object} map a class object of the batlleship map.  
 */
const initializeGame = (map) => {
    let missiles = 30;
    let y, x, gameWon = false, gameOver = false, nukeProgress = 0;

    /**
     * 
     * @param {string} x a letter representing the column position.
     * @description validates the column position provided.
     */
    const isY = (x) => {
        let possibleX = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
       for(let i = 0; i < possibleX.length; i++) {
           if(possibleX[i] === x.toLowerCase()) {
            return true;
           }
        
       }
    }

    /**
     * 
     * @param {string} y a letter representing the row position.
     * @description validates the row position provided. 
     */
    const isX = (y) => {
        let firstDigit = parseInt(y[1]);
        let secondDigit = parseInt(y[2]);
        if(firstDigit === 1 && secondDigit === 0) {
            return true;
        } else if(firstDigit <= 9) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description launches missile a specified coordinates.
     */
    const launchMissile = () => {
        missiles --;
        if(map.rows[x][y] === 1) {
            if(map.checkHitList(y, x)) {
                console.log(map.setDisplayMap());
                console.log(`HIT! You have previously hit this ship\nYou have ${missiles} remaining`)
         
            } else {
                map.hitList.push({y:y, x:x})
                console.log(map.setDisplayMap())
                console.log(`HIT!\nYou have ${missiles} remaining`);
                map.currentHitSpots++;
                nukeProgress ++;
          
            }
        } else {
            console.log(`MISS!\nYou have ${missiles} remaining`)
            nukeProgress = 0;
        
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
        if(isX(coords) && isY(coords[0]) && coords.length <= 3) {
            y = letters.indexOf(coords[0].toLowerCase());
            x = parseInt(coords[1] - 1);
            func();
        } else {
            askCoordinates(launchMissile);
        }
    }
    
    /**
     * @description gits all ship hit positions and adds them to the maps hitlist. 
     */
    const launchNuke = () => {
        map.rows.forEach((row, i) => {
            row.forEach((spot, j) => {
                if(parseInt(spot) === 1) {
                    map.hitList.push({y: j, x: i});
                    console.log(`HIT!`);
                }
            });
        });
        gameWon = true;
        gameOver = true;
        map.currentHitSpots = map.totalHitSpots;
        console.log(map.setDisplayMap());
    }

    /**
     * 
     * @param {function} func a callback function that executes when prompt is anwsered.
     * @description prompts user to use launch nuke function.  
     */
    const promptNuke = (func) => {
        let nukeConfirmed = readlineSync.question("Nuke aquired! Fire when ready (type: 'nuke it' or 'nah' to cancle ) :");
        if(nukeConfirmed === "nuke it") {
            func();
        } else if (nukeConfirmed === "nah") {
            askCoordinates(launchMissile);
        } else {
            promptNuke(launchNuke);
        }

    }
   
    // loop coordinate question until rockets are depleted || game ended
    while(missiles > 0 && !gameOver) {
        if(map.currentHitSpots === map.totalHitSpots && map.currentHitSpots !== 0) {
            gameOver = false;
            gameWon = true;
        }

        if(nukeProgress < 3) {
            askCoordinates(launchMissile);
        } else {
            promptNuke(launchNuke);
            nukeProgress = 0;
        }
    }

    return {
        /**
         * @description returns the current game report.
         */
        getGameScore: () => {
            if(gameWon) {
                return `You got ${map.currentHitSpots} of ${map.totalHitSpots},
                which sank all the ships.\nYou won, congratulations soldier!`;
            } else {
                return `You got ${map.currentHitSpots} of ${map.totalHitSpots},
                which didn't sink all the ships.\nStraighten up soldier!`;
            }
        }
    }
}

// logs output
processTextFile("map.txt", (contents) => {
    let map = new BattleGround(contents);
    let game = initializeGame(map);
    console.log(game.getGameScore());
})
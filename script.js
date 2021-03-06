// Declare global variables
let game_area = document.getElementById("game_area");
let box_number = -1;
var mine_array = [];
var linear_array = [];
var compare_array = [];
var visited_array = [];
var game_done = false;
var flag_mode = false;

function generateMines() { // function that randomly populates grid with mines

    let result = Math.floor((Math.random() * 100) + 1);

    if (result < 20) {
        return true;
    }
}

function coordinateConverter(x, y) { // we are using the coordinate system, but in order to get a single number to color code squares we need to convert

    if (outofBounds(x,y) == true) {
        return false;
    }

    let result = x + (y * 16);
    return result;
}

function outofBounds(x, y) { // Checks to see if the square being accessed will be out of bounds

    if (x < 0 || y < 0 || y > 19 || x > 15) { // MAY NEED TO SWITCH THESE AROUND
        return true;
    }

    return false;
}

function isSquareSafe(x, y) { // Looks at coordinate and sees if mine or no
    
    if (mine_array[y][x] == "mine") {
        return false;
    }

    return true;
}

function isChecked(x, y) { // Looks at a square to see if it has been visited

    let result = visited_array[x][y];

    if (result == "visited") {
        return true;
    }

    return false;
}

function findMines(x, y) { // checks 8 squares around it to see how many mines

    let total_mines = 0;

    try {

        if (mine_array[y + 1][x] == "mine") {
            total_mines += 1;
        }

    } catch (err) {}

    try {

        if (mine_array[y + 1][x - 1] == "mine") {
            total_mines += 1;
        }

    } catch (err) {}

    try {

        if (mine_array[y + 1][x + 1] == "mine") {
            total_mines += 1;
        }
    

    } catch (err) {}

    try {

        if (mine_array[y - 1][x] == "mine") {
            total_mines += 1;
        }

    } catch (err) {}

    try {

        if (mine_array[y - 1][x - 1] == "mine") {
            total_mines += 1;
        }

    } catch (err) {}

    try {

        if (mine_array[y - 1][x + 1] == "mine") {
            total_mines += 1;
        }

    } catch (err) {}

    try {

        if (mine_array[y][x + 1] == "mine") {
            total_mines += 1;
        }

    } catch (err) {}

    try {

        if (mine_array[y][x - 1] == "mine") {
            total_mines += 1;
        }

    } catch (err) {}

    return total_mines;
}

function labelMines(x, y) { // If mines are found around a square, then highlight square and put number

    let box_number = coordinateConverter(x, y); 

    if (box_number != false) {
        var mine_number = findMines(x, y);
        var box = document.getElementById(`${box_number}`);
    }

    switch (mine_number) {
        case 1:
            box.textContent = "1";
            box.style.background = "#D3D3D3";
            box.style.color = "blue";
            break;
        case 2:
            box.textContent = "2";
            box.style.background = "#D3D3D3";
            box.style.color = "green";
            break;
        case 3:
            box.textContent = "3";
            box.style.background = "#D3D3D3";
            box.style.color = "red";
            break;
        case 4:
            box.textContent = "4";
            box.style.background = "#D3D3D3";
            box.style.color = "#4B0082";
            break;
        case 5:
            box.textContent = "5";
            box.style.background = "#D3D3D3";
            box.style.color = "#BC8F8F";
            break;
        case 6:
            box.textContent = "6";
            box.style.background = "#D3D3D3";
            box.style.color = "#48D1CC";
            break;
        case 7:
            box.textContent = "7";
            box.style.background = "#D3D3D3";
            box.style.color = "black";
            break;
        case 8:
            box.textContent = "8";
            box.style.background = "#D3D3D3";
            box.style.color = "#C0C0C0";
    }   
}

function revealAllMines() { // shows all mines on map
    for (i = 0; i < linear_array.length; i++) {
        let box = document.getElementById(`${linear_array[i]}`);
        box.textContent = "";
        
        box.style.background = "#F08080"; 
        let textnode = document.createTextNode("⚫");
        box.append(textnode);
    }
}

function flagSquare(x, y) { // function to allow user to flag potential mines

    let box_number = coordinateConverter(x, y);
    var box = document.getElementById(`${box_number}`);

    if (box.textContent == "🚩" && game_done == false) {
        box.textContent = "";
        box.style.background = "";
    }

    else {
        if (game_done == false) {
            let flag = document.createTextNode("🚩");
            box.style.background = "#E0FFFF";
            box.appendChild(flag);
        }
    }
}

function gameWon() { // checks to see if all safe squares have been discovered
    if ((linear_array.length + compare_array.length) == 320) {
        return true;        
    }
}

function userClick(element_number) {    
    let y = Math.floor(element_number / 16);
    let x = element_number - (16 * (Math.floor(element_number / 16)));
    let status = document.getElementById("flag_mode").checked;

    if (status == true) {
        flagSquare(x, y);
    }

    else if (status == false) {

        if (isSquareSafe(x, y) == true) {
            revealSafeSquares(x, y);
            if (gameWon() == true) {
                document.getElementById("game_indicator").textContent = "Game Status: Won";
                game_done = true;
            }                  
        }

        else if (game_done == false) {
            revealAllMines();
            document.getElementById("game_indicator").textContent = "Game Status: Lost";
            game_done = true;
        }    
    }
}

function revealSafeSquares(x, y) { // Recursive function that can reveal squares, surrounding mines and flood fill empty squares

    if (game_done == true) { // game toggle 
        return false;
    }

    if (outofBounds(x, y) == true) { // if square is not on grid
        return false;
    }

    let box_number = coordinateConverter(x, y);
    let box = document.getElementById(`${box_number}`);

    if (isChecked(x, y) == true) { // if square has already been visited
        return false;
    }

    if (isSquareSafe(x, y) == false) { // if the square is a mine
        return false;
    }

    let num_mines = findMines(x, y);

    if (num_mines > 0) { // if there are mines surrounding, then stop
        labelMines(x, y);
        visited_array[x][y] = "visited";
        compare_array.push("safe");        
        return false;
    }

    box.style.background = "#D3D3D3"; // all checks pass, label square as visited
    compare_array.push("safe");    
    visited_array[x][y] = "visited";   
    
    revealSafeSquares(x, y + 1);
    revealSafeSquares(x, y - 1);
    revealSafeSquares(x + 1, y);
    revealSafeSquares(x - 1, y);
    revealSafeSquares(x - 1, y - 1);
    revealSafeSquares(x + 1, y - 1);
    revealSafeSquares(x - 1, y + 1);
    revealSafeSquares(x + 1, y + 1);   
}

function make2DArray(rows,cols) { // Make 2D array that is a copy of the actual gameboard to store values
    
    for (i = 0; i < rows; i++) {
        let row_array = [];
        let check_array = [];      

        for (j = 0; j < cols; j++) {
            row_array[j] = "safe";
            check_array[j] = "unvisited";
        }

        mine_array.push(row_array);
        visited_array.push(check_array);
    }    
}

function makeGameArea(rows,cols) { // Make user interface

    for (i = 0; i < rows; i++) {
        let new_div = document.createElement("div");
        new_div.className = "rowDiv";
        game_area.appendChild(new_div);

        for (j = 0; j < cols; j++) {
            let col_div = document.createElement("div");
            col_div.className = "colDiv";
            new_div.appendChild(col_div);
            box_number += 1;
            col_div.id = box_number;            
            col_div.setAttribute("onclick", `userClick(${box_number})`);           
            let result = generateMines();

            if (result == true) {                
                linear_array.push(box_number);
                mine_array[i][j] = "mine";
            }
        }
    }

    document.getElementById("mine_indicator").textContent = "Total Mines: " + linear_array.length;
    document.getElementById("game_indicator").textContent = "Game Status: Ongoing";
}

make2DArray(20,16);
makeGameArea(20,16);

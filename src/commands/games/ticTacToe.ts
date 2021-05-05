import { CollectorFilter, Message, Snowflake, User } from "discord.js";

//const emptyBoard = [[0,0,0],[0,0,0],[0,0,0]]
const emptyBoard = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
module.exports = {
    commands: ['tictactoe','piskvorky'],
    expectedArgs: '<xSize> <ySize> <winLenght>',
    minArgs: 0,
    maxArgs: 3,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string): Promise<undefined> => {
        if (!message.guild) {return}
        var xSize: number = 4
        var ySize: number = 4
        var winLenght: number = 4;
        const pisPrefix = 'pis'
        if (args[0]) {
            xSize = parseInt(args[0])
            ySize = parseInt(args[1])
            winLenght = parseInt(args[2])
        } 
        if (isNaN(xSize) || isNaN(ySize) || isNaN(winLenght)) {
            global.lang(message.guild.id, 'INPUT_ERR_HALT')
        }
        const board: number[][] = emptyBoard


        //for (var y = 0;y<xSize;y++){
        //    for (var x = 0;x<xSize;x++){
        //        board[x][y] = 0
        //    }
        //}

        const collectorFilter: CollectorFilter = (inputMessage: Message, user: User) => {
           return message.author.id === inputMessage.author.id && inputMessage.content.split(' ')[0] == pisPrefix
        
        }
        const players: Player[] = [{bID: 0, id: message.id}, {bID: 1, id: null}]
        var curPlayer = 1; //0

        //console.log(analizeBoard([[0,0,1],
        //                          [0,0,2],
        //                          [2,2,1]],2,xSize,ySize, winLenght))
        //return

        while (true) {
            //if (players[curPlayer].id) {
            if (false) {
                //player
                console.log('mini')
                
                const collection = await message.channel.awaitMessages(collectorFilter, { max: 1 })
                const inputMessage = collection.first()
                if (!inputMessage) { console.log("mess error"); return undefined }
                //const pos = getPosition(inputMessage.content.split(' ')[1])
                //board[pos.x][pos.y] = 1
            }
            else {
                //BOT
                var result = minimax(passByValue(board, xSize, ySize),0,curPlayer,curPlayer,players,winLenght, xSize, ySize)
                console.log(numberOfChecks)
                numberOfChecks = 0
                if (!result) {console.log('NULL'); return}
                console.log(result)
                board[result.x][result.y] = curPlayer
                console.log(getBoard(board, xSize, ySize))
                //console.log(cache)
                //return
            }
            curPlayer = other(curPlayer)
        }
    }
}
type Player = {
    bID: number
    id: (Snowflake|null)
}

var numberOfChecks = 0

function passByValue(board: number[][], xSize: number, ySize: number) {
    //return board
    //const newBoard: number[][] = [[0,0,0],[0,0,0],[0,0,0]]

    const newBoard = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    
    for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
        
        newBoard[x][y] = board[x][y]
    }}

    return newBoard
}
type Cache = {
    //board: number[][]
    score: number
    player: number
    x: number
    y: number
}

type Caches = {
    [index: string]: Cache
}
const cache: Caches = {}


function minimax(board: number[][], depth: number, maximizingPlayer: number, curPlayer: number, players: Player[], winLenght: number, xSize: number, ySize: number){
    numberOfChecks++
    var output = analizeBoard(board, maximizingPlayer, xSize, ySize, winLenght)
    var result = {score: output.score, x:-1, y:-1}
    //if (output.longestLenght.length >= winLenght) {
    //console.log(output.itsFree)
    if (!output.itsFree) {
        //Win
        //console.log(`${output.longestLenght.player} vyhral na \n${getBoard(board,xSize,ySize)}!\n----------------------`)
        //result.score = maximizingPlayer===output.longestLenght.player && output.longestLenght.length>=winLenght? 696969:-696969
        if (output.longestLenght.player === 0) {result.score = 0}
        //console.log(`${'\t'.repeat(depth)}${getBoard(board,xSize,ySize, depth)} Win ${output.longestLenght.xy} ${output.longestLenght.length}`)
        return result
    }
    if (output.longestLenght.length >= winLenght || depth > 7) {
        return result
    }
    //const depthLog = 0
    
    
    //var nextPlayer = 0
    //if (curPlayer === 1) {nextPlayer = 2}
    //else if (curPlayer === 2) {nextPlayer = 1}


    if (maximizingPlayer === curPlayer) {
        //maximizing
        result.score = -Infinity
        for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board[0].length; y++) {
            if (board[x][y] == 0) {
                var newBoard = passByValue(board,xSize,ySize)
                newBoard[x][y] = curPlayer
                //if (depth < depthLog) {
                    //console.log(`${'\t'.repeat(depth)}maximizing for x ${x} y ${y}`)
                    //console.log(`${'\t'.repeat(depth)}${getBoard(newBoard,xSize,ySize,depth)}`); 
                //}
                
                var id = getID(newBoard,xSize,ySize)
                if (cache[id]) {
                    var curCache = cache[id]
                    score = {
                        score: curCache.player===maximizingPlayer? curCache.score:-curCache.score,
                        x: curCache.x,
                        y: curCache.y
                    }
                }
                else {
                    score = minimax(passByValue(newBoard, xSize, ySize), depth+1, maximizingPlayer, other(curPlayer),players,winLenght, xSize, ySize)
                    if (!score) {console.log('NULL 100');return null}
                    var curCache: Cache = {
                        score: score.score,
                        player: maximizingPlayer, //?
                        x, y //?
                    }
                    cache[id] = curCache
                }

                //if (depth < 3) {console.log(board)}

                //console.log(score?.score)
                //if (depth < depthLog) {
                    //console.log(`${'\t'.repeat(depth)}ma skore ${score?.score}; x ${x} y ${y}; aktulni result ${result.score}; output delka ${output.longestLenght.length}`)
                //}
                if (score.score >= result.score) {
                    //score.x = x
                    //score.y = y
                    //result = score
                    //OLDconsole.log('\t'.repeat(depth)+'nove max')
                    result.score = score.score
                    result.x = x
                    result.y = y
                }
                
            }
        }
    }}
    if (maximizingPlayer !== curPlayer) {
        //minimizing
        result.score = Infinity
        for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board[0].length; y++) {
            if (board[x][y] == 0) {
                var newBoard = passByValue(board,xSize,ySize)
                newBoard[x][y] = curPlayer

                //if (depth < 3) {console.log(board)}
                //if (depth < depthLog) {
                    //console.log(`${'\t'.repeat(depth)}minimizing for x ${x} y ${y}`)
                    //console.log(`${'\t'.repeat(depth)}${getBoard(newBoard,xSize,ySize,depth)}`)
                //}
                var id = getID(newBoard,xSize,ySize)
                if (cache[id]) {
                    var curCache = cache[id]
                    score = {
                        score: curCache.player===maximizingPlayer? curCache.score:-curCache.score,
                        x: curCache.x,
                        y: curCache.y
                    }
                }
                else {
                    var score = minimax(passByValue(newBoard, xSize,ySize), depth+1, maximizingPlayer, other(curPlayer),players,winLenght, xSize, ySize)
                    if (!score) {console.log('NULL 100');return null}
                    var curCache: Cache = {
                        score: score.score,
                        player: maximizingPlayer, //?
                        x, y //?
                    }
                    cache[id] = curCache
                }
                //console.log(score?.score)
                if (!score) {console.log('NULL 117');return null}
                //if (depth < depthLog) {
                //    console.log(`${'\t'.repeat(depth)}ma skore ${score?.score}; x ${x} y ${y}; aktualni max ${result.score}, output delka ${output.longestLenght.length}`)
                //}
                if (score.score <= result.score) {
                    //score.x = x
                    //score.y = y
                    //result = score
                    //OLDconsole.log('\t'.repeat(depth)+`nove min`)
                    result.score = score.score
                    result.x = x
                    result.y = y
                }
            }
        }
    }}
    
    return result

    //Pro X1 Y1:
        //BOARD
        //X Y score
        //---
        //Board
        //X Y score
    

    if (!players[curPlayer-1].id) {
        //Bot playing
    }
}

function getID(board: number[][], xSize: number, ySize: number) {
    var output = ''
    for (var x = 0; x < xSize; x++) {
    for (var y = 0; y < ySize; y++) {
        
            output+=`${board[x][y]} `
        }
        
    }
    return output
}

function other(arg: number) {
    if (arg === 1) {return 2}
    if (arg === 2) {return 1}
    console.log('0!!!!!')
    return 0
}

function analizeBoard(board: number[][],maximizingPlayer: number, xSize: number, ySize: number, winSize: number) {
    var itsFree = false
    var longestLenght = {
        player: 0,
        length: 0, xy: ''
    }
    //console.log(`prvni ${board[0][0]} ${board[1][0]} ${board[0][1]}`)
    //console.log(getBoard(board,xSize,ySize))
    var score = 0
    var enemyPieces = 0
    for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[0].length; y++) {
            if (board[x][y] === 0) {
                itsFree = true
            }
            if (board[x][y] == other(maximizingPlayer)) {
                enemyPieces++
            }
            
            if (board[x][y] !== 0) {

            
            var pieceScore = 1
            var lenghtLong = 0

            var output = length(board,x,y,1,0, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            //if (lenghtLong > out)
            pieceScore*=output
            
            var output = length(board,x,y,1,1, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            pieceScore*=output

            var output = length(board,x,y,0,1, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            pieceScore*=output

            var output = length(board,x,y,-1,0, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            pieceScore*=output

            var output = length(board,x,y,0,-1, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            pieceScore*=output


            var output = length(board,x,y,1,-1, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            pieceScore*=output

            var output = length(board,x,y,-1,1, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            pieceScore*=output

            var output = length(board,x,y,-1,-1, xSize, ySize)
            lenghtLong = Math.max(lenghtLong, output)
            pieceScore*=output

            //console.log(`lenght ${lenghtLong} on ${x} ${y}`)

            if (lenghtLong>longestLenght.length) {longestLenght.length = lenghtLong; longestLenght.player = board[x][y]; longestLenght.xy = `${x}${y}`}
            if (maximizingPlayer == board[x][y]){
                score+= pieceScore
            }
            else {
                score-= pieceScore
            }}
        }
        
    }
    //if (!itsFree) {
    //    score = 0
    //}
    if (longestLenght.length >= winSize) {
        var factor = longestLenght.player === maximizingPlayer? 1:-1
        score=factor*1000-enemyPieces
    }
    
    return {
        longestLenght,
        score,
        itsFree
    } 
    //IS FULL?
}

function length(board: number[][], x: number, y: number, factorX: number, factorY: number, xSize: number, ySize:number) {
    var lenght = 1
    var curX = x+factorX
    var curY = y+factorY
    while(true) {
        //Check if out of board
        //console.log(`${x+factorX} ${y+factorY}; ${factorX} ${factorY}`)
        
        if (board[x][y]===0) {return 1}
        if (x+factorX <0 || x+factorX>=xSize|| y+factorY < 0 || y+factorY>=ySize) {break}
        if (board[x][y] !== board[x+factorX][y+factorY]) {
            break
        }
        x+=factorX
        y+=factorY
        lenght++
    }
    return lenght
}

function getBoard(board: number[][], xSize: number, ySize: number, depth = 0) {
    var output = ''
    for (var x = 0; x < xSize; x++) {
    for (var y = 0; y < ySize; y++) {
        
            output+=`${board[x][y]} `
        }
        output+='\n'+'\t'.repeat(depth)
    }
    return output.substring(0,output.length-2)
}
function getPosition(input: string) {
    return {
        x: parseInt(input[0]),
        y: parseInt(input[1])
    }
}
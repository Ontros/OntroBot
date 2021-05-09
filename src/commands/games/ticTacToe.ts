import { kMaxLength } from "buffer";
import { SSL_OP_NO_TLSv1_1 } from "constants";
import { randomInt } from "crypto";
import { CollectorFilter, Message, Snowflake, User } from "discord.js";

const {performance} = require('perf_hooks')

//const emptyBoard = [[0,0,0],[0,0,0],[0,0,0]]
const emptyBoard:number[][] = [[]]// = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
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
        var xSize: number = 3
        var ySize: number = 3
        var winLenght: number = 3;
        //emptyBoard = new Array(xSize).fill(new Array(ySize).fill(0))
        for (var x = 0; x<xSize; x++) {
            emptyBoard[x] = new Array(ySize).fill(0)
        }
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
        
        //const board: number[][] = [[0,1,0]
        //                          ,[0,1,0],
        //                           [0,0,2]] 


        //for (var y = 0;y<xSize;y++){
        //    for (var x = 0;x<xSize;x++){
        //        board[x][y] = 0
        //    }
        //}

        const collectorFilter: CollectorFilter = (inputMessage: Message, user: User) => {
           return message.author.id === inputMessage.author.id && inputMessage.content.split(' ')[0] == pisPrefix
        
        }
        const players: Player[] = [{bID: 0, id: message.id}, {bID: 1, id: null}]
        var curPlayer = 2; //0

        var b = [[2,0,0],
                 [0,2,0],
                 [0,0,2]]

        console.log(checkWin(b,xSize,ySize, winLenght))

        //console.log(length(b,2,0,-1,-1,xSize,ySize))
        //return
        var start = performance.now()
        while (true) {
            
            //if (players[curPlayer].id) {
            if (curPlayer === 1) {
                //player
                console.log('mini')
                
                
                const collection = await message.channel.awaitMessages(collectorFilter, { max: 1 })
                const inputMessage = collection.first()
                if (!inputMessage) { console.log("mess error"); return undefined }
                const pos = getPosition(inputMessage.content.split(' ')[1])
                board[pos.x][pos.y] = 1
            }
            else {
                //BOT
                //board[0][1] = 1
                //board[0][2] = 1
                //board[0][3] = 1
                //board[0][4] = 2
                var result = select(passByValue(board,xSize,ySize),curPlayer,winLenght,xSize,ySize)//minimax(passByValue(board, xSize, ySize),0,curPlayer,curPlayer,winLenght, xSize, ySize)
                console.log(numberOfChecks)
                numberOfChecks = 0
                if (!result) {console.log('NULL'); return}
                console.log(result)
                board[result.x][result.y] = curPlayer
                console.log(getBoard(board, xSize, ySize)+'\n')
                console.log(checkWin(board,xSize,ySize,winLenght))
                ////console.log(`celkem ${performance.now()-start} analiza ${analizeTime}`)
                //console.log(cache)
                //return
            }
            var analiza = analizeBoard(board, xSize,ySize,winLenght,0)
            if (analiza.longestLenght.length >= winLenght || !analiza.itsFree) {
                console.log('cenok')
                return
            }
            curPlayer = other(curPlayer)
        }
    }
}
type Player = {
    bID: number
    id: (Snowflake|null)
}

/*function vzdalenost(board: number[][], curPlayer: number, x: number, y: number, factorX: number, factorY: number, xSize: number, ySize:number) {
    var vzdalenost = ''
    //var curX = x+factorX
    //var curY = y+factorY
    while(true) {
        //Check if out of board
        //console.log(`${x+factorX} ${y+factorY}; ${factorX} ${factorY}`)
        if (x+factorX <0 || x+factorX>=xSize|| y+factorY < 0 || y+factorY>=ySize) {break}
        x+=factorX
        y+=factorY
        
        if (board[x][y]===0) {vzdalenost+='O'}//NIC
        if (board[x][y]===curPlayer) {vzdalenost+='I'}//HRAC
        if (board[x][y]===other(curPlayer)) {vzdalenost+='X'}//ENEMY

        //vzdalenost+=curPlayer===board[x][y]

    }
    return vzdalenost
}

function getBoardValue(board: number[][], xSize: number, ySize: number, x: number, y: number, curPlayer: number) {
    //vytvor vzdalenosti:
    var vzdalenosti: string[] = [];
    [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]].forEach((fac)=>{
        vzdalenosti.push(vzdalenost(board,curPlayer,x,y,fac[0],fac[1],xSize,ySize))
    })
    
    //ZACHRAN SI PRDEL
    //console.log(vzdalenosti)
    if (vzfil(vzdalenosti, 'XXXO')||vzfil(vzdalenosti,'XXXX')) {console.log(`prdel ${x} ${y}`); console.log(vzdalenosti);return Infinity}
    var delky: number[] = [];
    var soucin = 1;
    [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]].forEach((fac)=>{
        var delka = length(board,x,y,fac[0],fac[1],xSize,ySize)
        delky.push(delka)
        soucin*=delka
    })
    return Math.random()
    //pokud
}

function vzfil(vzdalenosti: string[], fil: string) {
    return !!vzdalenosti.find((vzdal)=>{return vzdal.slice(0,fil.length)===fil})
}*/

var numberOfChecks = 0

function passByValue(board: number[][], xSize: number, ySize: number) {
    //return board
    //const newBoard: number[][] = [[0,0,0],[0,0,0],[0,0,0]]

    const newBoard = new Array(xSize)
    
    for (var x = 0; x < xSize; x++) {
        newBoard[x] = new Array(ySize)
    for (var y = 0; y < ySize; y++) {
        
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

function select(board: number[][], curPlayer:number, winLenght: number, xSize: number, ySize: number) {
    var selecion = {
        x: -1, y: -1,
        score: curPlayer === 1? -Infinity:Infinity
        //score: -Infinity
    }
    if (curPlayer===1) {console.log('max')}
    if (curPlayer===2) {console.log('min')}
    for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[0].length; y++) {
        if (board[x][y]===0) {
            var newBoard = passByValue(board, xSize, ySize) 
            //x = 2
            //y = 1
            newBoard[x][y] = curPlayer
            var score = minimax(newBoard,1, other(curPlayer), winLenght,xSize,ySize/*,Infinity,-Infinity*/)// *  curPlayer === 1?1:-1
            //var score = minimax(passByValue(board,xSize,ySize),xSize,ySize,x,y,curPlayer)
            console.log(`${score} on ${x} ${y}`)
            //console.log(getBoard(newBoard,xSize,ySize))
            if (curPlayer === 1) {
            //    if (true) {
                if (score>=selecion.score) {
                selecion = {
                    x,y,score
                }
            }
            }
            else {
                if (score<=selecion.score) {
                selecion = {
                    x,y,score
                }
            }

            }
            
            //return
        }
    }}
    return selecion
}


//function minimax(board: number[][], depth: number, maximizingPlayer: number, curPlayer: number, players: Player[], winLenght: number, xSize: number, ySize: number){
function minimax(board: number[][], depth: number,  curPlayer: number, winLenght: number, xSize: number, ySize: number, /*alpha: number, beta: number*/){
    //TODO REWRITE //////////////////////////////////////////////////////////////////////////////////////
    var analized = analizeBoard(board,xSize,ySize,winLenght,depth)
    //console.log(board)
    if (analized.longestLenght.length >= winLenght) {
        //console.log(analized.longestLenght.player)
        //console.log(getBoard(board,xSize,ySize)+'\n')
        //return 1 === +analized.longestLenght.player? 10000+analized.score:-10000-analized.score
        if (analized.longestLenght.player === 1) {
            return 10000+(1/depth)*1000
        }
        else {
            return -10000 - (1/depth)*1000
        }
    }
    if (!analized.itsFree) {
        return 0
        //return analized.score * (curPlayer === 1?1:-1)//analized.longestLenght.player? analized.longestLenght.length:-analized.longestLenght.length
    }
    var alpha = curPlayer===1?-Infinity:Infinity
    //var alpha = -Infinity
    for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[0].length; y++) {
        //MAKE MOVES
        if (board[x][y] === 0) {
            var newBoard = passByValue(board, xSize, ySize) 
            newBoard[x][y] = curPlayer
                    
                    //console.log(`${'\t'.repeat(depth)}maximizing for x ${x} y ${y}`)
                    //console.log(`${'\t'.repeat(depth)}${getBoard(newBoard,xSize,ySize,depth)}`); 
                    var score = minimax(passByValue(newBoard,xSize,ySize),depth+1,other(curPlayer),winLenght,xSize,ySize/*,-beta,-alpha*/)
                    
                    //if (Math.abs(score)===102){
                        //console.log(`${'\t'.repeat(depth)}ma skore ${score}; x ${x} y ${y}; aktulni result ${alpha}; output delka ${analized.longestLenght.length}`)
                    //}
            //if (score>= beta) {
                //return beta
            //}
            if (curPlayer === 1) {
            //if (true) {
                alpha = Math.max(alpha,score)
            }
            else {
                alpha = Math.min(alpha,score)
            }
            
        }
    }}
    return alpha
}

function getID(board: number[][], xSize: number, ySize: number) {
    //return board
    var output = ''
    for (var x = 0; x < xSize; x++) {
    for (var y = 0; y < ySize; y++) {
        
            output+=`${board[x][y]}`
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

var analizeTime = 0

function checkWin(board: number[][], xSize:number, ySize: number, winSize: number) {
    var maxLenght = 0
    var player = 0
    var isFree = false
    for (var x = 0; x < xSize; x++) {
    for (var y = 0; y < ySize; y++) {
        if (board[x][y]===0) {isFree = true}
        //TODO loop only where max lenght posibble
        var silenost = Math.max(length(board,x,y,1,0,xSize,ySize),length(board,x,y,0,1,xSize,ySize),length(board,x,y,1,1,xSize,ySize),length(board,x,y,-1,-1,xSize,ySize),length(board,x,y,-1,1,xSize,ySize),/*length(board,x,y,1,-1,xSize,ySize)*/)
        if (silenost>maxLenght && board[x][y] !== 0)
        {
            maxLenght = silenost
            player = board[x][y]
        }
    }}
    return {length: maxLenght, player, isFree}
}

//function analizeBoard(board: number[][],maximizingPlayer: number, xSize: number, ySize: number, winSize: number, depth: number) {
function analizeBoard(board: number[][],xSize: number, ySize: number, winSize: number, depth: number) {
    
    /*var t0 = performance.now()
    var maxL = checkWin(board,xSize,ySize,winSize)
    if (winSize<=maxL.length) {
    var factor = 1
    var score=factor*1000
    //console.log(board)
    //console.log(maxL.player)
    analizeTime+=(performance.now()-t0)
    return {
        longestLenght: maxL,
        score,
        itsFree: maxL.isFree
    } 
    }
    return {
        longestLenght: {player:0,length:0},
        score: 0,
        itsFree: maxL.isFree
    } 
    //console.log('wot u doin here?')*/
    var longestLenght = {
        player: 0,
        length: 0, xy: ''
    }
    //console.log(`prvni ${board[0][0]} ${board[1][0]} ${board[0][1]}`)
    //console.log(getBoard(board,xSize,ySize))
    var itsFree = false
    var score = 0
    var enemyPieces = 0
    for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[0].length; y++) {
            if (board[x][y] === 0) {
                itsFree = true
            }
            if (board[x][y] == 2) {
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
            if (1 == board[x][y]){
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
    //if (longestLenght.length >= winSize) {
    //    var factor = longestLenght.player === 1? 1:-1
    //    score=factor*100-depth*factor
    //}
    //analizeTime+=(performance.now()-t0)
    
    return {
        longestLenght,
        score,
        itsFree
    } 
    //IS FULL?
}

function length(board: number[][], x: number, y: number, factorX: number, factorY: number, xSize: number, ySize:number) {
    var lenght = 1
    //var curX = x+factorX
    //var curY = y+factorY
    while(true) {
        //Check if out of board
        //console.log(`${x+factorX} ${y+factorY}; ${factorX} ${factorY}`)
        
        if (board[x][y]===0) {break}
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
        
            if (board[x][y]===1) {
                output+= `⚐ `
            }
            else if (board[x][y]===2) {
                output += `⚑ `
            }
            else {
                output += `0 `
            }
            //output+=`${board[x][y]} `
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
    /*
    numberOfChecks++
    var output = analizeBoard(board, maximizingPlayer, xSize, ySize, winLenght, depth)
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
    if (output.longestLenght.length >= winLenght || depth > Infinity) {
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
                    if (depth < 17) {
                        var curCache: Cache = {
                        score: score.score,
                        player: maximizingPlayer, //?
                        x, y //?
                    }
                    cache[id] = curCache
                    }
                    
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
                    if (depth < 17) {
                        var curCache: Cache = {
                        score: score.score,
                        player: maximizingPlayer, //?
                        x, y //?
                        }
                    cache[id] = curCache
                    }
                    
                    
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
    }*/
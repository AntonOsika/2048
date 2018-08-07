boxes = []

function nEmpty() {
    var n = 0
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (boxes[i][j] == 0) {
                n++
            }
        }
    }
    return n
}

function addBox() {

    boxIdx = int(random() * nEmpty(boxes))
    counter = 0
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (boxes[i][j] == 0) {
                if (counter == boxIdx) {
                    if (random() < 0.8) {
                        boxes[i][j] = 2
                    }
                    else {
                        boxes[i][j] = 4
                    }
                    return
                }
                counter++
            }
        }
    }
}

function setup() {
    // Sets the screen to be 720 pixels wide and 400 pixels high
    createCanvas(720, 720);
    for (var i = 0; i < 4; i++) {
        boxes[i] = []
        for (var j = 0; j < 4; j++) {
            boxes[i][j] = 0
        }
    }
    addBox()
    addBox()
    main()
}

function numberToColor(number) {
    colors = ['rgba(238, 228, 218, 0.35)', '#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f65e3b', '#edcf72', '#edc850', '#edc900', '#edc950']

    if (log(number)/log(2) > (colors.length-1)) {
        return ["#ccccccc"]
    }

    else {
        id=log(number)/log(2)
        return colors[id]
    }

}

function canMove() {
    // check for empty spaces
    // check for neighbouring values bricks
    neighbours = [[0,-1],[0,1],[-1,0],[1,0]]
    hasNeighbour = 0
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            for (var neighbour = 0; neighbour < 4; neighbour++) {
                currentNeighbour=neighbours[neighbour]
                try {
                    if (boxes[i][j]==boxes[i+currectNeighbour[0]][j+currentNeighbour[1]]) {
                        hasNeighbour++
                    }
                } catch (error) {

                }
            }
        }
    }
    return (nEmpty>0 || hasNeighbour>0)
}

function draw() {
    // Set the background to black and turn off the fill color
    bgColor = '#bbada0'
    background(bgColor);
    noFill();

    // The two parameters of the point() method each specify
    // coordinates.
    // The first parameter is the x-coordinate and the second is the Y
    stroke(255);
    width = 720.0 / 4
    height = 720.0 / 4
    fontSize = 120

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (boxes[i][j] > 0) {
                x = i * width
                y = j * height
                fill(numberToColor(boxes[i][j]))
                rect(x, y, width, height)
                textSize(fontSize)
                textAlign(CENTER);

                fill(bgColor)
                text(str(boxes[i][j]), x + width / 2, y + height / 2 + fontSize / 4)
            }
        }
    }
}

// Planering
// 1. FIxa move functionen
// 2.

// move boxes based on direction from keys
function shiftBoxes(xstart, xstop, dx, ystart, ystop, dy) {
    // dx/dy defines in what direction we shift
    console.assert(dx == 0 || dy == 0)
    // Get direction we have to loop in:
    iInc = xstart < xstop ? 1 : -1
    jInc = ystart < ystop ? 1 : -1
    // Loop over boxes
    for (var i = xstart; i != xstop; i += iInc) {
        for (var j = ystart; j != ystop; j += jInc) {
            // Check if free:
            if (boxes[i + dx][j + dy] == 0) {
                // Move box:
                boxes[i + dx][j + dy] = boxes[i][j]
                boxes[i][j] = 0
            }
        }
    }
}

// create a new nu
function mergeBoxes(xstart, xstop, dx, ystart, ystop, dy) {
    console.assert(dx == 0 || dy == 0)
    iInc = xstart < xstop ? 1 : -1
    jInc = ystart < ystop ? 1 : -1
    for (var i = xstart; i != xstop; i += iInc) {
        for (var j = ystart; j != ystop; j += jInc) {
            // If same, merge
            if (boxes[i + dx][j + dy] == boxes[i][j]) {
                boxes[i + dx][j + dy] += boxes[i][j]
                boxes[i][j] = 0
            }
        }
    }
}

function move(xstart, xstop, dx, ystart, ystop, dy) {
    for (var i = 0 ; i < 4 ; i++) {
        shiftBoxes(xstart, xstop, dx, ystart, ystop, dy)
    }
    mergeBoxes(xstart, xstop, dx, ystart, ystop, dy)
    for (var i = 0 ; i < 4 ; i++) {
        shiftBoxes(xstart, xstop, dx, ystart, ystop, dy)
    }
    addBox()
}

function keyListener(keyCode) {

    //xstart, xstop, dx, ystart, ystop, dy
    if (keyCode === LEFT_ARROW) {
        move(1, 4, -1, 0, 4, 0)
    } else if (keyCode === RIGHT_ARROW) {
        move(2, -1, 1, 0, 4, 0)
    } else if (keyCode === UP_ARROW) {
        move(0, 4, 0, 1, 4, -1)
    } else if (keyCode === DOWN_ARROW) {
        move(0, 4, 0, 2, -1, 1)
    }
    return false
}

document.addEventListener('keydown', e => keyListener(e.keyCode))

function isDone() {
    var done = false
    for (var i = xstart; i != xstop; i += iInc) {
        for (var j = ystart; j != ystop; j += jInc) {
            if (boxes[i][j] == 0) {
                done = true
            }
        }
    }
    return done
}


// reward function
// state grid logarithmic values of position of the items
// [1, 2, 3, 4]
// [0, 0, 2, 1]
// [0, 5, 3, 1]
// [0, 0, 1, 2]
// action
// left, right, up, down
// only actions that are available
// reward
// sum previous grid state - current grid state
// alive = 0, dead = -1

// current state
// simulate action
// move left
// calculate reward
// simulate action
// calculate reward

// random action works for 103 timesteps

// policy
// slumpmässig action vs policy

// i början är det 90% att slumpa
// över tiden går det ner till 0 runt 100 tidssteg.

// off policy learning

// exploration =>

// hög epsilon minskande över tid





function bestMove(N, R) {
    let best = 0
    let bestVal = 0
    for (let i in N) {
        if (N[i] == 0) {
            continue
        }
        let val = R[i]/N[i]
        if (val > bestVal) {
            bestVal = val
            best = i
        }
    }
    if (bestVal == 0) {
        return int(random()*N.length)
    }
    return i
}

function getReward(s) {
    // let flat = [].concat.apply([], boxes)
    // Math.max(...flat)
    b = deepCopy(boxes)
    console.log(b, s)
    console.log(nEmpty(b), nEmpty(s))
    return nEmpty(b) - nEmpty(s)
}

function deepCopy(s) {
    r = []
    for (i in s) {
        r.push(s[i].slice())
    }
    return r
}

function main() {
    console.log("running RL")

    // Monte Carlo algorithm
    N = {} // number of attempts
    R = {} // sum of reward after certain (s, a)-pair

    // Q(s, a) = R(s, a)/N(s, a)


    nEpisodes = 10
    eps = 0.05
    moves = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW]


    for (var i = 0 ; i < nEpisodes ; i++) {
        let memory = []
        while (nEmpty() > 0) {
            console.log(nEmpty())
            var a
            if (N[boxes] == undefined) {
                a = int(random()*4)
            } else {
                if (random() < eps) {
                    a = int(random()*4)
                } else {
                    a = bestMove(N[boxes], R[boxes])
                }
            }

            let s = deepCopy(boxes)
            keyListener(moves[a])
            let r = getReward(s)
            console.log('reward', r)

            memory.push([s, a, r])

        }

        reward = 0
        for (let i = memory.length - 1 ; i >= 0 ; i--) {
            let [s, a, r] = memory[i]
            reward += r
            if (N[s] == undefined) {
                N[s] = [0, 0, 0, 0]
                R[s] = [0, 0, 0, 0]
            }
            N[s][a] += 1
            R[s][a] += reward
        }
        console.log("Reward:", reward)
        console.log(memory)
    }
}
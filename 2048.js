boxes = []
hipsterCount = 0;

function setup() {
    // Sets the screen to be 720 pixels wide and 400 pixels high
    createCanvas(720, 720);
    resetState()

    // main()
}

function nEmpty(b) {
    var n = 0
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (b[i][j] == 0) {
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

function resetState() {
    for (var i = 0; i < 4; i++) {
        boxes[i] = []
        for (var j = 0; j < 4; j++) {
            boxes[i][j] = 0
        }
    }
    addBox()
    addBox()
}

function rm() {
    setTimeout(rm, 100)
    randomMove()
}

function numberToColor(number) {
    colors = ['rgba(238, 228, 218, 0.35)', '#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f65e3b', '#edcf72', '#edc850', '#edc900', '#edc950']

    if (log(number) / log(2) > (colors.length - 1)) {
        return "#ccccccc"
    }

    else {
        id = log(number) / log(2)
        return colors[id]
    }

}

function canMove() {
    // check for empty spaces
    // check for neighbouring values bricks
    neighbours = [[0, -1], [0, 1], [-1, 0], [1, 0]]
    hasNeighbour = 0
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            for (var neighbour = 0; neighbour < 4; neighbour++) {
                currentNeighbour = neighbours[neighbour]
                if (i + currentNeighbour[0] > 0 && i + currentNeighbour[0] < 4 && j + currentNeighbour[1] > 0 && j + currentNeighbour[1] < 4) {
                    if (boxes[i][j] == boxes[i + currentNeighbour[0]][j + currentNeighbour[1]]) {
                        hasNeighbour++
                    }
                }
            }
        }
    }
    return (nEmpty(boxes) > 0 || hasNeighbour > 0)
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
    width = 720.0 / 4 - 20
    height = 720.0 / 4 - 20
    fontSize = 120

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (boxes[i][j] > 0) {
                x = i * (width + 20)
                y = j * (height + 20)
                fill(numberToColor(boxes[i][j]))
                rect(x + 10, y + 10, width, height)
                textSize(fontSize)
                textAlign(CENTER);

                fill(bgColor)
                text(str(boxes[i][j]), 10 + x + width / 2, 10 + y + height / 2 + fontSize / 4)
            }
        }
    }
}

function deepCompare(a, b) {
    equalValues = 0
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (a[i][j] == b[i][j]) {
                equalValues++
            }
        }
    }
    return (equalValues == 16)
}


function yoloMove() {
    oldstate = deepCopy(boxes)
    keyListener(RIGHT_ARROW)

    //check previous move
    // if previous move is up
    // make next move right
    // vice versa

    if (deepCompare(oldstate, boxes)) {
        keyListener(UP_ARROW)
        if (deepCompare(oldstate, boxes)) {
            keyListener(LEFT_ARROW)
            if (deepCompare(oldstate, boxes)) {
                keyListener(DOWN_ARROW)
            }
        }
    }
}

function hipsterMove() {
    oldstate = deepCopy(boxes)

    while (hipsterCount < 5) {
        keyListener(RIGHT_ARROW)
        hipsterCount++;
    }

    if (Math.random > 0.5) {
        keyListener(UP_ARROW)
    }
    else {
        keyListener(RIGHT_ARROW)
    }

    //check previous move
    // if previous move is up
    // make next move right
    // vice versa

    if (deepCompare(oldstate, boxes)) {
        if (Math.random > 0.5) {
            keyListener(UP_ARROW)
        }
        else {
            keyListener(RIGHT_ARROW)
        }

        if (deepCompare(oldstate, boxes)) {
            keyListener(LEFT_ARROW)
            if (deepCompare(oldstate, boxes)) {
                keyListener(DOWN_ARROW)
            }
        }
    }
}

function randomMove() {
    key = int(random() * 4)
    moves = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW]
    keyListener(moves[key])
}

function calcStat(totPoints, maxPoints) {
    totalSum = 0
    totalSumSq = 0
    totalMax = 0
    totalMaxSq = 0
    for (var i; i < totPoints.length; i++) {
        totalSum += totPoints[i]
        totalSumSq += totPoints[i]*totPoints[i]
        totalMax += maxPoints[i]
        totalMaxSq += maxPoints[i]*maxPoints[i]
    }
    let averageSum = totalSum / totPoints.length
    let averageMax = totalMax / maxPoints.length
    let stdSum = Math.sqrt(totalSumSq / totPoints.length - averageSum * averageSum)
    let stdMax = Math.sqrt(totalMaxSq / maxPoints.length - averageSum * averageSum)
    return  averageSum, stdSum, averageMax, stdMax
}

function singleEval(agentFun) {
    while (canMove()) {
        agentFun()
    }
    totalPoints, maxSingle = points()
    return totalPoints, maxSingle
}

function histCounts(x, nBins){

    let min_ = Number.POSITIVE_INFINITY  // Larger than largest possible score
    let max_ = 0


    for (var i; i < x.length; i++) {
            max_ = Math.max(elem, max_)
            min_ = Math.min(elem, min_)
    }

    let bins = Array(x.length)
    for (var i; i < x.length; i++) {
        bins[i] = Math.floor((x[i] - min_)/max_ * nBins)
    }

    bins = bins.sort()
    let histCounts = Array(nBins)

    for (var i; i < bins.length; i++) {
        histCounts[bins[i]] ++
    }

    return histCounts
}

function testHistCounts(){
    x = [0,0,0,1,1,2,3,4,4,4]
    nBins = 4
    histCounts = histCounts(x,nBins)


}



function batchEval2(agentFun, nGames) {
    const numberOfRuns = 100
    pointsLog=[]
    maxLog=[]
    for (var run = 0; run < numberOfRuns; run++) {
            totalPoints, maxSingle = singeEval(agentFun)
            pointsLog.push(totalPoints)
            maxLog.push(maxSingle)
        }
    averageSum, stdSum, averageMax, stdMax = calcStat(pointsLog,maxLog)
    console.log(agentFun.name, " points: ", averageSum, "std: ", stdSum, "max: ", averageMax, "maxstd: ", stdMax)
    }




function batchEval() {
    console.log("Lets evaluate")
    let totalpoints = 0
    for (var run = 0; run < 100; run++) {
        while (canMove()) {
            hipsterMove()
        }
        totalpoints += points()
        resetState()
    }
    console.log("hipsterMove: ", totalpoints)
    totalpoints = 0
    for (var run = 0; run < 100; run++) {
        while (canMove()) {
            yoloMove()
        }
        totalpoints += points()
        resetState()
    }
    console.log("yoloMove: ", totalpoints)
    totalpoints = 0
    for (var run = 0; run < 100; run++) {
        while (canMove()) {
            randomMove()
        }
        totalpoints += points()
        resetState()
    }
    console.log("randomMove: ", totalpoints)
}

function points() {
    let point = 0
    let maxSingle = 0
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            point = point + boxes[i][j]
            maxSingle=Math.max(maxSingle,boxes[i][j])
        }
    }
    return point, maxSingle
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
    oldstate = deepCopy(boxes)
    for (var i = 0; i < 4; i++) {
        shiftBoxes(xstart, xstop, dx, ystart, ystop, dy)
    }
    mergeBoxes(xstart, xstop, dx, ystart, ystop, dy)
    for (var i = 0; i < 4; i++) {
        shiftBoxes(xstart, xstop, dx, ystart, ystop, dy)
    }
    if (!deepCompare(oldstate, boxes)) {
        addBox()
    }
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
    let best = -1
    let bestVal = -int(1e10)
    for (let i in N) {
        if (N[i] == 0) {
            continue
        }
        let val = R[i] / N[i]
        if (val > bestVal) {
            bestVal = val
            best = -1
        }
    }
    if (best == -1) {
        return int(random() * N.length)
    }
    return i
}

function getReward(s) {
    let flat0 = [].concat.apply([], s)
    let flat1 = [].concat.apply([], boxes)
    return Math.max(...flat1) / Math.max(...flat0)
    // return nEmpty(boxes) - nEmpty(s)

    for (let i = 0; i < flat0.length; i++) {
        if (flat0[i] == 2) {
            reward -= 2
        }
        if (flat1[i] == 2) {
            reward += 2
        }
    }

    return reward

}

function deepCopy(s) {
    r = []
    for (i in s) {
        r.push(s[i].slice())
    }
    return r
}

function MC() {
    // Monte Carlo algorithm
    N = {} // number of attempts
    R = {} // sum of reward after certain (s, a)-pair

    // Used for:
    // Q(s, a) = R(s, a)/N(s, a)


    nEpisodes = 10000
    eps = 0.05
    let gamma = 0.9
    gamme = 1.0
    moves = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW]


    for (var i = 0; i < nEpisodes; i++) {
        let memory = []
        while (nEmpty(boxes) > 0) {
            var a
            if (N[boxes] == undefined) {
                a = int(random() * 4)
            } else {
                if (random() < eps) {
                    a = int(random() * 4)
                } else {
                    a = bestMove(N[boxes], R[boxes])
                }
            }

            let s = deepCopy(boxes)
            keyListener(moves[a])
            let r = getReward(s)

            memory.push([s, a, r])

        }

        reward = 0
        for (let i = memory.length - 1; i >= 0; i--) {
            let [s, a, r] = memory[i]
            reward = r + gamma * reward
            if (N[s] == undefined) {
                N[s] = [0, 0, 0, 0]
                R[s] = [0, 0, 0, 0]
            }
            N[s][a] += 1
            R[s][a] += reward
        }
        console.log("epsiode done")
        console.log("Reward:", reward)
        // console.log(memory)
        resetState()
    }
}

function makeInput(data) {
    var input = tf.tensor3d(data, [1, this.height, this.width])
    var flatten = input.reshape([1, this.width * this.height])
    input.dispose()
    return flatten
}

function makeBatchInput(data, batch_size = 64) {
    var input = tf.tensor4d(data, [batch_size, 1, this.height, this.width])
    var transposed = input.reshape([batch_size, this.width * this.height])
    input.dispose()
    return transposed
}

function make_model(lr) {

    const model = tf.sequential();

    model.add(tf.layers.dense({
        inputShape: [16],
        units: 64,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.dense({
        units: 64,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.dense({
        units: 64,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.dense({
        units: 4,
        kernelInitializer: 'VarianceScaling',
        activation: 'linear'
    }))
    model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(lr) });
    return model
}

function randint(i) {
    return int(random() * i)
}

class Memory {
    constructor() {
        this.memory = []
    }

    add(data) {
        this.memory.push(data)
    }

    sample(n) {
        let res = []
        for (let i = 0; i < n; i++) {
            res.push(this.memory[randint(this.memory.length)])
        }
        return res
    }
}

function datapoint(s, a, r, sp, done) {

    // NOTE done should probably be computed here
    // TODO:
    // Categorically encode state (log2(value) -> separate category)
    // Encode one hot either here or in model (using tf.one_hot)
    // Return values as dictionary
    // e.g.: [2, 4, 0, ...] -> (log2(...))
    // [1, 2, 0, ...] ->
    //[[0, 1, 0, ...], [0, 0, 1, ]]

    // check:
    let y = new Float32Array()


    // THIs should be in the model:
    tf.one_hot()

    for (let i=0; i< s.length; i++) {
        y.push(one_hot(log(s[i]) / log(2)))
    }

    //log(number) / log(2)


    //     indices = [0, 1, 2]
    // depth = 3
    // tf.one_hot(indices, depth)  # output: [3 x 3]
    // # [[1., 0., 0.],
    // #  [0., 1., 0.],
    // #  [0., 0., 1.]]



    return { "r": 1.0 }
}

function nextBatch(batchSize, data, index) {
    // TODO adapt this to let data be array of dictionary
    const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);

    for (let i = 0; i < batchSize; i++) {
        const idx = index();

        const image =
            data[0].slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
        batchImagesArray.set(image, i * IMAGE_SIZE);

        const label =
            data[1].slice(idx * NUM_CLASSES, idx * NUM_CLASSES + NUM_CLASSES);
        batchLabelsArray.set(label, i * NUM_CLASSES);
    }

    const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

    return { xs, labels };
}

async function main() {
    console.log("running RL")


    // Used for:
    // Q(s, a) = R(s, a)/N(s, a)

    // BIRGER: Define NN here that can take a "boxes" an return a vecotr
    // const model = tf.sequential();
    // model.add(tf.layers.dense({units: 50, inputShape: [1]}));
    // // model.add(tf.layers.dense({units: 50}));
    // // model.add(tf.layers.dense({units: 50, inputShape: [1]}));

    // // Prepare the model for training: Specify the loss and the optimizer.
    // model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // // Generate some synthetic data for training.
    // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    // // Train the model using the data.
    // model.fit(xs, ys, {epochs: 10}).then(() => {
    //     // Use the model to do inference on a data point the model hasn't seen before:
    //     // Open the browser devtools to see the output
    //     model.predict(tf.tensor2d([5], [1, 1])).print();
    // });


    let model = make_model(1.0)

    nEpisodes = 10000
    eps = 0.05
    let gamma = 0.9
    gamma = 1.0
    moves = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW]
    BATCH_SIZE = 1


    let memory = Memory()
    for (var i = 0; i < nEpisodes; i++) {

        let s = deepCopy(boxes)
        while (nEmpty(boxes) > 0) {
            var a
            if (N[boxes] == undefined) {
                a = int(random() * 4)
            } else {
                if (random() < eps) {
                    a = int(random() * 4)
                } else {
                    a = bestMove(N[boxes], R[boxes])
                }
            }

            keyListener(moves[a])
            let sp = deepCopy(boxes)
            let r = getReward(s)

            memory.add(datapoint(s, a, r, sp))
            s = sp
        }

        batch = nextBatch(memory.sample(BATCH_SIZE))

        let qs = model.predictOnBatch(batch.sps)

        // Fit to zero for 'done'
        for (i in batch.dones) {
            qs *= (1.0 - batch.dones[i])
        }

        const history = await model.fit(
            batch.xs, qs,
            {batchSize: BATCH_SIZE, epochs: 1}
        );


        // Train:

        // reward = 0
        // for (let i = memory.length - 1 ; i >= 0 ; i--) {
        //     let [s, a, r] = memory[i]
        //     reward = r + gamma*reward
        //     if (N[s] == undefined) {
        //         N[s] = [0, 0, 0, 0]
        //         R[s] = [0, 0, 0, 0]
        //     }
        //     N[s][a] += 1
        //     R[s][a] += reward
        // }
        // console.log("epsiode done")
        console.log("Reward:", reward)
        // console.log(memory)
        resetState()
    }
    nDistibution(N)
}

function nDistibution(N) {
    let n2 = 0;
    let n = 0;
    let nMax = 0;
    let counter = 0;

    for (s in N) {
        for (action in N[s]) {
            n += N[s][action]
            n2 += N[s][action] * N[s][action]
            if (N[s][action] > nMax) {
                nMax = N[s][action]
            }
            counter += 1
        }
    }
    let avg = 1.0 * n / counter
    let std = Math.sqrt(1.0 * n2 / counter - avg * avg)
    console.log([nMax, avg, std])

}

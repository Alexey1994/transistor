var currentMovableTransistor
var currentSelectedPort
var transistors = []

var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS(null, 'width', document.body.clientWidth + 'px')
    svg.setAttributeNS(null, 'height', document.body.clientHeight + 'px')
document.body.appendChild(svg)

function createConnection(fromPort, toPort) {
    var connection = {}
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    element.setAttributeNS(null, 'stroke', '#000')
    element.setAttributeNS(null, 'stroke-width', '1px')
    element.setAttributeNS(null, 'fill', '#000')

    svg.appendChild(element)

    connection.from = fromPort
    connection.to = toPort
    connection.element = element

    connection.from.connections.push(connection)
    connection.to.connections.push(connection)

    connection.signal = false

    return connection
}

function drawConnection(connection) {
    var x1 = connection.from.x
    var y1 = connection.from.y
    var x2 = connection.to.x
    var y2 = connection.to.y

    connection.element.setAttributeNS(null, 'd', 'M' + x1 + ' ' + y1 + ',' + x2 + ' ' + y2)
}

function createTransistorPort(place) {
    var port = {}
    var element = document.createElement('span')
    var style = element.style

    style.position = 'absolute'
    style.width = '10px'
    style.height = '10px'
    style.backgroundColor = '#aaa'

    switch(place) {
        case 'left':
            style.left = '0px'
            style.top = 'calc(100% - 15px)'
            break

        case 'right':
            style.right = '0px'
            style.top = 'calc(100% - 15px)'
            break

        case 'top':
            style.top = '0px'
            style.left = 'calc(50% - 5px)'
            break
    }

    element.onclick = function(event) {
        if(!currentSelectedPort) {
            currentSelectedPort = port
        }
        else if(port != currentSelectedPort){
            var connection = createConnection(currentSelectedPort, port)
            drawConnection(connection)

            currentSelectedPort = undefined
        }
        else {
            currentSelectedPort = undefined
        }

        event.stopPropagation()
    }

    port.element = element

    port.connections = []

    return port
}

function createTransistor() {
    var transistor = {}
    var element = document.createElement('span')
    var style = element.style

    style.position = 'absolute'
    style.width = '40px'
    style.height = '40px'
    style.border = '1px solid #fff'
    style.backgroundColor = '#666'

    element.onmousedown = function(event) {
        if(currentMovableTransistor) {
            return
        }

        currentMovableTransistor = transistor
        currentMovableTransistor.clickX = event.clientX - currentMovableTransistor.x
        currentMovableTransistor.clickY = event.clientY - currentMovableTransistor.y

        event.stopPropagation()
    }

    element.onmouseup = function(event) {
        if(transistor == currentMovableTransistor) {
            currentMovableTransistor = undefined
            event.stopPropagation()
        }
    }

    transistor.leftPort = createTransistorPort('left')
    transistor.rightPort = createTransistorPort('right')
    transistor.topPort = createTransistorPort('top')

    element.appendChild(transistor.leftPort.element)
    element.appendChild(transistor.rightPort.element)
    element.appendChild(transistor.topPort.element)
    document.body.appendChild(element)

    transistor.element = element

    transistor.x = 0
    transistor.y = 0

    return transistor
}

function drawTransistor(transistor, x, y) {
    var style = transistor.element.style

    style.left = x + 'px'
    style.top = y + 'px'

    transistor.x = x
    transistor.y = y

    transistor.leftPort.x = x + 5
    transistor.leftPort.y = y + 30

    transistor.topPort.x = x + 20
    transistor.topPort.y = y + 5

    transistor.rightPort.x = x + 35
    transistor.rightPort.y = y + 30
}

document.body.onmousemove = function(event) {
    if(currentMovableTransistor) {
        drawTransistor(
            currentMovableTransistor,
            event.clientX - currentMovableTransistor.clickX,
            event.clientY - currentMovableTransistor.clickY
        )

        currentMovableTransistor.leftPort.connections
            .forEach(function(connection) {
                drawConnection(connection)
            })

        currentMovableTransistor.rightPort.connections
            .forEach(function(connection) {
                drawConnection(connection)
            })

        currentMovableTransistor.topPort.connections
            .forEach(function(connection) {
                drawConnection(connection)
            })
    }
}

function addTransistor() {
    var transistor = createTransistor()
    drawTransistor(transistor, 100, 100)
    transistors.push(transistor)
}

function execute() {
    var powerConnections = []

    transistors
        .forEach(function(transistor){
            transistor.leftPort.connections
                .forEach(function(connection){
                    if(connection.from == powerSourcePlusPort_ || connection.to == powerSourcePlusPort_)
                        powerConnections.push(connection)
                })

            transistor.rightPort.connections
                .forEach(function(connection){
                    if(connection.from == powerSourcePlusPort_ || connection.to == powerSourcePlusPort_)
                        powerConnections.push(connection)
                })

            transistor.topPort.connections
                .forEach(function(connection){
                    if(connection.from == powerSourcePlusPort_ || connection.to == powerSourcePlusPort_)
                        powerConnections.push(connection)
                })
        })

    console.log(powerConnections)

    powerConnections
        .forEach(function(connection){
            console.log(connection)
            connection.element.setAttributeNS(null, 'stroke', '#0f0')
            connection.signal = true
        })
}

var powerSource = document.createElement('span')
    var style = powerSource.style
    style.position = 'absolute'
    style.width = '20px'
    style.height = '60px'
    style.top = '20px'
    style.left = 'calc(50% - 10px)'
    style.backgroundColor = '#666'

    var powerSourcePlusPort_ = {
        connections: [],
        x: document.body.clientWidth / 2,
        y: 80
    }
    var powerSourcePlusPort = document.createElement('span')
        var style = powerSourcePlusPort.style
        style.position = 'absolute'
        style.width = '10px'
        style.height = '5px'
        style.top = '80px'
        style.left = 'calc(50% - 5px)'
        style.backgroundColor = '#666'

        powerSourcePlusPort.onclick = function(event) {
            if(!currentSelectedPort) {
                currentSelectedPort = powerSourcePlusPort_
            }
            else if(powerSourcePlusPort_ != currentSelectedPort){
                var connection = createConnection(currentSelectedPort, powerSourcePlusPort_)
                drawConnection(connection)

                currentSelectedPort = undefined
            }
            else {
                currentSelectedPort = undefined
            }

            event.stopPropagation()
        }
    document.body.appendChild(powerSourcePlusPort)
    powerSourcePlusPort_.element = powerSourcePlusPort
document.body.appendChild(powerSource)

var addButton = document.createElement('button')
    var style = addButton.style
    style.position = 'absolute'
    style.left = '20px'
    style.top = '20px'

    addButton.onclick = addTransistor
    addButton.innerHTML = 'Добавить'
document.body.appendChild(addButton)

var executeButton = document.createElement('button')
    var style = executeButton.style
    style.position = 'absolute'
    style.left = '20px'
    style.top = '60px'

    executeButton.onclick = execute
    executeButton.innerHTML = 'Выполнить'
document.body.appendChild(executeButton)

/*
var transistor = createTransistor()
drawTransistor(transistor, 100, 100)

var transistor2 = createTransistor()
drawTransistor(transistor2, 100, 100)*/
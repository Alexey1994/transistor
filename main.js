var currentMovableTransistor
var currentSelectedPort

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
    style.backgroundColor = 'green'

    switch(place) {
        case 'left':
            style.left = '0px'
            style.top = 'calc(50% - 5px)'
            break

        case 'right':
            style.right = '0px'
            style.top = 'calc(50% - 5px)'
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
    style.backgroundColor = 'red'

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
    transistor.leftPort.y = y + 15

    transistor.topPort.x = x + 20
    transistor.topPort.y = y + 5

    transistor.rightPort.x = x + 35
    transistor.rightPort.y = y + 15
}

document.body.onmousemove = function(event) {
    if(currentMovableTransistor) {
        drawTransistor(
            currentMovableTransistor,
            event.clientX - currentMovableTransistor.clickX,
            event.clientY - currentMovableTransistor.clickY
        )

        transistor.leftPort.connections
            .forEach(function(connection) {
                drawConnection(connection)
            })

        transistor.rightPort.connections
            .forEach(function(connection) {
                drawConnection(connection)
            })

        transistor.topPort.connections
            .forEach(function(connection) {
                drawConnection(connection)
            })
    }
}

var transistor = createTransistor()
drawTransistor(transistor, 100, 100)

var transistor2 = createTransistor()
drawTransistor(transistor2, 100, 100)
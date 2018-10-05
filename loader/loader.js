function sendRequest(method, path, data, onsuccess, onerror) {
    var request = new XMLHttpRequest()

    if(!onsuccess && !onerror) {
        request.open(method, path, false)
        request.send(data)

        return request.responseText
    }

    request.open(method, path, true)
        
    request.onload = function() {
        if(request.status == 200) {
            if(onsuccess)
                onsuccess(request.responseText)
        }
        else {
            if(onerror)
                onerror(request.responseText, request.status)
        }
    }

    request.send(data)
}

function get(path, onsuccess, onerror) {
    return sendRequest('GET', path, null, onsuccess, onerror)
}

function send(path, data, onsuccess, onerror) {
    return sendRequest('POST', path, data, onsuccess, onerror)
}

var module = {
    directory: [],
    path: ''
}

var loadedModules = {
    '': module
}

function copyDirectory(directory) {
    return directory
        .map(function(tail) { 
            return tail
        })
}

function getModuleDirectory(path, module) {
    var resultDirectory

    if(path.length && (path[0] == '.' || path[0] == '..')){
        if(path[0] == '.')
            path.splice(0, 1)
        
        resultDirectory = copyDirectory(module.directory)
    }
    else
        resultDirectory = []

    for(var i = 0; i < path.length - 1; ++i) {
        var tail = path[i]

        if(tail == '..') {
            if(resultDirectory.length)
                resultDirectory.splice(resultDirectory.length - 1, 1)
        }
        else
            resultDirectory.push(tail)
    }

    return resultDirectory
}

function getModulePath(directory, path) {
    var fileName = path[path.length - 1]

    if(!directory.length)
        return fileName

    return directory
        .reduce(function(tail1, tail2) {
            return tail1 + '/' + tail2
        })
        + '/' + fileName
}

function _require(path, module) {
    path = path.split('/')
    var moduleDirectory = getModuleDirectory(path, module)

    var moduleSpace = {
        directory: moduleDirectory,
        path: getModulePath(moduleDirectory, path)
    }

    if(!loadedModules[moduleSpace.path]) {
        var script = get(moduleSpace.path)

        function createModule() {
            var module = moduleSpace

            function require(path){
                return _require(path, module)
            }

            eval(script)
        }

        createModule()
        loadedModules[moduleSpace.path] = moduleSpace
    }

    return loadedModules[moduleSpace.path].exports
}

function require(path){
    return _require(path, module)
}
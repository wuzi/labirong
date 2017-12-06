const fs = require('fs');

var load = function(file) {
    var data = fs.readFileSync(`${__dirname}/maps/${file}`, 'utf8');

    var tiles = [];
    var lines = data.split('\n');

    for(var i = 0; i < lines.length; i++) {
        var line = lines[i];

        for(var j = 0; j < line.length; j++) {
            if (line.charCodeAt(j) == 13) continue;
            tiles.push({x: j * 16, y: i * 16, type: parseInt(line[j])});
        }                
    }

    return tiles;
}

exports.load = load;
var fs = require("fs");
var file = fs.readFileSync('data/longLyrics.json');
var content = JSON.parse(file);

var data = [];

/*** DATA MODEL ***/
// {
//     id: '1.01',
//     lyrics: [
//         {
//             line_number: 00,
//             line: [
//                 {
//                     character: '',
//                     lyric: ''
//                 }
//             ]
//         }
//     ]
// };

content.forEach(function(each){
    thisId = each.id;
    thisLineNumber = each.line_number;
    thisCharacter = each.character;
    thisLyric = each.words;

    //does this track exist?
    var thisTrack = data.filter(function(track){
        return (track.id === thisId);
    });
    
    if(thisTrack.length === 1){
        //if yes, does this line exist?
        var thisLine = thisTrack[0].lyrics.filter(function(line){
            return (line.line_number === thisLineNumber);
        });
        
        if(thisLine.length === 1){
            //if yes, add lyric to line
            var newLyric = {
                "character": thisCharacter,
                "lyric": thisLyric
            }
            thisLine[0].line.push(newLyric);
        } else {
            // if no, add line with lyric
            var newLine = {
                "line_number": thisLineNumber,
                "line": [
                    {
                        "character": thisCharacter,
                        "lyric": thisLyric
                    }
                ]
            }
            thisTrack[0].lyrics.push(newLine);
        }
    } else {
        //if no, add track with line and lyric
        var newTrack = {
            "id": thisId,
            "lyrics": [
                {
                    "line_number": thisLineNumber,
                    "line": [
                        {
                            "character": thisCharacter,
                            "lyric": thisLyric
                        }                        
                    ]
                }
            ]
        };
        data.push(newTrack);        
    }
});

var file = fs.readFileSync('data/albumTracks.json');
var tracks = JSON.parse(file);

tracks.forEach(function(track){
    var trackId = track.id;
    var lyrics = data.filter(function(lyricTrack){
        return (lyricTrack.id == trackId);
    });
    track.lyrics = lyrics[0].lyrics;
});

tracks = JSON.stringify(tracks);

fs.writeFile("data/albumTrackLyrics.json",tracks);
var fs = require('fs');
var { default: srtParser2 } = require("srt-parser-2")

var XML_PREFIX = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<tt:tt xmlns:tt="http://www.w3.org/ns/ttml"><tt:head></tt:head><tt:body><tt:div>\n';
var XML_SUFFIX = '\n</tt:div></tt:body></tt:tt>';

var parser = new srtParser2()
var args = process.argv.slice(2);
var inputFile = args[0];
var inputData = fs.readFileSync(inputFile, { encoding: 'utf8' });

var result = parser.fromSrt(inputData);

console.log(subsToXML(result));

function subsToXML(subsArray) {
    return XML_PREFIX + subsArray.map(function(sub) {
        var aa = sub.content;
        return '<p begin="' + sub.startTime + '" id="' + sub.id + '" end="' + sub.endTime + '">' + sub.text.replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</p>';
    }).join('\n') + XML_SUFFIX;
}

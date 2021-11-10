var fs = require('fs');
var { default: srtParser2 } = require("srt-parser-2")

var parser = new srtParser2()
var args = process.argv.slice(2);
var inputFile = args[0];
var inputData = fs.readFileSync(inputFile, { encoding: 'utf8' });

var result = parser.fromSrt(inputData);

var paths = args[0].split("_");
var filename = paths[paths.length - 1];
var filenames = filename.split(".");
var lang = filenames[0].toLowerCase();

var XML_PREFIX = "<?xml version='1.0' encoding='UTF-8' ?>\n";
    XML_PREFIX += "<tt xmlns='http://www.w3.org/ns/ttml' xml:lang='" + lang + "' xmlns:ttm='http://www.w3.org/ns/ttml#metadata' xmlns:tts='http://www.w3.org/ns/ttml#styling' xmlns:ttp='http://www.w3.org/ns/ttml#parameter'>\n";
    XML_PREFIX += "\t<head>\n";
    XML_PREFIX += "\t\t<styling>\n";
    XML_PREFIX += "\t\t\t<style xml:id='ts0' />\n";
    XML_PREFIX += "\t\t\t<style xml:id='ts1' tts:fontWeight='normal' tts:fontStyle='italic' />\n";
    XML_PREFIX += "\t\t\t<style xml:id='ps0' tts:textAlign='center' />\n";
    XML_PREFIX += "\t\t</styling>\n";
    XML_PREFIX += "\t\t<layout>\n";
    XML_PREFIX += "\t\t\t<region xml:id='r0' tts:origin='5% 5%' tts:extent='90% 90%' tts:displayAlign='after' />\n";
    XML_PREFIX += "\t\t</layout>\n";
    XML_PREFIX += "\t</head>\n";
    XML_PREFIX += "\t<body>\n";
    XML_PREFIX += "\t\t<div style='ts0'>\n";

var XML_SUFFIX = "\n</div>";
    XML_SUFFIX += "</body>";
    XML_SUFFIX += "</tt>";

console.log(subsToXML(result));

function subsToXML(subsArray) {
    return XML_PREFIX + subsArray.map(function(sub) {
        var aa = sub.text.replace(/(?:\r\n|\r|\n)/g, '<br/>');

        aa = aa.replace(/^\s+|\s+$/gm,'');

        var spanStyle = "ts0";
        let italic = aa.search("<i>");

        if(italic != -1) {
            aa = aa.replace("<i>", "");            
            aa = aa.replace("</i>", "");
            spanStyle = "ts1";
        }
        
        aa = "\n\t\t\t\t<span style='" + spanStyle + "' xml:space='preserve'>" + aa;
        aa = aa.replace("<br/>", "</span>\n\t\t\t\t<br />\n\t\t\t\t<span style='" + spanStyle + "' xml:space='preserve'>");
        aa = aa + "</span>\n\t\t\t\t<br />\n";  
        
        var s = sub.startTime;
        var e = sub.endTime;

        s = s.replace(/,/g, '.');
        e = e.replace(/,/g, '.');

        return "\t\t\t<p region='r0' begin='" + s + "' end='" + e + "' style='ps0'>" + aa + "\t\t\t</p>";
    }).join('\n') + XML_SUFFIX;
}

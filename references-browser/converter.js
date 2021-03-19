var BOOK_NAMES = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation"
];
// array based on transforming the file `key_english.json` in `bible-database` repo
var BOOK_ABBREVIATIONS = [
    "Gen",
    "Exod",
    "Lev",
    "Num",
    "Deut",
    "Josh",
    "Judg",
    "Ruth",
    "1Sam",
    "2Sam",
    "1Kgs",
    "2Kgs",
    "1Chr",
    "2Chr",
    "Ezra",
    "Neh",
    "Esth",
    "Job",
    "Ps",
    "Prov",
    "Eccl",
    "Song",
    "Isa",
    "Jer",
    "Lam",
    "Ezek",
    "Dan",
    "Hos",
    "Joel",
    "Amos",
    "Obad",
    "Jonah",
    "Mic",
    "Nah",
    "Hab",
    "Zeph",
    "Hag",
    "Zech",
    "Mal",
    "Matt",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Rom",
    "1Cor",
    "2Cor",
    "Gal",
    "Eph",
    "Phil",
    "Col",
    "1Thess",
    "2Thess",
    "1Tim",
    "2Tim",
    "Titus",
    "Phlm",
    "Heb",
    "Jas",
    "1Pet",
    "2Pet",
    "1John",
    "2John",
    "3John",
    "Jude",
    "Rev"
];
// array based on cross_references.txt and transforming it with sublime and sort and uniq tools and manual work
var fs = require("fs");
// from reference-browser App.tsx
function run() {
    // converter t_kjv.json cross_references.txt kjv_and_references.json
    var scriptureFile = process.argv[2];
    var referencesFile = process.argv[3];
    var generatedFile = process.argv[4];
    console.log(scriptureFile, referencesFile, generatedFile);
    var scriptureContentRaw = fs.readFileSync(scriptureFile, 'utf8');
    var generated = { chapters: {}, references: {} };
    var scriptureContent = JSON.parse(scriptureContentRaw);
    var chapters = {};
    for (var _i = 0, _a = scriptureContent['resultset']['row']; _i < _a.length; _i++) {
        var line = _a[_i];
        var fields = line['field'];
        var bookIndex = fields[1];
        var chapterIndex = fields[2];
        var verseIndex = fields[3];
        var text = fields[4];
        var chapterId = '' + BOOK_ABBREVIATIONS[bookIndex - 1] + '.' + chapterIndex;
        if (chapters[chapterId] === undefined) {
            chapters[chapterId] = {
                name: BOOK_NAMES[bookIndex - 1] + ' ' + chapterIndex,
                book: BOOK_NAMES[bookIndex - 1],
                index: chapterIndex,
                verses: []
            };
        }
        chapters[chapterId].verses.push(text);
    }
    var referencesRaw = fs.readFileSync(referencesFile, 'utf8');
    var references = {};
    for (var _b = 0, _c = referencesRaw.split('\n').slice(1); _b < _c.length; _b++) {
        var line = _c[_b];
        var tokens = line.split(/[ \t\n]/);
        if (tokens.length < 2) {
            continue;
        }
        var from = tokens[0];
        var to = tokens[1];
        // console.log(line);
        if (to.indexOf('-') != -1) {
            // TODO to_from-to_to
            continue;
        }
        var votesRaw = tokens[2];
        if (votesRaw !== undefined && !isNaN(votesRaw)) {
            var votes = parseInt(votesRaw);
            if (votes > 0) {
                if (references[from] === undefined) {
                    references[from] = [];
                }
                references[from].push(to);
            }
        }
    }
    generated.chapters = chapters;
    generated.references = references;
    var generatedJson = JSON.stringify(generated);
    fs.writeFileSync(generatedFile, generatedJson);
}
;
run();

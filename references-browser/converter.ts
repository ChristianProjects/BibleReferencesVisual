

const BOOK_NAMES = [   
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

const BOOK_ABBREVIATIONS = [
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

let fs = require("fs");

interface Chapter {
  name: string;
  book: string;
  index: number;
  verses: string[];
  // references: {[a: string]: string[]}
}

interface ScriptureContentAndReferencesFormat {
  chapters: {[a: string]: Chapter},
  references: {[a: string]: string[]}
}
// from reference-browser App.tsx

function run() {
    // converter t_kjv.json cross_references.txt kjv_and_references.json
    let scriptureFile = process.argv[2];
    let referencesFile = process.argv[3];
    let generatedFile = process.argv[4];
    console.log(scriptureFile, referencesFile, generatedFile);

    let scriptureContentRaw = fs.readFileSync(scriptureFile, 'utf8');
    var generated: ScriptureContentAndReferencesFormat = {chapters: {}, references: {}};
    let scriptureContent = JSON.parse(scriptureContentRaw);
    var chapters: {[a:string]: Chapter} = {};

    for (var line of scriptureContent['resultset']['row']) {
        var fields = line['field'];
        let bookIndex = fields[1];
        let chapterIndex = fields[2];
        let verseIndex = fields[3];
        let text = fields[4];
        
        let chapterId = '' + BOOK_ABBREVIATIONS[bookIndex - 1] + '.' + chapterIndex;
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
    
    let referencesRaw = fs.readFileSync(referencesFile, 'utf8');
    var references: {[a:string]: string[]} = {}
    for (var line of referencesRaw.split('\n').slice(1)) {
        let tokens = line.split(/[ \t\n]/);
        if (tokens.length < 2) {
            continue;
        }
        let from = tokens[0];
        let to = tokens[1];
        // console.log(line);
        if (to.indexOf('-') != -1) {
            // TODO to_from-to_to
            continue;
        }
        let votesRaw = tokens[2];
        if (votesRaw !== undefined && !isNaN(votesRaw)) {
            let votes = parseInt(votesRaw);
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

    let generatedJson = JSON.stringify(generated);
    fs.writeFileSync(generatedFile, generatedJson);
};

run();

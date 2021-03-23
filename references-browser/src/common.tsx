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


// types

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

enum ChapterMode {
  Maximized,
  MinimizedToTitle,
  MinimizedToVerse
};

interface State {
  openChapters: {[a: string]: number},
  levelChapters: string[][],
  chapterModes: {[a: string]: ChapterMode},
  mode: ChapterMode,
  selectedVerses: {[a: string]: number},
  referencedVerses: {[a: string]: Set<number>},
  rootChapter: string
}

// var testContentAndReferences: ScriptureContentAndReferencesFormat = {
//   chapters: {
//     'a.1': {
//       name: 'a 1',
//       book: 'a',
//       index: 1,
//       verses: ['example 1', 'example 2', 'example 3'],
//       // references: {
//         // 1: ['b 1', 'b 2']
//       // }
//     },
//     'b.1': {
//       name: 'b 1',
//       book: 'b',
//       index: 1,
//       verses: ['example 1'],
//       // references: {
//         // 1: ['a 1', 'c 1']
//       // }
//     },
//     'b.2': {
//       name: 'b 2',
//       book: 'b',
//       index: 1,
//       verses: ['example 1'],
//       // references: {
//         // 1: ['a 1']
//       // }
//     },
//     'c.1': {
//       name: 'c 1',
//       book: 'c',
//       index: 1,
//       verses: ['example 1'],
//       // references: {
//         // 1: ['b 1']
//       // }
//     }
//   },
//   references: {
//     'a.1.1': ['b.1.1', 'b.2.1'],
//     'b.1.1': ['a.1.1', 'c.1.1'],
//     'b.1.2': ['a.1.1'],
//     'c.1.1': ['a.1.1']
//   }
// };


// (window as any).scriptureContentAndReferencesKJV = scriptureContentAndReferencesKJV;



var state_first: State = {
  openChapters: {'Ps.22': 0},
  levelChapters: [['Ps.22']],
  chapterModes: {'Ps.22': ChapterMode.Maximized},
  mode: ChapterMode.Maximized,
  selectedVerses: {},
  referencedVerses: {},
  rootChapter: 'Ps.22'
};
console.log(state_first);

function generateState(rootChapter: string): State {
  var state: State = {
    openChapters: {},
    levelChapters: [[rootChapter]],
    chapterModes: {},
    mode: ChapterMode.Maximized,
    selectedVerses: {},
    referencedVerses: {},
    rootChapter: rootChapter
  };
  state.openChapters[rootChapter] = 0;
  state.chapterModes[rootChapter] = ChapterMode.Maximized;
  return state;
}

var state = generateState('Ps.22');

function chapterForQuery(query: string, data: ScriptureContentAndReferencesFormat): string | undefined {
  if (data.chapters[query] !== undefined) {
    return query;
  } else {
    // Psalm 22 -> Ps.22
    let tokens = query.split(/[ ]/);
    var chapterQuery = tokens[0];
    var countQuery = 1;
    // console.log(tokens);
    if (tokens.length >= 2) {
      try {
        countQuery = parseInt(tokens[1]);
        if (isNaN(countQuery)) {
          countQuery = 1;
        }
      } catch {
        countQuery = 1; // default count: Ps.1
      }
    }

    var i = 0;
    for (var name of BOOK_NAMES) {
      // console.log(name, chapterQuery, countQuery);
      if (name.slice(0, chapterQuery.length) === chapterQuery) {
        // console.log(BOOK_ABBREVIATIONS[i] + '.' + countQuery);
        return BOOK_ABBREVIATIONS[i] + '.' + countQuery;
      }
      i += 1;
    }
    return undefined;
  }
}

export {BOOK_NAMES, BOOK_ABBREVIATIONS, ChapterMode, generateState, chapterForQuery, state};

export type {ScriptureContentAndReferencesFormat, Chapter, State};


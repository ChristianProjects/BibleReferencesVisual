import './App.css'
import React from 'react';
import scriptureContentAndReferencesKJV from './kjv_and_references.json';

// declare module '*.json' {
//   const value: any;
//   export default value;
// }

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

interface State {
  openChapters: {[a: string]: number},
  levelChapters: string[][]
}

var testContentAndReferences: ScriptureContentAndReferencesFormat = {
  chapters: {
    'a.1': {
      name: 'a 1',
      book: 'a',
      index: 1,
      verses: ['example 1', 'example 2', 'example 3'],
      // references: {
        // 1: ['b 1', 'b 2']
      // }
    },
    'b.1': {
      name: 'b 1',
      book: 'b',
      index: 1,
      verses: ['example 1'],
      // references: {
        // 1: ['a 1', 'c 1']
      // }
    },
    'b.2': {
      name: 'b 2',
      book: 'b',
      index: 1,
      verses: ['example 1'],
      // references: {
        // 1: ['a 1']
      // }
    },
    'c.1': {
      name: 'c 1',
      book: 'c',
      index: 1,
      verses: ['example 1'],
      // references: {
        // 1: ['b 1']
      // }
    }
  },
  references: {
    'a.1.1': ['b.1.1', 'b.2.1'],
    'b.1.1': ['a.1.1', 'c.1.1'],
    'b.1.2': ['a.1.1'],
    'c.1.1': ['a.1.1']
  }
};


// var contentScripture = loadContent('');

var state: State = {
  openChapters: {'Ps.22': 0},
  levelChapters: [['Ps.22']]
};

(window as any).scriptureContentAndReferencesKJV = scriptureContentAndReferencesKJV;

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <h1>
	    Bible references
	  </h1>
	  <BrowserView data={scriptureContentAndReferencesKJV}></BrowserView>
      </header>
    </div>
  );
}

interface ChapterProps {
  chapter: Chapter,
  chapterId: string,
  data: ScriptureContentAndReferencesFormat,
  openChapters: (chapters: string[]) => void
};

interface BrowserProps {
  data: ScriptureContentAndReferencesFormat
};

interface VerseProps {
  textverse: string,
  references: string[],
  data: ScriptureContentAndReferencesFormat,
  openChapters: (chapters: string[]) => void
};



// 
function Verse(props: VerseProps) { //text: string) {
  let text = props.textverse;
  let references = props.references;
  let data = props.data;
  let openChapters = props.openChapters;

  // debugger;
  var referencesStyle;
  if (references && references.length > 0 ) { 
    referencesStyle = "verse-with-references";
  } else { 
    referencesStyle = "";
  }

  let onVerseReferencesClick = function(event: any): any {
    event.preventDefault();
    let chapters = references; //_.map(references, (r) => data.chapters[r]);
    console.log('chapters', chapters);
    openChapters(chapters);
  }

  if (references && references.length > 0) {
    console.log(props);
    return (
      <div className = {"Verse " + referencesStyle} onClick = {onVerseReferencesClick}>
        {text}
      </div>
    );
  } else {
    return (
      <div className={"Verse " + referencesStyle}>
        {text}
      </div>	  
    );
  }
}


// ({chapter: Chapter, data: Data}) ?? no error
function ChapterView(props: ChapterProps) {
  let chapter = props.chapter;
  let chapterId = props.chapterId;
  let data = props.data;
  let openChapters = props.openChapters;

  var verseViews = [];
  var i = 0;
  for(var verse of chapter.verses) {
    console.log(verse);
    // a.1 -> a.1.1
    let references = data.references[chapterId + '.' + (i + 1)] || [];
    console.log(references);
    // let props = {textverse: verse, references: references};
    verseViews.push(<Verse textverse={verse} references={references} data={data} openChapters={openChapters} key={i} />);
    i += 1;
  }
  console.log(chapter);
  return (
    <div className="Chapter">
      <div className="Chapter-name">
    	  {chapter.name}
      </div>
      <div className="Chapter-verses">
        {verseViews}
      </div>	  
    </div>
   );
}

    	  
// reference browser
function BrowserView(props: {data: ScriptureContentAndReferencesFormat}) {
  // debugger;

  let data = props.data;
  const [stateVariable, setState] = React.useState(state);
  let openChapters = (references: string[]) => {
    console.log('open chapters');
    var newState = {...stateVariable} || state;
    let newLevel = newState.levelChapters.length;
    if (newState.levelChapters[newLevel] === undefined) {
      newState.levelChapters[newLevel] = [];
    }
    for (var reference of references) {
      let chapter = reference.split('.').slice(0, 2).join('.');
      if (newState.openChapters[chapter] === undefined) {
        newState.openChapters[chapter] = newLevel;
        newState.levelChapters[newLevel].push(chapter);
      }
    }
    setState((oldState) => newState);
    console.log(stateVariable);
  };
  console.log('browser view');
 

  var levels = [];
  var i = 0;

  for (var level of stateVariable.levelChapters) {
    var chapters = [];
    for (var chapter of level) {
      console.log(chapter);
      chapters.push(<ChapterView chapter={data.chapters[chapter]} chapterId={chapter} data={data} openChapters={openChapters} key={chapter} />)
    }
    levels.push(<div className="Level columns">
      <div>Level {i}</div>
      <div>{chapters}</div>
    </div>);
    i += 1;
  }
  return (
    <div className='Browser'>
      {levels}
    </div>
  );
}

export default App;

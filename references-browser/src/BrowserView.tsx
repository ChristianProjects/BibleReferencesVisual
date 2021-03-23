import './BrowserView.css'
import React from 'react';
import {generateState, state, chapterForQuery} from './common';
import type {ScriptureContentAndReferencesFormat, ChapterMode} from './common';
import {Options} from './Options';
import {ChapterView} from './ChapterView';

// interface BrowserProps {
//   data: ScriptureContentAndReferencesFormat
// };

// reference browser
function BrowserView(props: {data: ScriptureContentAndReferencesFormat}) {
  let data = props.data;
  const [stateVariable, setState] = React.useState(state);
  let openChapters = (chapterId: string, lineNumber: number, references: string[]) => {
    console.log('open chapters');
    var newState = {...stateVariable} || state;
    let newLevel = newState.levelChapters.length;
    if (newState.levelChapters[newLevel] === undefined) {
      newState.levelChapters[newLevel] = [];
    }
    for (var reference of references) {
      let chapter = reference.split('.').slice(0, 2).join('.');
      let line = parseInt(reference.split('.')[2]);
      console.log(chapter, reference.split('.')[2])
      if (newState.openChapters[chapter] === undefined) {
        newState.openChapters[chapter] = newLevel;
        newState.levelChapters[newLevel].push(chapter);
        newState.chapterModes[chapter] = stateVariable.mode;
      }
      if (!newState.referencedVerses[chapter]) {
        newState.referencedVerses[chapter] = new Set();
      }
      newState.referencedVerses[chapter].add(line);
    }
    (window as any).newState = newState;
    newState.selectedVerses[chapterId] = lineNumber;
    setState((oldState) => newState);
    // console.log(stateVariable);
  };

  let changeMode = (chapterId: string, mode: ChapterMode) => {
    var newState = {...stateVariable} || state;
    newState.chapterModes[chapterId] = mode;
    setState((oldState) => newState);
  }

  console.log('browser view');   

  var levels = [];
  // var i = 0;

  for (var level of stateVariable.levelChapters) {
    var chapters = [];
    for (var chapter of level) {
      // console.log(chapter);
      let mode = stateVariable.chapterModes[chapter];
      let selectedVerse = stateVariable.selectedVerses[chapter];
      let referencedVerses = stateVariable.referencedVerses[chapter];
      chapters.push(<ChapterView chapter={data.chapters[chapter]} chapterId={chapter} data={data} chapterMode={mode} openChapters={openChapters} changeMode={changeMode} selectedVerse={selectedVerse} referencedVerses={referencedVerses} key={chapter} />)
    }
    // <div>Level {i}</div>
      
    levels.push(<div className="Level columns">
      <div>{chapters}</div>
    </div>);
    // i += 1;
  }

  // let setChapterMode = (chapterMode: ChapterMode) => {
  //   var newState = {...stateVariable} || state;
  //   newState.chapterMode = chapterMode;
  //   for (var chapter in newState.chapterModes) {
  //     newState.chapterModes[chapter] = chapterMode;
  //   }
  //   setState((oldState) => newState);
  // }

  let onSearch = (query: string) => {
    let newRootChapter = chapterForQuery(query, data);
    var newState = {...stateVariable} || state;
    if (newRootChapter !== undefined) {
      newState = generateState(newRootChapter);
    }
    setState((oldState) => newState);
  }
  let options = <Options query={stateVariable.rootChapter} onSearch={onSearch} />; //chapterMode={stateVariable.chapterMode} setChapterMode={}
  return (
    <div className='Browser'>
      {options}
      {levels}
    </div>
  );
}



export {BrowserView};
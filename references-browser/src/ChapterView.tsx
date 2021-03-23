import './ChapterView.css';
import React from 'react';
import {ChapterMode} from './common';
import type {ScriptureContentAndReferencesFormat, Chapter} from './common';
import {Verse} from './Verse';

interface ChapterProps {
  chapter: Chapter,
  chapterId: string,
  data: ScriptureContentAndReferencesFormat,
  chapterMode: ChapterMode,
  selectedVerse?: number,
  referencedVerses?: Set<number>,
  changeMode: (chapterId: string, mode: ChapterMode) => void,
  openChapters: (chapterId: string, lineNumber: number, chapters: string[]) => void
};

// ({chapter: Chapter, data: Data}) ?? no error
function ChapterView(props: ChapterProps) {
  let chapter = props.chapter;
  let chapterId = props.chapterId;
  let data = props.data;
  let chapterMode = props.chapterMode;
  let changeMode = props.changeMode;
  let selectedVerse = props.selectedVerse;
  let referencedVerses = props.referencedVerses;
  let openChapters = props.openChapters;

  var verseViews = [];
  var i = 0;
  for(var verse of chapter.verses) {
    // a.1 -> a.1.1
    let references = data.references[chapterId + '.' + (i + 1)] || [];
    let isReferencedVerse = referencedVerses !== undefined && referencedVerses.has(i + 1);
    if (chapterMode === ChapterMode.Maximized || (chapterMode === ChapterMode.MinimizedToVerse && (selectedVerse === i + 1 || isReferencedVerse)) ) { //isReferencedVerse ||)
      verseViews.push(<Verse textverse={verse} references={references} data={data} lineNumber={i + 1} chapterId={chapterId} isSelectedVerse={selectedVerse === i + 1} isReferencedVerse={isReferencedVerse} openChapters={openChapters} key={i} />);
    }
    i += 1;
  }
  var options = [];
  if (chapterMode === ChapterMode.Maximized) {
    options.push(<div className="Chapter-minimize-to-title" onClick={() => changeMode(chapterId, ChapterMode.MinimizedToTitle)}>
          min to title
      </div>);
    options.push(<div className="Chapter-minimize-to-selected-or-referenced-verse" onClick={() => changeMode(chapterId, ChapterMode.MinimizedToVerse)}>
          min to selected/referenced verse
      </div>);
  } else {
    options.push(<div className="Chapter-maximize" onClick={() => changeMode(chapterId, ChapterMode.Maximized)}>
          maximize
      </div>);
  }

  // console.log(chapter);
  return (
    <div className="Chapter">
      <div className="Chapter-header">

        <div className="Chapter-name">
    	    {chapter.name}
        </div>
         <div className="Chapter-options">
           {options}
         </div>
      </div>
      <div className="Chapter-verses">
        {verseViews}
      </div>	  
    </div>
   );
}

export {ChapterView};

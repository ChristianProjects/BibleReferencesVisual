import './Verse.css';
import React from 'react';
import type {ScriptureContentAndReferencesFormat} from './common';

interface VerseProps {
  textverse: string,
  references: string[],
  data: ScriptureContentAndReferencesFormat,
  lineNumber: number,
  chapterId: string,
  isSelectedVerse: boolean,
  isReferencedVerse: boolean,
  openChapters: (chapterId: string, lineNumbers: number, chapters: string[]) => void
};

function Verse(props: VerseProps) {
  let text = props.textverse;
  let references = props.references;
  // let data = props.data;
  let lineNumber = props.lineNumber;
  let openChapters = props.openChapters;
  let chapterId = props.chapterId;
  let isSelectedVerse = props.isSelectedVerse;
  let isReferencedVerse = props.isReferencedVerse;

  var referencesStyle;
  if (references && references.length > 0 ) { 
    referencesStyle = "verse-with-references";
  } else {
    referencesStyle = "";
  }

  var selectedVerseStyle;
  if (isSelectedVerse) {
    selectedVerseStyle = "selected-verse";
  } else {
    selectedVerseStyle = "";
  }

  var referencedVerseStyle
  if (isReferencedVerse) {
    referencedVerseStyle = "referenced-verse";
  } else {
    referencedVerseStyle = "";
  }

  let onVerseReferencesClick = function(event: any): any {
    event.preventDefault();
    let chapters = references; //_.map(references, (r) => data.chapters[r]);
    // console.log('chapters', chapters);
    openChapters(chapterId, lineNumber, chapters);
  }

  if (references && references.length > 0) {
    // console.log(props);
    return (
      <div className = {"Verse " + referencesStyle + " " + selectedVerseStyle + " " + referencedVerseStyle} onClick = {onVerseReferencesClick}>
        <div className="lineNumber">
          {lineNumber}
        </div>
        <div className="text">
          {text}
        </div>
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

export {Verse};

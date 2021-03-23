import './Options.css'
import React from 'react';

interface OptionsProps {
  query: string,
  onSearch: (query: string) => void
}

function Options(props: OptionsProps) {
  // let chapterMode = props.chapterMode;
  // let setChapterMode = props.chapterMode;
  let query = props.query;
  let onSearch = props.onSearch;

  // return (
    // <div class="Options">
      // <form>
        // <label htmlFor="options_chapter_mode"> Chapter Mode </label>
        // <input type="checkbox" name="options_chapter_mode" checked={}


  let onReady = (event: any) => {
    console.log('Ready')
    event.preventDefault();
    event.stopPropagation();
    let query = event.target.childNodes[0].value;
    console.log(query);
    onSearch(query);
  }

  return (
    <div className="Options">
      <form onSubmit={onReady}>
        <input type="text" defaultValue={query}/>
        <input type="submit" value="search" />
      </form>
    </div>
  );
}

export {Options};
export type {OptionsProps};

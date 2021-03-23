import './App.css'
import React from 'react';
import scriptureContentAndReferencesKJV from './kjv_and_references.json';
import {BrowserView} from './BrowserView';


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
  
export default App;


// TODO:
// custom cross references
//   sharing?
//   narratives?
// 
// bulgarian
// mobile view
// themes
// graph?


// narrative:


// [     after death ]

// -----

// all the other ones

// ---

// some commentary 

// books --- books ---- books 

// chapter -- commentary --  chapter --- commentary -- chapter -- comentary 

// interface Narrative {
//   name: string,
//   references: string[],
//   commentaries: string[]
// }


// theme:
//   paper / white 
//   bold and colored / highlight
//   more details / more minimal

// similar for narrative 

// scrolling down similar to a plan but more visual

// context ? 

// minimize and maximize 

// *b*



Bible reference browser
--------------------------


Praise God and we thank Him for the Holy Word!


This is a project for browsing the Bible based on references.


usage
----------

Write e.g. `Psalm 22` or `Ps.22` in the search box and press search.

From that "root" chapter you can start clicking on verses and then in right click to see their references.

You can also minimize/maximize using the texts in the top right corner of chapters.

![a screenshot showing Psalm 22:28 referencing Matthew 6:13 and other chapters, and Matthew 6:14 referencing more verses](screenshots/screen.png "a screenshot showing Psalm 22:28 referencing Matthew 6:13 and other chapters, and Matthew 6:14 referencing more verses" )

dependencies
------------

we use yarn and react and we base our text on the King James Version translation.

We use https://github.com/scrollmapper/bible_databases 's files and references : to build we need to copy the big `kjv_and_references.json` file from https://github.com/ChristianProjects/ScriptureFilesAndReferences to `src/` : it's converted with a converter program: `converter.js` which is build using `tsc converters.ts`.



techical build
----------------

This is a refactored copy of some of the react/yarn generated README

### Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


license
-----------

license for the code is MIT

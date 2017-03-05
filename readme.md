# Project Title

ZM Project - Hacker News - Code challenge

## Getting Started

The project is built with TypeScript/React using VSCode.

The requirements the following:
* Fetch X random stories.
* Sort the stories based on their score.
* Show the following information: Story title/url/time stamp/score and author id/karma score.
* All data should be fetched before showing anything.

Extra functionality:
* Load more - fetching X more random stories.

### Installing

In order to run the code you will need to execute the following commands:

```
npm install
npm start
```

## Project Information

In order to achieve the assignment requirements, 3 endpoints should be triggered and responses should be synced. 
The dependency is the following: get stories ids -> select X stories and get their information -> build the needed authors -> get their information -> display.

**Saving on rest calls:**
Ideally the endpoints provided should have used some filtering mechanism, as each story/author needs 1 rest call, this means that in order to get 10 stories we need up to 20 rest calls. The site stated that they did not implement rate limits, as if they would this code would probably end up getting 429s.
In order to try and be efficient rest wise, I choose to save as many authors as possible, as it makes sense to have 1 to * relationship between author/story. Before planning which authors should be fetched, check if such author was already fetched (or is planned to be) - this ideally can save 1 rest call. At worse case we have 1 story per 1 author, where we will then trigger ALL 20 calls.

**Syncing the calls:**
In order to sync I used Promise.all, this will ensure that the .then() block will be executed once all info is fetched. I think this framework is nice and easy to use, as syncing so many calls will probably result in a similar structure, just not as nice and clean to read.

**Choosing X random stories:**
I really like using underscore lib, as they have really nice util functions! The important part about choosing X stories was that react is sensitive to similar keys, this means that 2 stories sharing the same id would trigger:
1. React warning in console.
2. Second will not be rendered.
In order to avoid this, I made sure to remove the selected stories from the id array as it progressed. On this note, also if there there are less then X stories left, there is not reason to trigger a random loop.

Note - this is assuming that all ids fetched from the initial endpoint are unique.

**State vs Local var:**
As you can see I selected to use some local vars which hold the next stories/authors to fetch, yes this could be a state but I think it will just be overkill for a helper var.
I like to keep in the state the information which is fetched and needed for the current rendered content.
One more note about the state: as we get more stories we would like to decrease what is possible to fetch from, but this is not valid for authors. Authors can save us rest calls this way authors state is actually growing.

**Renders:**
Ideally my page should only handle events and rest calls, but in this case the assignment is so small that I did "pollute" my page with some extra render calls.
I did create a small component for each entry of the list, as it made sense and also encapsulate this view nicely.
One more note is that I like to keep THE render() function simple, meaning that all you see under is blocks that render a part of the page. The reason for extracting things from render is due to the fact that it makes the fist impression of what sections this page has so much easy to read!

**In-file structure:**
I like to keep my files structured and documented, meaning that I will not put rest calls functions inside render functions blocks.
Each section has a "title" which explains what type of functions one can find under this block. This so helpful on a bigger scale projects.

**Other notes:**
I did not go to much into css, just added some simple styles while trying to keep a nice structure.
The time - I used moment, but did not make it further into a nicer display.

## Acknowledgements

* Initial help in getting things started: https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
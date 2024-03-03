# Project COMP6905_GR_03

> :warning: **Please pull to update your local before you push to make any changes**!


## How to run

1. Download [NodeJS](https://nodejs.org/en)
2. run ```npm install``` to download all dependencies.
3. build react app ```npm run build```
4. in the server folder run server ```node main.js```

5. type ```http://localhost:3000/``` in your browser



## Project Requirements
1. Find best way from A to B.
2. Slope has differnet difficulty (blue, red, black), skier should be able to specify which slopes to use.
3. help the skier to find the right food place and public restrooms.
4. The app will determine the location of the skier.


## Goals:
1. Create a project on GitHub. ---- done
2. Develop a web-based application that adapts to the distribution rate of mobile phones (web browser application).
3. Set up a server and database (which server to choose?).
4. Determine the ski resort to focus on.
5. Discuss the required technology with stakeholders.
6. Achieve the following goals in one iteration:
   - Set up a server.
   - Create a simple web interface with basic icons (non-functional).
   - Integrate static data.
   - Implement static maps (consider using third-party libraries).

  
## To do:
1. confirm first iteration commitment. (what functions need to be done)
2. determin the technical stack. contact with TA.
3. Set up a server and database (which server to choose?).


## Task assignment:
1. Jiaying (plus one to two person) for web page.
2. for web page, we can choose React or Angular, need to make a choice.
3. Chang and jude for backend using expressJS.
4. for backend, we will Node JS, and database as mongoDB Atlas.
5. We already have a server, which will be provided by jude.
6. basically 2-3 person for backend and 2-3 person for web page. please choose which part you want to join.


## Data Structure

```

1. node: {
   id:string,
   lon:double,
   lat:double,
   node_type:string,
   status:boolean
}

2. slope{
   id:string
   startNode:node,
   endNode:node,
   difficulty:difficulty_level,
   status
}


3. node_type {
   id:string,
   name:string,
   status:boolean
}

4. difficulty_level{
   id:string,
   hexColor:string,
   name:string,
   status:boolean
}


5. skier*** {
   id:string,
   name:string,
   status:boolean
}
*** currently not necessary/maybe later
```


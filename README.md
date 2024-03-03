# Project COMP6905_GR_03

> :warning: **Please pull to update your local before you push to make any changes**!


## How to run

1. Download [NodeJS](https://nodejs.org/en)
2. run ```npm install``` to download all dependencies.
4. in the ```./server``` folder start server ```node main.js```, or using eclipse run node application.
5. type ```http://localhost:3000/``` in your browser


## Project Requirements

We will be implementing a Skier-Routing app. 

Many of the modern ski areas are widespread with dozens of chair-lifts/gondolas, sometimes up-to hundreds of kilometres of ski slopes and many dining establishments. The app will help the avid skier to find the best way to get from point A to a point B. The slopes are of different difficulty (blue, red and black) and the skier, depending on confidence/ability level, should be able to specify which slopes to use. In a normal situation, moving up will involve lifts and the skiers will ski down the slope. But in some cases, the skier may decide to take the lift down (e.g., if the only available slope is a challenging black one). The app should also help the skier to find the right food place and public restrooms.

The app will determine the location of the skier. The Web-based app, should be targeted towards mobile phone. 

Here is a [link](https://www.snow-space.com/en/winter/ski-resort-salzburg/facts/piste-map) to one of the ski areas in the European Alps.


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


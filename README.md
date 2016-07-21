# earthquake-hotspots
Visualization project for Earthquake Hotspots based on the [USGS data feed](http://earthquake.usgs.gov/earthquakes/feed/).

#Libraries
[D3](http://d3js.org) for the data visualization  
[TopoJSON](https://github.com/mbostock/topojson) for the worldmap visualization  
[jQuery](https://jquery.com/) for creating the Interface UI  
[jQuery SlimScroll](https://github.com/rochal/jQuery-slimScroll) for a nicer scroll bar

#Core
The core functionalities are located in the `shaked.js` inside the `/js` folder.  

#For the Future
- improve script performance (currently the animation can parse approximately max. 100-150 json data-entries without crashing)
- split `shaked.js` into separate files with functionalities belonging together, e.g one js file for loading the data feed, one for building the UI and so on.
- add TopoJSON as a git submodule for easier updates (been too git-lazy to do this...)  

#Contributing
I am open for all of your ideas, contributions and feedback.


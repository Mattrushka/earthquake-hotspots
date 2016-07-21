# earthquake-hotspots
Visualization project for Earthquake Hotspots based on the [USGS data feed](http://earthquake.usgs.gov/earthquakes/feed/).  

#Demo
[Magnetum Projects](http://projects.magnetum.de/USGS/)

#Libraries
[D3](http://d3js.org) for the data visualization  
[TopoJSON](https://github.com/mbostock/topojson) for the worldmap visualization  
[jQuery](https://jquery.com/) for creating the Interface UI  
[jQuery SlimScroll](https://github.com/rochal/jQuery-slimScroll) for a nicer scroll bar

#Core
The core functionalities are located in the `shaked.js` inside the `/js` folder.  

#For the Future
- improve script performance (currently the animation can render approx. 100-150 max. JSON data-entries before slowing down the browser...or crashing it)
- split `shaked.js` into separate files with similar functionalities, e.g one js file for loading the data feed, one for building the UI and so on
- add TopoJSON as a git submodule for easier updates (been too git-lazy to do this...)  
- automatically refresh the page after one hour 

#Contribute
All ideas, contributions and feedback are highly appreciated and welcome


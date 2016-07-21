$(document).ready(function () {
	//++ Interface UI ++//
	$("#info").click(function() {
		$("#infoBox").slideToggle();
	});

	//load USGS data from feed
	getFeed("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp", "feed2" , 1);
	//data feed callback function
	window.eqfeed_callback = function(data){
    //init/clean array
	quakes = new Array();
	infoquakes = new Array();
	if(firstUse == 1) {
			//parameters
			var width = window.innerWidth-100,
			    height = window.innerHeight-100,
			    speed = -1e-2,
			    start = Date.now(),
				max = 10, //max amount of animation sequences
				min = 0, //init counter for animations
				strengthLimit = 0; //animation variable
			var sphere = {type: "Sphere"};

			var projection = d3.geo.orthographic()
			    .scale(width / 4)
			    .clipAngle(90)
			    .translate([width / 2, (height / 2)]);

			var canvas = d3.select("body").append("canvas")
			    .attr("width", width)
			    .attr("height", height);

			var context = canvas.node().getContext("2d");

			var path = d3.geo.path()
			    .projection(projection)
			    .context(context);

			//draw map
			d3.json("inc/world-110m.json", function(error, topo) {
			  	var land = topojson.feature(topo, topo.objects.land);
			 	d3.timer(function() {
			    	var λ = speed * (Date.now() - start),
			        	φ = -15;
			        	min++;
			        	if (min<max) {
							strengthLimit = min/10 ;
			        	}
			        	else {
			        		strengthLimit = 0;
			        		min = 0;
			        	}

				    context.clearRect(0, 0, width, height);

				    context.beginPath();
				    path(sphere);
				    context.fillStyle = "rgba(5,66,105,0.75)";
				    context.fill();

				    context.save();
				    context.translate(width / 2, 0);
				    context.scale(-1, 1);
				    context.translate(-width / 2, 0);
				    projection.rotate([λ + 180, -φ]);

				    context.beginPath();
				    path(land);
				    context.fillStyle = "rgba(24,24,28,0.7)";
				    context.fill();

				    context.restore();
				    projection.rotate([λ, φ]);

				    context.beginPath();
				    path(land);
				    context.fillStyle = "rgba(200,200,205,0.8)";
				    context.fill();

				//draw quakes
			    for (i=0; i <quakes.length; i++) {
			    	var calcQuake = (quakes[i].signif/200)-(strengthLimit/0.8);

			    	var quakeSize = (calcQuake < 1) ? 0.5:calcQuake;
			    	var quakeOpac = (calcQuake < 1) ? (strengthLimit-0.3):0.1;

			    	var circle = d3.geo.circle()
			    					//dynamic size of circle
			    					.angle(quakeSize)
			    					//coords on map
			    					.origin([quakes[i].longitude, quakes[i].latitude]);
				    var circles = [circle()];
				    context.beginPath();
				    path({type: "GeometryCollection", geometries: circles});


				    context.fillStyle = "rgba(255,8,8, " + (0.7-quakeOpac) + ")";
				    context.fill();
			    }
			  });
			});
			d3.select(self.frameElement).style("height", height + "px");
	}
	//parse data feed
	for (var i=0; i<data.features.length; i++) {
		var title		= data.features[i].properties.place;
	  var date		= data.features[i].properties.time;
	  var latitude	= data.features[i].geometry.coordinates[1];
	  var longitude	= data.features[i].geometry.coordinates[0];
	  var signif		= data.features[i].properties.sig; //number describing how significant the event is; determined on a number of factors, including: magnitude, maximum MMI, felt reports, and estimated impact
		var mag			= data.features[i].properties.mag;
		//create two arrays for better performance
		//A. QUAKES OBJECT
		//containing coords and significance only
		var quakes_Obj = {"latitude":latitude , "longitude":longitude , "signif":signif  };
		quakes.push(quakes_Obj);
		//B. QUAKES INFO OBJECT
		//containing quake detail infos as date, title,...
		var info_Obj = {"title":title , "date":date , "signif":signif, "mag":mag  };
		infoquakes.push(info_Obj);

		//trigger last element to make UI smooth
		if(i == data.features.length-1){
			 for (i=0; i <infoquakes.length; i++) {
			 	//convert timestamp
			 	var date = new Date(infoquakes[i].date); // turn to milliseconds first
			 	var year = date.getFullYear();
			 	var month = date.getMonth();
			 	var day = date.getDate();
				var hours = date.getHours();
				var minutes = "0" + date.getMinutes();
				var seconds = "0" + date.getSeconds();
				var formattedTime = day+"."+(month+1)+"."+year+", "+hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
				//build Interface HTML
			 	var infoList =  "<p>"
			 					+"<span class='fontawesome'><i class='fa fa-map-marker'></i></span> <span class='title'>"+infoquakes[i].title+"</span><br/> "
			 					+"<span class='signif'>Significance: <span class='signifNumber'>"+infoquakes[i].signif+"</span><br/>"
			 					+"Magnitude:"+infoquakes[i].mag+"</span><br/>"
			 					+"<span class='time'>Time: "+formattedTime+"</span><br/><br/></p>";
			 	//create dropdown list
			 	$("#infoSlider").append(infoList);
			 	//trigger last element to make UI smooth
				if(i == infoquakes.length-1){
					//build HTML
					var noteTxt = "<p class='note'>Note<br/>Visualizing the strength of earthquakes is a complex thing.<br/>"
					+"To realize a consistent visual representation of earthquakes we decided to use <a href='http://earthquake.usgs.gov/earthquakes/feed/v1.0/glossary.php#sig' target='_blank'>significance</a> as a good proportional unit. "
					+"It is determined on a number of factors, including magnitude, maximum MMI, felt reports, and estimated impact."
	        		+"</p>";
					$("#infoSlider").append(noteTxt).fadeToggle("fast");
					$("#info").html("<a href='#'>Overview</a>");
					//add customized scrollbar to dropdown list
				}
			 }
			 //draw customized scroolbar
			 $(function(){
					 $("#infoSlider").slimScroll({
							 height: "auto",
							 color:	"#ccBBBB",
							 alwaysVisible: true
					 });
			 });
		}
	}
};

});

//query feed from USGS
function getFeed(urlString, feedNumber,appLoad) {
	//++ Interface UI ++//
	//toggle buttons
	$("#feedNav li a").removeClass("active");
	$("#"+feedNumber).toggleClass("active");
	$("#info").html("<span class='loader'></span> Loading");
	$("#infoSlider").fadeToggle("fast", function(){
		$(this).empty();
		//define var for firsttimeornot usage
		firstUse = appLoad;
		//fetch data
		var s = document.createElement("script");
		s.src = urlString;
		document.getElementsByTagName("head")[0].appendChild(s);
	});
}

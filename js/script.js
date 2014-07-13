//GLOBALS
var serverUrl = 'https://j2uwpaid31:hpw6yydziz@realtrends-jordan-lo-8230931152.eu-west-1.bonsai.io/building_data/_search?';
var searchIndex = 'elasticsearch';

var enableHeatMap = true;
var enableMarkers = false;
var enableSuburbs = false;

var heatmap;
var heatmapoptions = {
	radius: 15,
	gradient: {
		0.1: 'blue', 
		0.2: 'lime', 
		0.3: 'red'
	},
	blur: 10
}

var markers = new Array();
var addressPoints = new Array();

jQuery(document).ready(function($) {


	//----------------------------------------------------------------------------------------------------------------
	// ANIMATE NAV BAR IN ON READY
	//----------------------------------------------------------------------------------------------------------------
		setTimeout(function(){
			$('.logo').removeClass('fadedOut');
		},250);
		setTimeout(function(){
			$('#search').removeClass('fadedOut');
		},500);
		setTimeout(function(){
			$('#timelineBtn').removeClass('fadedOut');
		},750);
		setTimeout(function(){
			$('#filterBtn').removeClass('fadedOut');
		},1000);


	//----------------------------------------------------------------------------------------------------------------
	// FACET VIEW
	//----------------------------------------------------------------------------------------------------------------

	var json = (function() {
		var json = null;
		$.ajax({
		    'async': false,
		    'global': false,
		    'url': "indexer/postcodes.json",
		    'dataType': "json",
		    'success': function (data) {
		        json = data;
		    }
		});
		return json;
	})();



	$('.facet-view-simple').facetview({
		search_url: serverUrl,
	    search_index: searchIndex,
	    initialsearch: true,
	    facets: [],
	    paging: {
	      size: 500
	    },
	    on_results_returned: function(sdata) {

	    	removeAllMarkers();
	    	removeAllHeatMaps();

	        //Once the search is performed, loop through the result and find the relevant geocodes.
	        //If there aren't any, then look up the postcode information from /indexer/postcodes.json

	        $.each(sdata.hits.hits, function(index, value){

	            var geocode = getGeocode(value);

	            if(geocode) {
	              var lon = parseFloat(geocode[1]);
	              var lat = parseFloat(geocode[0]);
	              //lots of undefined data in the database so validate that lat and lon exists.
	              if(lat && lon) {

	              	var point = new Array(lon,lat);

	              	if(enableHeatMap) {
		              	addHeatMap(point);
	              	}
	              	  
	              	if(enableMarkers) {
	              		var mark = addMarker(point);
		           	  	addPointToMarker(mark, value._source);
	              	}

	              }
	              
	            }	            
	        });
	    },
	    searchwrap_start: '<table class="table table-striped table-bordered" id="facetview_results"><thead><tr><td></td><th>Site Street</th><th>Site Suburb</th><th>Site Postcode</th><th>Permit Approval Date</th><th>Geocode</th></tr></thead><tbody>',
	    searchwrap_end: '</tbody></table>'
	});


	function removeAllMarkers() {
		for(var i = 0; i < markers.length; i++) {
			map.removeLayer(markers[i]);
		}
	}

	function addMarker(mark) {
		var marker = L.marker(mark).addTo(map);
      	markers.push(marker);
      	return marker;
	}

	function addPointToMarker(marker, data) {
		var markerData = {
      		"suburb" : data.Site_suburb,
      		"municipality" : data.site_municipality,
      		"permitType" : data.Building_classification_1,
      		"estimatedCost" : data.est_cost_project,
      		"additionalDwellings" : "None"
      	}

      	if(data.dwellings_after_work > data.dwellings_before_work) {
      		markerData["additionalDwellings"] = data.dwellings_after_work - data.dwellings_before_work;
      	}

      	marker.on('click', function(){ populateContent(markerData);} )
	}

	$("#infoPanel").hide();

	function populateContent(json) {
		$("#infoPanel").fadeOut(200, function() {
			$("#suburb").html(json["suburb"]);
			$(".municipality .value:first").html(json["municipality"]);
			$(".type .value:first").html(json["permitType"]);
			$(".average-cost .value:first").html("$"+json["estimatedCost"]);
			$(".additional-dwellings .value:first").html(json["additionalDwellings"]);
		});

		$("#infoPanel").fadeIn(200);
	}

	function addHeatMap(point) {
		
		if(point) {
			addressPoints.push(point);
		}

		if(!heatmap) {
        	heatmap = L.heatLayer(addressPoints, heatmapoptions).addTo(map);
        } else {
        	heatmap.setLatLngs(addressPoints);
        	//heatmap.redraw();
        }
	}

	function removeAllHeatMaps() {
		addressPoints = new Array();
		addHeatMap();
	}

	function getGeocode(value) {
		var geocode;

		if(value && value._source && value._source.postcode_geocode == undefined ) {
          var postcode = value._source.site_pcode ? value._source.site_pcode : "";
          geocode = json[postcode];
        } else {
          geocode = value._source.postcode_geocode;
        }

        return geocode;
	}

	//hide buttongruop
	$('.facetview_search_options_container .btn-group:eq(0)').css('display','none');


	//----------------------------------------------------------------------------------------------------------------
	// TIME LINE SLIDER
	//----------------------------------------------------------------------------------------------------------------


	var dateArrayStart = [
		['Q1 2006','01/01/2006'],
		['Q2 2006','01/04/2006'],
		['Q3 2006','01/07/2006'],
		['Q4 2006','01/10/2006'],
		['Q1 2007','01/01/2007'],
		['Q2 2007','01/04/2007'],
		['Q3 2007','01/07/2007'],
		['Q4 2007','01/10/2007'],
		['Q1 2008','01/01/2008'],
		['Q2 2008','01/04/2008'],
		['Q3 2008','01/07/2008'],
		['Q4 2008','01/10/2008'],
		['Q1 2009','01/01/2009'],
		['Q2 2009','01/04/2009'],
		['Q3 2009','01/07/2009'],
		['Q4 2009','01/10/2009'],
		['Q1 2010','01/01/2010'],
		['Q2 2010','01/04/2010'],
		['Q3 2010','01/07/2010'],
		['Q4 2010','01/10/2010'],
		['Q1 2011','01/01/2011'],
		['Q2 2011','01/04/2011'],
		['Q3 2011','01/07/2011'],
		['Q4 2011','01/10/2011'],
		['Q1 2012','01/01/2012'],
		['Q2 2012','01/04/2012'],
		['Q3 2012','01/07/2012'],
		['Q4 2012','01/10/2012'],
		['Q1 2013','01/01/2013'],
		['Q2 2013','01/04/2013'],
		['Q3 2013','01/07/2013'],
		['Q4 2013','01/10/2013'],
		['Q1 2014','01/01/2014'],
		['Q2 2014','01/04/2014']
	];

	var dateArrayEnd = [
		['Q1 2006','31/03/2006'],
		['Q2 2006','30/06/2006'],
		['Q3 2006','30/09/2006'],
		['Q4 2006','31/12/2006'],
		['Q1 2007','31/03/2007'],
		['Q2 2007','30/06/2007'],
		['Q3 2007','30/09/2007'],
		['Q4 2007','31/12/2007'],
		['Q1 2008','31/03/2008'],
		['Q2 2008','30/06/2008'],
		['Q3 2008','30/09/2008'],
		['Q4 2008','31/12/2008'],
		['Q1 2009','31/03/2009'],
		['Q2 2009','30/06/2009'],
		['Q3 2009','30/09/2009'],
		['Q4 2009','31/12/2009'],
		['Q1 2010','31/03/2010'],
		['Q2 2010','30/06/2010'],
		['Q3 2010','30/09/2010'],
		['Q4 2010','31/12/2010'],
		['Q1 2011','31/03/2011'],
		['Q2 2011','30/06/2011'],
		['Q3 2011','30/09/2011'],
		['Q4 2011','31/12/2011'],
		['Q1 2012','31/03/2012'],
		['Q2 2012','30/06/2012'],
		['Q3 2012','30/09/2012'],
		['Q4 2012','31/12/2012'],
		['Q1 2013','31/03/2013'],
		['Q2 2013','30/06/2013'],
		['Q3 2013','30/09/2013'],
		['Q4 2013','31/12/2013'],
		['Q1 2014','31/03/2014'],
		['Q2 2014','30/06/2014']
	];



	var $timelineWrap = $('#timelineWrap');
	var $timeline = $('#timeline');
	var $date = $('#timeline').find('.date');
	var $handle = $('.noUi-handle');
	var $tooltips = $handle.find('.tooltip');

	$('#timelineBtn').click(function(){

		if( !$timelineWrap.hasClass('open') ){
			$timelineWrap.addClass('open');
			setTimeout(function(){
				$timelineWrap.addClass('fadeIn');
			},10)
		}

		else{
			$timelineWrap.removeClass('fadeIn');
			setTimeout(function(){
				$timelineWrap.removeClass('open');
			},550)
		}


	});

	var toolTip = $.Link({
		target: '-tooltip-<div class="tooltip"></div>',
		method: function ( value ) {

			// The tooltip HTML is 'this', so additional
			// markup can be inserted here.
			$(this).html(
				'<span>' + dateArrayStart[Math.round(value)][0] + '</span>'
				//Math.round(timelineVals[0])
			);
		}
	});


	$timeline.noUiSlider({
		start: [0, dateArrayStart.length - 1],
		step: 1,
		margin: 0,
		connect: true,
		direction: 'ltr',
		orientation: 'horizontal',
		behaviour: 'tap-drag',
		range: {
			'min': 0,
			'max': dateArrayStart.length - 1
		},
		serialization: {
			lower: [ toolTip ],
			upper: [ toolTip ]
		}
	});


	function displayDate(){
		var timelineVals = $timeline.val();

		//create string
		var date1 = dateArrayStart[ Math.round(timelineVals[0]) ];
		var date2 = dateArrayEnd[ Math.round(timelineVals[1]) ];
		var date = date1[0] + ' - ' + date2[0];
		$date.html(date);

		return new Array(date1[1],date2[1]);
	}
	displayDate();

	function slideEventHandler(){
		var dates = displayDate();

		var searchStart = dates[0];
		var searchEnd = dates[1];
		delay(function() {dateSearch(searchStart, searchEnd);}, 300);
	}

	$timeline.on('slide', slideEventHandler);

	//----------------------------------------------------------------------------------------------------------------
	// Search functions
	//----------------------------------------------------------------------------------------------------------------

	$('#search').keyup(function() {
	    delay(function(){
	      textSearch($('#search').val());
	    }, 1000 );
	});

	function textSearch(text) {
		var query = text;
		$("#facet_search").val(query);
		geocode(text);
		executeSearch();
	}

	function dateSearch(start, end) {
		if(start && end ) {
			$("#facet_search").val("Permit_app_date:[\""+start+"\" TO \""+end+"\"]");
		}
		executeSearch();
	}

	function executeSearch() {
		$("#infoPanel").fadeOut(200);
		$('#facet_search').keydown();
	    $('#facet_search').keypress();
	    $('#facet_search').keyup();
	    $('#facet_search').blur();
	}

	function resetSearch() {
		$("#facet_search").val("");
		$('#search').val("");
		executeSearch();

	}

	//----------------------------------------------------------------------------------------------------------------
	// Utility functions
	//----------------------------------------------------------------------------------------------------------------
	
	//Delay manages timed functions, used for search etc.

	var delay = (function(){
	  var timer = 0;
	  return function(callback, ms){
	    clearTimeout (timer);
	    timer = setTimeout(callback, ms);
	  };
	})();


	//Geocoding service with Google's Service

	var geocoder;
	geocoder = new google.maps.Geocoder();

	function geocode(search) {
	  var address = search + ", victoria, australia";
	  geocoder.geocode( {'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      //console.log(results[0].geometry.location);
	      moveMap(results[0].geometry.location.k,results[0].geometry.location.B);
	    } else {
	      console.log('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	}

	function moveMap(lat, lon) {
		//console.log("moving map to:" + lat + ":" + lon);
		map.setView([parseFloat(lat),parseFloat(lon)],12);
	}

	//----------------------------------------------------------------------------------------------------------------
	//LEAFLET MAP INIT
	//----------------------------------------------------------------------------------------------------------------

	//set map height
	var $map = $('#map');
	$map.css('height',  $(window).height() - 40);

	//init map
	var map = L.map('map').setView([-37.00, 145], 7);

	var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	    attribution: '',
	    id: 'examples.map-20v6611k'
	}).addTo(map);

	function onMapClick(e) {
	    $("#infoPanel").fadeOut(200);
	}

	map.on('click', onMapClick);

	map.on('dragstart', function(e) {
		resetSearch();
	});

	map.on('dragend', function(e) {
		resetSearch();
	});

	//----------------------------------------------------------------------------------------------------------------
	//LEAFLET ADD BOUNDARIES
	//----------------------------------------------------------------------------------------------------------------

	if(enableSuburbs) {

		var bounds = JSON.parse(localStorage.bounds);

		function getColor(d) {
		    return d > 1000 ? '#800026' :
		           d > 500  ? '#BD0026' :
		           d > 200  ? '#E31A1C' :
		           d > 100  ? '#FC4E2A' :
		           d > 50   ? '#FD8D3C' :
		           d > 20   ? '#FEB24C' :
		           d > 10   ? '#FED976' :
		                      '#FFEDA0';
		}

		//adds interaction to the map
		function style(feature) {
		    return {
		        fillColor: getColor(feature.properties.density),
		        weight: 1,
		        opacity: 1,
		        background: 'gray',
		        color: 'gray',
		        dashArray: '0',
		        fillOpacity: 0
		    };
		}


		function highlightFeature(e) {
		    var layer = e.target;
		    layer.setStyle({
		        weight: 1,
		        color: '#ff6200',
		        dashArray: '',
		        fillOpacity: 0.7
		    });

		    if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }
		}


		function resetHighlight(e) {
		    var layer = e.target;
	    	layer.setStyle({
		        weight: 1,
		        color: 'gray',
		        dashArray: '',
		        fillOpacity: 0.7
		    });
		}
		
		function zoomToFeature(e) {
			console.log(e.target.feature.properties.poa_2006)
		    map.fitBounds(e.target.getBounds());
		}

		var geojson;

		function onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        click: zoomToFeature
		    });
		}

<<<<<<< HEAD
=======
		
		//adde event listeners
		geojson = L.geoJson(bounds, {
		    style: style,
		    onEachFeature: onEachFeature
		}).addTo(map);
		geojson = L.geoJson();
>>>>>>> FETCH_HEAD




		var legend = L.control({position: 'bottomright'});
		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		        labels = [];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    for (var i = 0; i < grades.length; i++) {
		        div.innerHTML +=
		            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		    }

		    return div;
		};

<<<<<<< HEAD

		function enableBounds(){
			//addmap
			L.geoJson(bounds, {style: style}).addTo(map);

			//adde event listeners
			geojson = L.geoJson(bounds, {
			    style: style,
			    onEachFeature: onEachFeature
			}).addTo(map);

			geojson = L.geoJson();

			legend.addTo(map);

		}
	
=======
		legend.addTo(map);
	}

>>>>>>> FETCH_HEAD
});
//GLOBALS

var serverUrl = 'https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io/building_data/_search?';
var searchIndex = 'elasticsearch';

var heatmap;
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
	      size: 20
	    },
	    on_results_returned: function(sdata) {

	    	removeAllMarkers();

	        //Once the search is performed, loop through the result and find the relevant geocodes.
	        //If there aren't any, then look up the postcode information from /indexer/postcodes.json

	        $.each(sdata.hits.hits, function(index, value){

	            var geocode = getGeocode(value);

	            if(geocode) {
	              var lon = parseFloat(geocode[1]);
	              var lat = parseFloat(geocode[0]);

	              //lots of undefined data in the database so validate that lat and lon exists.
	              if(lat && lon) {
	              	  var point = new Array(lon,lat)
		              addHeatMap(point);

		           	  var mark = addMarker(point);
		           	  addPointToMarker(mark, value._source);
	              }
	              
	            }	            
	        });
	    },
	    searchwrap_start: '<table class="table table-striped table-bordered" id="facetview_results"><thead><tr><td></td><th>Site Street</th><th>Site Suburb</th><th>Site Postcode</th><th>Permit Approval Date</th></tr></thead><tbody>',
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
		addressPoints.push(point);

		if(!heatmap) {
        	heatmap = L.heatLayer(addressPoints, {
	        	radius: 15,
	        	gradient: {0.1: 'blue', 0.65: 'lime', 1: 'red'},
	        	blur: 1
	        }).addTo(map);
        } else {
        	heatmap.setLatLngs(addressPoints);
        	heatmap.redraw();
        }
	}

	function getGeocode(value) {
		var geocode;

		if(value && value._source && value._source.geo_point == undefined ) {
          var postcode = value._source.site_pcode;
          geocode = json[postcode];
        } else {
          geocode = value._source.geo_point;
        }

        return geocode;
	}

	//hide buttongruop
	$('.facetview_search_options_container .btn-group:eq(0)').css('display','none');


	//----------------------------------------------------------------------------------------------------------------
	// TIME LINE SLIDER
	//----------------------------------------------------------------------------------------------------------------


	var dateArrayStart = [
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
		start: [0, 21],
		step: 1,
		margin: 0,
		connect: true,
		direction: 'ltr',
		orientation: 'horizontal',
		behaviour: 'tap-drag',
		range: {
			'min': 0,
			'max': 21
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

	var timer;

	function slideEventHandler(){
		var dates = displayDate();

		var searchStart = dates[0];
		var searchEnd = dates[1];
		clearTimeout(timer);
		timer = setTimeout(function(){ dateSearch(searchStart, searchEnd);}, 300);
	}


	function dateSearch(start, end) {
		if(start && end ) {
			$("#facetview_freetext").val("Permit_app_date:[\""+start+"\" TO \""+end+"\"]");
			$('#facetview_freetext').keydown();
		    $('#facetview_freetext').keypress();
		    $('#facetview_freetext').keyup();
		    $('#facetview_freetext').blur();
		}
	}

	$timeline.on('slide', slideEventHandler);

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

	//----------------------------------------------------------------------------------------------------------------
	//LEAFLET ADD BOUNDARIES
	//----------------------------------------------------------------------------------------------------------------
/*
	var bounds = JSON.parse(localStorage.bounds);

	 console.log(bounds.features[0].geometry.coordinates)

	 var i = 0;
	 while(i < bounds.features.length){

		var polygon = L.polygon([
		bounds.features[i].geometry.coordinates[0]
		]).addTo(map);

	i++;
	}

	var i = 0;

	while(i < theseBounds.features.length){}

		theseBounds.features[i].geometry.coordinates


	 i++;
	}
*/
});
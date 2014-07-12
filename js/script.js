//GLOBALS

var serverUrl = 'https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io/building_data/_search?';
var searchIndex = 'elasticsearch';



jQuery(document).ready(function($) {


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
	    facets: [
	      {'field': 'site_pcode', 'display': 'Site Postcode'},
	      {'field': 'Building_classification_1', 'display': 'Building Classification'},
	      {'field': 'dwellings_before_work', 'display': '#Before'},
	      {'field': 'dwellings_after_work', 'display': '#After'},
	      {'field': 'number_demolished', 'display': 'Demolished?'}
	    ],
	    paging: {
	      size: 10
	    },
	    on_results_returned: function(sdata) {

	        var addressPoints = new Array();

	        $.each(sdata.hits.hits, function(index, value){

	            var geocode = "";

	            if(value && value._source && value._source.geo_point == undefined ) {
	              var postcode = value._source.site_pcode;
	              geocode = json[postcode];
	            } else {
	              geocode = value._source.geo_point;
	            }

	            if(geocode) {
	              var lon = geocode[1];
	              var lat = geocode[0];

	              addressPoints.push(new Array(lon,lat));
	            }
	        });

	        //console.log(addressPoints);

	       // var heat = L.heatLayer(addressPoints, {radius: 25}).addTo(map);

	    },
	    searchwrap_start: '<table class="table table-striped table-bordered" id="facetview_results"><thead><tr><td></td><th>Site Street</th><th>Site Suburb</th><th>Site Postcode</th><th>Site Geocode</th></tr></thead><tbody>',
	    searchwrap_end: '</tbody></table>'
	});

	//hide buttongruop
	$('.facetview_search_options_container .btn-group:eq(0)').css('display','none');


	//----------------------------------------------------------------------------------------------------------------
	// TIME LINE SLIDER
	//----------------------------------------------------------------------------------------------------------------

	var dateArray = [
		'Q1 2009',
		'Q2 2009',
		'Q3 2009',
		'Q4 2009',
		'Q1 2010',
		'Q2 2010',
		'Q3 2010',
		'Q4 2010',
		'Q1 2011',
		'Q2 2011',
		'Q3 2011',
		'Q4 2011',
		'Q1 2012',
		'Q2 2012',
		'Q3 2012',
		'Q4 2012',
		'Q1 2013',
		'Q2 2013',
		'Q3 2013',
		'Q4 2013',
		'Q1 2014',
		'Q2 2014'
	]

	var $timeline = $('#timeline');
	var $date = $('#timeline').find('.date');
	var $handle = $('.noUi-handle');
	var $tooltips = $handle.find('.tooltip');

	var toolTip = $.Link({
		target: '-tooltip-<div class="tooltip"></div>',
		method: function ( value ) {

			// The tooltip HTML is 'this', so additional
			// markup can be inserted here.
			$(this).html(
				'<span>' + dateArray[Math.round(value)] + '</span>'
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
		var date1 = dateArray[ Math.round(timelineVals[0]) ];
		var date2 = dateArray[ Math.round(timelineVals[1]) ];
		console.log(Math.round(timelineVals[1]));
		var date = date1 + ' - ' + date2;
		$date.html(date);
	}
	displayDate();

	function slideEventHandler(){
		displayDate();
	}

	$timeline.on('slide', slideEventHandler);

	//----------------------------------------------------------------------------------------------------------------
	//LEAFLET MAP INIT
	//----------------------------------------------------------------------------------------------------------------

	//set map height
	var $map = $('#map');
	$map.css('height',  $(window).height() - 40);

	//init map
	var map = L.map('map').setView([-37.87, 175.475], 2);

	var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
	    id: 'examples.map-20v6611k'
	}).addTo(map);

	//var heat = L.heatLayer(addressPoints).addTo(map);

});
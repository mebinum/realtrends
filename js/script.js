
jQuery(document).ready(function($) {


	//----------------------------------------------------------------------------------------------------------------
	// FACET VIEW
	//----------------------------------------------------------------------------------------------------------------

	$('.facet-view-simple').facetview({
		search_url: 'https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io?',
		search_index: 'elasticsearch',
		facets: [
		    {'field': 'permit_stage_number.exact', 'display': 'Permit Stage Number'}
		],
		paging: {
		  size: 10
		}
	});


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
	$map.css('height',  $(window).height() - $('.navbar').height());


	//init map
	var map = L.map('map').setView([-37.87, 175.475], 8);

	var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
	    id: 'examples.map-20v6611k'
	}).addTo(map);

	var heat = L.heatLayer(addressPoints).addTo(map);



});
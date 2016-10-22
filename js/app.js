var map;

//Array für alle Marker
var markers = [];


// Initializes and the map and calls a function to style it
function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {

	center: {lat: 52.47011, lng: 13.441893},
	zoom: 13,
	mapTypeControl: false
	});

	mapStyle();


	var locations = [


		{title: 'Kimchi Princess', location: {lat: 52.498531, lng: 13.426031}},
		{title: 'Tante Biggie', location: {lat: 52.50997, lng: 13.455393}},
		{title: 'Roamers', location: {lat: 52.48553, lng: 13.429323}}

		];				

		var largeInfoWindow = new google.maps.InfoWindow();
		var bounds = new google.maps.LatLngBounds();

		var defaultIcon = makeMarkerIcon('0091ff');
		var highlightedIcon = makeMarkerIcon('FFFF24');

		// Nimmt das Location Array um das Marker Array zu befüllen
		for (var i = 0; i < locations.length; i++) {

			var position = locations[i].location;
			var title = locations[i].title;

			// Erstelle den Marker
			var marker = new google.maps.Marker({
				position: position,
				title: title,
				icon: defaultIcon,
				animation: google.maps.Animation.DROP,
				id: i
			});

			// Pusht die Marker in das Marker-Array
			markers.push(marker);


			// Extended die Boundaries der Map für jeden Marker
			bounds.extend(marker.position);

			// OnClick Event für ein InfoWindow für jeden Marker

			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfoWindow);
			});


			marker.addListener('mouseover', function() {

				this.setIcon(highlightedIcon);

			});

			marker.addListener('mouseout', function() {
				this.setIcon(defaultIcon);
			});


		}

		
		showListings();
		// document.getElementById('show-listings').addEventListener('click', showListings);
		// document.getElementById('hide-listings').addEventListener('click', hideListings);

	}	



	function makeMarkerIcon(markerColor) {

		var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
	          new google.maps.Size(21, 34),
	          new google.maps.Point(0, 0),
	          new google.maps.Point(10, 34),
	          new google.maps.Size(21,34));
	    return markerImage;
	} 


	function showListings() {
		
		var bounds = new google.maps.LatLngBounds();

		for (var i = 0; i < markers.length; i++) {

			markers[i].setMap(map);
			bounds.extend(markers[i].position);
		}

		map.fitBounds(bounds);
	}


	function populateInfoWindow(marker, infowindow) {

		// Checkt ob das InfoWindow nicht schon offen ist
		if (infowindow.marker != marker) {

			infowindow.makrer = marker;
			infowindow.setContent('<div>' + marker.title + '</div>');
			infowindow.open(map, marker);

			infowindow.addListener('closeclick', function(){

			infowindow.setMarker(null);

			});
		}
	}




function mapStyle() {

	// Sets the Style of the Map
	var styleArray = [

	{
	"featureType":"administrative",
	"elementType":"all",
	"stylers":[{
		"visibility":"off"
		}]
	},
	{
	"featureType":"landscape",
	"elementType":"all",
	"stylers":[{
		"visibility":"simplified"},
		{"hue":"#0066ff"},
		{"saturation":74},
		{"lightness":100}]},

	{
	"featureType":"poi",
	"elementType":"all",
	"stylers":[{
		"visibility":"simplified"}]},

	{
	"featureType":"road",
	"elementType":"all",
	"stylers":[{
		"visibility":"on"}]},
	{
	"featureType":"road.highway",
	"elementType":"all",
	"stylers":[{
		"visibility":"on"},
		{"weight":0.6},
		{"saturation":-85},
		{"lightness":61}]},

	{
	"featureType":"road.highway",
	"elementType":"geometry",
	"stylers":[{
		"visibility":"on"}]},

	{
	"featureType":"road.arterial",
	"elementType":"all",
	"stylers":[{
		"visibility":"on"}]},
	{
	"featureType":"road.local",
	"elementType":"all",
	"stylers":[{
		"visibility":"on"}]},

	{
	"featureType":"transit",
	"elementType":"all",
	"stylers":[{
		"visibility":"simplified"}]},
		{
	"featureType":"water",
	"elementType":"all",
	"stylers":[{
		"visibility":"simplified"},
		{"color":"#5f94ff"},
		{"lightness":26},
		{"gamma":5.86
	}]}];

	map.setOptions({styles: styleArray});

}





var model = {

	
	locations: [

	{title: 'Kimchi Princess', location: {lat: 52.498531, lng: 13.426031}},
	{title: 'Tante Biggie', location: {lat: 52.50997, lng: 13.455393}},
	{title: 'Roamers', location: {lat: 52.48553, lng: 13.429323}}

	]

};


var ViewModel = function() {

	// Füllt einfach das "Ergebnisse" aus
	this.name = ko.observable('Ergebnisse:');

	// Das Loc-Array wird in der For-Loop unten mit den Locations aus model.locations gefüllt und dann werden die titles in index.html hinzugefügt
	this.loc = ko.observableArray();

	// Diese for-Schleife füllt das Loc-Array (oben) aus. 
	for (var z = 0; z < model.locations.length; z++) {
		this.loc.push(model.locations[z]);
	}



};



ko.applyBindings(new ViewModel())
var map;
var largeInfoWindow;

//Array für alle Marker
var markers = [];


var globlocation = [];

// Initializes and the map and calls a function to style it
function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {

	center: {lat: 52.47011, lng: 13.441893},
	zoom: 13,
	mapTypeControl: false
	});

	mapStyle();

	var locations = model.locations;	
	model.powerhorse();	
	
	largeInfoWindow = new google.maps.InfoWindow();
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
			
			// Lässt den Marker springen
			marker.addListener('click', function() {
				
				showWikipedia(this.title);

				if (this.getAnimation() !== null) {
					this.setAnimation(null);
				} else {
					this.setAnimation(google.maps.Animation.BOUNCE);
		 		}
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



		fillLocation(locations);
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

// Pushes the locations into global scope
function fillLocation(locationsx) {

	console.log("fillLocation");


	for(var i = 0; i < locationsx.length; i++) {

		globlocation.push(locationsx[i]);

	}

	console.log(globlocation);
	//console.log("ViewModel Location: " + ViewModel.loc);
}





var model = {

	//WAHL
	locations: [

	{title: 'Brandenburger Tor', location: {lat: 52.516270, lng: 13.377703}},
	{title: 'Berliner Fernsehturm', location: {lat: 52.520816, lng: 13.409548}},
	{title: 'Siegessäule', location: {lat: 52.514547, lng: 13.350181}},
	{title: 'Berghain', location: {lat: 52.511100, lng: 13.443091}},
	{title: 'Museum für Naturkunde', location: {lat: 52.530612, lng: 13.380173}}

	],

	powerhorse: function() {
		console.log("huh");
	}

};


var ViewModel = function() {

	var self = this;

	this.filterData = ko.observable("Sehenswürdigkeit suchen!");

	// Füllt einfach das "Ergebnisse" aus
	this.name = ko.observable('Ergebnisse: ');

	// Das Loc-Array wird in der For-Loop unten mit den Locations aus model.locations gefüllt und dann werden die titles in index.html hinzugefügt
	this.loc = ko.observableArray();



	this.wikiTitle = ko.observable("Wikipedia Info");
	this.wikiExtract = ko.observable("");


	// Diese for-Schleife füllt das Loc-Array (oben) aus. 
	for (var z = 0; z < model.locations.length; z++) {
		this.loc.push(model.locations[z]);
	}

	// onClick Function wird ausgelöst, wenn jemand auf das Nav-Bedienemelemt klickt.
	onClick = function() {

		var markerclicked;

		for(var i = 0; i < markers.length; i++) {
		
			if(this.title == markers[i].title) {

				markerclicked = markers[i];

			}
		}

		populateInfoWindow(markerclicked, largeInfoWindow);
		console.log("What is this? " + this.title);
		runSearchClick(this)
		showWikipedia(this.title);

	}

	runSearch = function() {

		// Iteriert über alle Locations
		for(var i = 0; i < self.loc().length; i++) {

			console.log(markers[i].title);

			// wenn der Marker Title True mit der Eingabe ist, wird er deaktiviert
			if(markers[i].title == self.filterData()) {
				for(var x = 0; x < self.loc().length; x++) {
					markers[x].setMap(null);
				}
				markers[i].setMap(map);
				populateInfoWindow(markers[i], largeInfoWindow);
				showWikipedia(markers[i].title)
			}
		}
	}

	// gleiches wie runSearch, wir allerdings von onClick aufgerufen bei Druck auf die buttons
	runSearchClick = function(markerx) {

		// Iteriert über alle Locations
		for(var i = 0; i < self.loc().length; i++) {

			console.log(markers[i].title);

			// wenn der Marker Title True mit der Eingabe ist, wird er deaktiviert
			if(markers[i].title == markerx.title) {
				for(var x = 0; x < self.loc().length; x++) {
					markers[x].setMap(null);
				}
				markers[i].setMap(map);
			}
		}
	}

	//shows the wikipedia info in the dom	
	showWikipedia = function(infoLocation) {

		console.log(infoLocation);
		var wikipedia = "https://de.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" +infoLocation; 		
		console.log(wikipedia);

		var result = '';
		var restultTitle = '';
		$.ajax({
        
            url: wikipedia,
            dataType: "jsonp"
        }).done(function (data) {

        	var pages = data.query.pages;
    	    for(var id in pages) {
        		result = pages[id].extract;
        		restultTitle = pages[id].title;
        		self.wikiExtract("Info: " + result);
        		self.wikiTitle(restultTitle);
       		}

    	})



    }    


	disableLocations = function(aktuelleLocation) {


	}
	
	// LIVE SEARCH. value = eingabe im Feld
	search = function(value) {

		//removes alle li elemente aus dem DOM
		self.loc.removeAll();

		for(var q in model.locations) {
			if(model.locations[q].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        		self.loc.push(model.locations[q]);
        		console.log("PUSHA: " + self.loc()[q]);
      		}
    	}

    	for (var w in markers) {
    	if(markers[w].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
    		console.log("TRUE TRUE");
			for(var x = 0; x < model.locations.length; x++) {
					markers[x].setMap(null);
			}
			markers[w].setMap(map);
			populateInfoWindow(markers[w], largeInfoWindow);
			showWikipedia(markers[w].title);
		} else {

			for(var e = 0; e < self.loc().length; e++) {

				console.log("false false");
				//markers[e].setMap(map);

			}

		}  
	}
}


	// Subscribed die filterData und führt bei jedem Eintrag die Function search aus
	self.filterData.subscribe(search);

};


ko.applyBindings(new ViewModel());



/*
	search = function(value) {
		console.log("MOIN SEARCH");
		console.log("OBEN LOG: " + self.loc()[1].title);

		//removes alle li elemente aus dem DOM
		self.loc.removeAll();

		for(var q in self.loc()) {
			console.log("LOGGE MIR DEN TITLE: " + self.loc()[q].title);
      		if(self.loc()[q].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        		self.loc().push(self.loc()[q]);
      		}
    	}
	}

	// Subscribed die filterData und führt bei jedem Eintrag die Function search aus
	self.filterData.subscribe(search);

};

*/

var myOptions;
var debug= false;
var map;
var nearestOne=null;
var markerList=[];
var myLocation=null;
var geocoder= new google.maps.Geocoder();
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();      
var meeSeva = [{'name': 'meseva',lat:12.111,lon:77.111,'address':'hyderabad'},{'name':'meseva',lat:12.222,lon:77.222,'address':'rangareddy'},{'name':'meeseva',lat:12.444,lon:77.4444,'address':'bhadrachalam'}];

function initialize(){
	DebugPrint("In initialize map");
	myOptions = {
		center:new google.maps.LatLng(17.401097,78.471909),
        zoom:10,
        minZoom:8,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
	map = new google.maps.Map(document.getElementById("map_canvas"),
                      myOptions);
	//createMarker();
    //createMeesevas();
    fetchAndShowMeeSeva();
    createSearchBox();
}

function createSearchBox(){
	var input=document.getElementById('searchBox');
	var options =  {
			componentRestrictions: {country: 'in'}
			//types: ['establishment','geocode','']
	};
	
	var autocomplete =  new google.maps.places.Autocomplete(input, options);
	autocomplete.bindTo('bounds', map);
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		DebugPrint("In Place Changed event");
		var place = autocomplete.getPlace();
        DebugPrint(place);
        RemoveMyLocationMarker();
        RemoveNearestOne();
       // $("#fm").val( place.formatted_address);
		//document.getElementById('to').value =  nearestOne.me.address;
        if (place.geometry.viewport) {
			DebugPrint(place.geometry.viewport);
			//map.fitBounds(place.geometry.viewport);
            createMyLocationMarker(place.geometry.location,place.address_components[0].short_name);
            //fetchAndShowMeeSeva();
        } else {
			createMyLocationMarker(place.geometry.location,place.address_components[0].short_name);  
            map.setCenter(place.geometry.location);
            //map.setZoom(17); 
            //fetchAndShowMeeSeva(); 
         }
	  });
}

function createMyLocationMarker(loc,name){
	myLocation = new google.maps.Marker({
						map: map,
						position: loc,
						draggable:true,
						title:"My Location!",
						animation: google.maps.Animation.DROP
					});
	google.maps.event.addListener(myLocation,'dragend', function (e){
		 var lat =myLocation.getPosition().lat();
		 lat.toPrecision(6);
		 var lng =myLocation.getPosition().lng();
		 lng.toPrecision(6); 
		 $("#searchBox").val(lat+","+lng );
		 GetReverseGeoCode();
		 MarkNearest();
	});
	MarkNearest();
	
}
function FindDirection(){
	DebugPrint("In Find Direction");
	var el = document.getElementById('directions-panel');
	while( el.hasChildNodes() ){
		el.removeChild(el.lastChild);
	}
	//directionsDisplay.setDirections(null);
	
	 
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
	$('#directions-panel').css('display', 'block');
	var selectedMode = document.getElementById('mode').value;
	var request = {
	  origin: myLocation.getPosition(),
	  destination: nearestOne.getPosition(),
	  travelMode: google.maps.TravelMode[selectedMode]
	};
	directionsService.route(request, function(response, status) {
	  if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
	  }
	  else{
		  alert("We could not calculate directions between"+" " + startPoint+" "+"And "+" "+ endPoint);
	  }
	});

}

function RemoveMyLocationMarker(){
	if (myLocation) {
		myLocation.setMap(null);
		myLocation=null;
	}
}

function GetReverseGeoCode(){
	//http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true_or_false
	DebugPrint("In Reverse Geocode");
	var ll=myLocation.getPosition();
	geocoder.geocode({'latLng': ll}, function(results, status) {
		DebugPrint("k");
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				DebugPrint(results[1].formatted_address);
				$("#searchBox").val(results[1].formatted_address);
			} else {
				return null;
				//alert("No results found");
			}
		} else {
			return null;
			//DebugPrint("Geocoder failed due to: " + status);
		}
	});
	
}

function fetchAndShowMeeSeva (){
	var data={action:'getMeeSeva'};
	var ajaxCall = $.ajax({
			url:'/',
			data:data,
			success: function (response){createMeeSevas(response);
			                              },
			error: function(response) {alert("Some thing wrong happend!")}
		 });
}

function createMeeSevas(r){
	var r = JSON.parse(r);
	DebugPrint("In Create Mesevas");
	DebugPrint(r);
	for(var i=0;i<r.length;i++){
		createMarker(r[i]);
	}
	
}

function createMarker (me){
	var lat= parseFloat(me.lat);
	var lon= parseFloat(me.lon);
	var mycollege = new google.maps.LatLng(lat,lon);
	var marker = new google.maps.Marker({
						map: map,
						position: mycollege,
						animation: google.maps.Animation.DROP,
						title:"MeeSeva",
						icon : "img/blue.png"
					});
	var infopop = new google.maps.InfoWindow();
	marker.r=me;
	google.maps.event.addListener(marker,'click', function (){
		    var p1=marker.getPosition();
		    var p2;
		    var dist;
		    DebugPrint(p1);
		    if(myLocation){
				p2 = myLocation.getPosition();
				dist = calculateDistance(p1,p2);
		    }
		    var c="<div style='width:300px;height:200px;font-size:11px;'> ";
		    //c+="<div style='width:260px;height:280px'> <img src='data/226.jpg' style='width:250px;height:250px' ></img></div>";
		    c+="<b>Name : </b> Meeseva";
		    c+="</br> <b>Manager Name : </b> "+ me.agent_name;
		    c+="</br> <b>Address : </b>"+me.address;
		    c+="</br> <b>Mandal :  </b> "+me.mandal;
		    //c+="</br><b>District : </b> "+me.district;
		    c+= "</br><b>village : </b> "+me.village;
		    if(myLocation){
				c+="</br><b> Distance : </b>"+dist+" KM";
		    }
		    c+="<div>";
		    infopop.setContent(c);
			//infopop.c=m.r;
			infopop.maxWidth=400;
			//infopop.maxHeight=200;
			infopop.open(map,marker);
			marker.dist=dist;
		});
	markerList.push(marker);
	
}

function calculateDistance (loc1,loc2){
	var l1=loc1.lat();
	var l2= loc2.lat();
	var t1=loc1.lng();
	var t2=loc2.lng();
	//DebugPrint("Square of latDif"+l1);
	var distance =(Math.sqrt(Math.pow(l1-l2,2)+Math.pow(t1-t2,2)))*111.11;
	var dist= google.maps.geometry.spherical.computeDistanceBetween(loc1,loc2);
	distance= Math.round(distance);
	//distance= distance.toPrecision(5);
	return distance;
}

function MarkNearest (){
	if(nearestOne){
		RemoveNearestOne();
	}
	DebugPrint("In Mark Nearest");
	var l1=myLocation.getPosition();
	var l2=markerList[0].getPosition();
	var minDist =calculateDistance(myLocation.getPosition(),markerList[0].getPosition());
	nearestOne=markerList[0];

	for (var i=0;i<markerList.length;i++){
		var dist=calculateDistance(myLocation.getPosition(),markerList[i].getPosition());
		if (dist<minDist){
			minDist=dist;
			nearestOne=markerList[i];
			markerList[i].mindist=true;
			markerList[i-1].minsdist=false;
		}
		else{
			markerList[i].mindist=false;	
		}
	}
	DebugPrint(minDist);
	DebugPrint("minDist ");
	MakeNearestMeSeva(minDist)

}

function MakeNearestMeSeva(minDist){
	nearestOne.setIcon({url:"img/mm8.png"});
	nearestOne.setAnimation(google.maps.Animation.BOUNCE);
	nearestOne.setTitle("Nearest MeeSeva");
	$("#to").val(nearestOne.r.address);
	$("#Total_km").html("<b>Approx Distance : </b>"+minDist+"KM");
}

function DebugPrint (msg){
	if (debug){
		console.log(msg);
	}	
}

function RemoveNearestOne(){
	if(nearestOne){
		nearestOne.setIcon({url:"img/blue.png"});
		nearestOne.setAnimation(null);
		nearestOne.setTitle("MeeSeva");
		
	} 
}

function HideAllMarkersAndShowMe(){
	DebugPrint("Will show only two things");
	
}

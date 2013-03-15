var myOptions;
var map;
var debug=true;
//var marker;
var markerList=[];
var myLocation=null;
var distance=0;
var mark;
var endp1;
var endp2;
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var meeSeva = [{'name':'meeseva',lat:13.907541,lon:79.89849,'address':'Naidupeta','agent_name':'Kunisetty Venkateswarlu','mandal':'Naidupeta','village':'Naidupeta'},
			  {'name':'meeseva',lat:15.016933,lon:79.138853,'address':'Seetharamapuram','agent_name':'Eary Sailendra Sagar','mandal':'Seetharamapuram','village':'Seetharamapuram'},
              {'name':'meeseva',lat:18.135587,lon:78.818364,'address':'Pullur','agent_name':'G.Venkatesham','mandal':'Siddipet','village':'Pullur'}];
function initialize(){
	console.log("In Initialize Map");
	myOptions= { 
	    center:new google.maps.LatLng(22.268767,78.215331),
	    zoom:5,
	    minzoom:5,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	//createMarker();
	createSearchBox();
	//createMeeseva();
	}
function createSearchBox(){
	var input=document.getElementById('searchBox');
	
    var options = { 
		    componentRestrictions:  {country: 'in'}, 
			//types: ['establishment','geocode','']
	};
	var autocomplete= new google.maps.places.Autocomplete(input,options);
	autocomplete.bindTo('bounds',map);
	google.maps.event.addListener(autocomplete,'place_changed', function(){
        var place = autocomplete.getPlace();
		DebugPrint(place);
		//alert(place.formatted_address);
		document.getElementById('fm').value=place.formatted_address;
		document.getElementById('to').value =  meeSeva[0].address;
		//removeLocationMarker();

        if(place.geometry.viewport){
			map.fitBounds(place.geometry.viewport);
			createLocationMarker(place.geometry.location,place.address_components[0].short_name);
			createMeeseva();
		   //fetchAndShowMeeSeva();
		} else {
			createLocationMarker(place.geometry.location,place.address_components[0].short_name);
			//map.setCenter(place.geometry.location);
			//map.setZoom(1);
			createMeeseva();
		//fetchAndShowMeeSeva();
	   }  
	});   
	createMeeseva();
}

function myDirection(){
	var el = document.getElementById('directions-panel');
		while( el.hasChildNodes() ){
			el.removeChild(el.lastChild);
		}
	    var startPoint = document.getElementById('fm').value;
		var endPoint = document.getElementById('to').value;
		if(startPoint=="" || endPoint==""){
			alert("Please Enter the Location");
			return;
		}
	  	var myOptions = {
		center:new google.maps.LatLng(13.268764,78.215331),
        zoom:1,
        minZoom:1,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
    
    map = new google.maps.Map(document.getElementById("map_canvas"),
                      myOptions);
		directionsDisplay = new google.maps.DirectionsRenderer();       
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directions-panel'));
	$('#directions-panel').css('display', 'block');
	var selectedMode = document.getElementById('mode').value;
	var request = {
	  origin: startPoint,
	  destination: endPoint,
	  travelMode: google.maps.TravelMode[selectedMode]
	};
	directionsService.route(request, function(response, status) {
	  if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
	  }
	  else{
		//  var directionNotFound = 
			  //directionsDisplay.setDirections(response);
		  alert("We could not calculate directions between"+" " + startPoint+" "+"And "+" "+ endPoint);
	  }
	});
}
function calculateDistance(loc1,loc2){
  DebugPrint("in calculate distance");
  var distance = Math.sqrt(Math.pow((loc2.lat()-loc1.lat()),2)+Math.pow((loc2.lng()-loc1.lng()),2))*111.111;
  DebugPrint("Distance: "+distance);
 // distance = Math.round(distance,6);
  return distance;
}
function createLocationMarker(loc,name){
     myLocation= new google.maps.Marker({
		 map: map,
         position: loc,
         draggable:true,
         title: name,
		 animation: google.maps.Animation.DROP
	 });
}
function removeLocationMarker(){
   if (myLocation)
   {
	   myLocation.setMap(null);
	   myLocation=null;
   }
}
function createMeeseva(){
 DebugPrint("In Create Meeseva");
	for(var i=0;i<meeSeva.length;i++)
	{
		 DebugPrint(meeSeva[i]);
	     createMarker(meeSeva[i]);
	}
 
}
function fetchAndShowMeeSeva(){
   var data = {action: 'getMeeSeva'};
   var ajaxCall = $.ajax({
	   url:'/',
       data:data,
       success: function(response){createMeeSevas(response);
	   },
       error: function (response){ alert("error")}
	   });
 }
function createMeeSevas(r){
   var r = JSON.parse(r);
   DebugPrint("In Create Meesevas");
   DebugPrint(r);
   for (var i=0;i<r.length;i++){
	   createMarker(r[i]);
   }
}
function createMarker(me){
	DebugPrint("Create Marker");
	var p1;
	var p2=null;
	var dist=0;
	var lat= parseFloat(me.lat);
	var lon = parseFloat(me.lon);
	var mycollege= new google.maps.LatLng(lat,lon);
	var marker = new google.maps.Marker({
		    map: map,
			position: mycollege,
			animation: google.maps.Animation.DROP,
            icon: "img/mm8.png"
   	})
  //   myInfoWin();
    //var img = n
    
   //  marker.setCenter(mycollege);
	//markerlist.push(marker);
	    p1 = marker.getPosition();
	   if (myLocation != null)
		{
		   p2 = myLocation.getPosition();
		   DebugPrint("p2"+p2);
		}
		if ( p2 != null)
         {
		    dist = calculateDistance(p1,p2);
			
         }
	 	var infopop= new google.maps.InfoWindow();
	google.maps.event.addListener(marker,'click',function(){
        //alert("dist"+dist);
      	var c = "<div class='smallone' style='width:300px;height:200px;font-size:11x'>";
		c+="<b> Name: </b>"+me.name;
	    c+="<br><b> Manager Name: </b>"+me.agent_name;
		c+="<br><b> Address: </b>"+me.address;
		c+="<br><b> Mandal: </b>"+me.mandal;
		c+="<br><b> Village: </b>"+me.village;
		c+="<br><b> Distance: </b>"+dist+" km";
		c+="</div>";
		infopop.setContent(c);
		infopop.maxWidth=400;
		infopop.open(map,marker);
	})
    markerList.push(marker);
	
}
function myInfoWin(){
  	var infopop= new google.maps.InfoWindow();
	google.maps.event.addListener(marker,'click',function(){
		var c = "<div class='smallone' style='width:300px;height:200px;font-size:11x'>";
		c+="<b> Name: </b> Mee seva";
	    c+="<br><b> Location: </b> address";
		c+="<br><b> Manager Name: </b> Manager Name";
		c+="</div>";
		infopop.setContent(c);
		infopop.maxWidth=400;
		infopop.open(map,marker);
	})

}
function DebugPrint(msg){
 if (debug){
	 console.log(msg);
  }
}

var app = angular.module('ourApp');

app.controller('mapController', function($scope, eventService) {
  var markerArray = [];
  $scope.formItem = {};
  $scope.events;

  var map, infoWindow;

  function initMap() {
    var styledMapType = new google.maps.StyledMapType(
      [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
      );

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.3314, lng: -83.0458},
      zoom: 14,
      mapTypeControlOptions: {
        mapTypeIds: ['styled_map']
      }
    });

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var marker = new google.maps.Marker({
          position:{lat:position.coords.latitude, lng:position.coords.longitude},
          icon: '../img/blueCir.png',
          map:map
        });

        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);
        // console.log(pos);
        map.setZoom(14);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  initMap();

  $scope.getEvents = function() {
    eventService.getLocalEvents($scope.lat, $scope.long).then(function(response) {
      console.log("response = r " + response);
      // for (var i = 0; i < response.length; i++) {
      //   var dateAdded = response[i].timeadded;
      //   var endate = new Date();
      //   var seconds = (dateAdded.getTime() - startDate.getTime()) / 1000;
      //   response[i].timeLeft = seconds;
      // }

      var eventArr = response;
      $scope.events=response;
      console.log($scope.lat);
      console.log(eventArr);
      console.log(response);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          console.log(pos);
            // console.log(eventArr);

            var cityCircle = new google.maps.Circle({
              strokeColor: '#7cdaf9',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#7cdaf9',
              fillOpacity: 0.35,
              map: map,
              center: pos,
              radius: 1609.34
            });

            for(i=0; i < eventArr.length; i++){
              //   var contentString='eventArr.eventname';
              //   var infowindow = new google.maps.InfoWindow({
              //   content: contentString
              // });

              var marker = new google.maps.Marker({
                position: { lat:Number(eventArr[i].lat), lng:Number(eventArr[i].lng) },
                map:map,
                title: eventArr[i].eventname,
                date: eventArr[i].date,
                hood: eventArr[i].hood
              });

              // markerArray.push(marker);

              (function(marker, i) {
                google.maps.event.addListener(marker, 'click', function() {
                  infowindow = new google.maps.InfoWindow({
                    content: "<div class='markerInfo'>"+marker.title+"<br>"+marker.date+"<br>"+ marker.hood+"</div>"
                  });
                  infowindow.open(map, marker);
                });
              })(marker, i);

            }
            //
            // marker.addListener('click', function() {
            //   console.log(marker);
            //   infoWindow.open(map, marker);
            //   infoWindow.setContent("<div class='markerInfo'>"+marker.title+"<br>"+marker.date+"<br>"+ marker.hood+"</div>");
            // });

          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
      } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

      });
  }

// $scope.getEvents();
getLocation();
function getLocation () {
  eventService.getAllEvents().then(function(eventArr) {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };


        // console.log(pos);
        $scope.lat = pos.lat;
        $scope.long = pos.lng;
        eventService.getLocalEvents($scope.lat,$scope.long);
        $scope.getEvents();

      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

  });
}

});

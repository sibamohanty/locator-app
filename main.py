import unittest
from google.appengine.api import memcache
from google.appengine.ext import db
from google.appengine.ext import testbed
import cgi
import os
#import datetime
#from datetime import datetime,date, time
#import model

from django.utils import simplejson

import model
#from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app


class AppPage(webapp.RequestHandler) :
  def get(self) :
    action = self.request.get('action')
    if not action :
      self.response.out.write("""
<!DOCTYPE html>
<html lang="en">
  <head>
    <title> MeeSeva Locator</title>
    <meta name ="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="description" content="MeeSeva Locator">
    <meta name="author" content="Siba Mohanty">
    <link href="css/bootstrap.css" rel="stylesheet" media="screen" />
    <!--script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?&amp;v=3;&amp;key=AIzaSyDu2XKr_cl_K0Lf7YmphoIyKI5GoZfORaE&sensor=false">
          </script-->

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=geometry,places&sensor=false&v=3.exp"></script>
  </head>
  <body onload="initialize()">
   <!--input  id="searchBox" type="text" style="width:200px;height20px"> <b>To find the nearest MeeSeva</--b>
   <!--div id="map_canvas" style="height:700px;width:100% "></div-->
   Find Your Nearest MeeSeva!!
   <br>
    <div class="container-fluid">
		      <div class="row-fluid">
			     <div class="span2">
				   <div id="direct"  >
				  		<b>Your Location:</b><input type="text" id="searchBox" style="width:175px;height20px;">
						<br><b>Nearest MeeSeva </b><input type="text" id="to" style="width:175px;height20px;">
						<div id="Total_km"> </div>
						<br><b>Mode of Travel:
						<select id="mode" style="width:90px;">
							<option value="DRIVING">Driving</option>
							<option value="WALKING">Walking</option>
							<option value="BICYCLING">Bicycling</option>
							<option value="TRANSIT">Transit</option>
						</select>
						<br>
					    
					  <button onClick="FindDirection()">Directions</button>
					  <br>
					  <div id="directions-panel" style="overflow:scroll;height:400px;background-color:#bfbfbf;display:none"></div>
					 </div>
				 </div>
		         <div class ="span10">
				   <div id="map_canvas" style="height:700px;width:100%;background-color:#bfbfbf"></div>
		          </div>
              </div>     
   
  <script src="http://code.jquery.com/jquery-latest.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/main.js"></script>
  </body>

</html>
      
      
      """)

    elif action == 'test':
		self.response.out.write("""test action """)
    elif action == 'getMeeSeva':
		meesevas = db.GqlQuery("SELECT * from meeseva_info")
		ab = []
		for meeseva in meesevas:
			t={}
			key = meeseva.key().id_or_name()
			t ={"lat":meeseva.lat,"lon":meeseva.lon,"contact": meeseva.contact,"address":meeseva.address,"auth_center_name":meeseva.authorized_center_name,"district":meeseva.district,"mandal":meeseva.mandal,"village":meeseva.village,"agent_name":meeseva.agent_name}
			ab.append(t)
		ab= simplejson.dumps(ab)
		self.response.out.write(ab)
    		
    
		


application = webapp.WSGIApplication([('/', AppPage)],debug=True)



def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()


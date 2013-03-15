from google.appengine.ext import db

class meeseva_info(db.Model):
	"""Models a meeseva with lat,lon, address """
	authorized_center_name = db.StringProperty()
	address = db.TextProperty()
	district = db.TextProperty() 
	lat = db.StringProperty()
	lon = db.StringProperty()
	mandal =db.StringProperty()
	village = db.StringProperty()
	auth_agent_id = db.StringProperty()
	reg_date = db.StringProperty()
	contact = db.StringProperty()
	agent_name = db.StringProperty()
	auth_center_name = db.StringProperty()
	
#Name	ISO 3166-2 code[2]	Population	Area	Official Capital	Official Largest city	Population density	Literacy Rate(%)	Percentage of Urban Population to total Population	Sex Ratio
	
class IndiaStates(db.Model):
	"""Models an indian state with some state"""
	name = db.StringProperty()
	iso_code=db.StringProperty()
	population = db.StringProperty()
	area = db.StringProperty()
	capital = db.StringProperty()
	largest_city = db.StringProperty()
	official_lang =db.StringProperty()
	population_density= db.StringProperty()
	literacy_rate =db.StringProperty()
	percentage_of_urban_total_pop =db.StringProperty()
	sex_ratio = db.StringProperty() 
	
	
	

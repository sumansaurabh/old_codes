#!/usr/bin/env python

import webapp2
import urllib2,json
import jinja2
import os

from google.appengine.api import mail
from google.appengine.api import users

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)



class MainHandler(webapp2.RequestHandler):

	def post(self):
		
		subject=self.request.get('subject')
		message = self.request.get('message');
		user = users.get_current_user();
		output=self.validate(subject,message,user);
		
		#output={'message':msg}
		output=json.dumps(output)
		self.response.out.write(output)
		
		
		



	def validate(self,subject,messagebody,user):
		msg="failed"
		sender = "\"Suman Saurabh\" <info@suman-saurabh.appspotmail.com>"



		if user is None:
			login_url = users.create_login_url(self.request.path)

			#print login_url;
			#self.redirect(login_url)
			return {'login_url':login_url,'message':msg}

		message = mail.EmailMessage()
		message.sender = sender
		message.to = "sumanrocs@gmail.com";
		message.subject=subject;
		message.body="""Sender: """+str(user)+"""
		Content:->
		"""+messagebody;
		message.send()

			
		message.sender = sender
		message.to = user.email()
		message.subject="Notification mail, Your message has been recieved"
		message.body = """
Hi,

Thank you for visiting my profile, I will reply to you shortly.

Regards,
Suman Saurabh

PS: This is a computer generated message, please do not respond to it.
""" 
		message.send()
		
		
		return {'login_url':"",'message':"sucess"};


		


		
	def get(self):
		
		template_values = {}
		self.display(template_values);

		
	def display(self,template_values):

		template = JINJA_ENVIRONMENT.get_template('templates/index.html')
		self.response.write(template.render(template_values))
		pass
		return;

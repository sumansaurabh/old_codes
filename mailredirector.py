import logging, email, cgi
from google.appengine.ext import webapp
from google.appengine.ext.webapp.mail_handlers import InboundMailHandler
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import mail


# Use prefix matching on username part of email address
#  and fwd the email to addresses based on that part.
class MailRedirector(InboundMailHandler):
    sender = "\"Suman Saurabh\" <info@suman-saurabh.appspotmail.com>"

    
    mailaddress = "sumanrocs@gmail.com";

    def recipient_of_pattern(self, recipient):
        
        return MailRedirector.mailaddress

    # called by GAE when an email is received.
    def receive(self, inmsg):
        # log this msg for kicks
        # download the logs to dev machine using:
        # appcfg.py --severity=0 request_logs <appname> <file_to_dump>
        if not hasattr(inmsg, 'subject'):
            inmsg.subject = "####No subject####"

        logging.info("Received a message from: " + inmsg.sender +
                    ", to " + inmsg.to + ", subject: " + inmsg.subject)
        # now make a message object that can be submitted to GAE
        oumsg = mail.EmailMessage()


        # GAE doesn't allow setting the From address to arbitary
        # values. Workaround: Set the sender as the mail redirector
        # and specify the original sender in the body of the email.
        oumsg.sender = MailRedirector.sender

        # is incoming message from the address from which we send? if so,
        # somebody spoofed the address, or GAE encountered an
        # error sending the email and sent an err msg back.
        # for now, just log the event and ignore it. TODO
        # distinguish between error messages and potential loop/spoof.
        inmsg_email_address = email.utils.parseaddr(inmsg.sender)[1]
        my_email_address = email.utils.parseaddr(MailRedirector.sender)[1]
        if inmsg_email_address == my_email_address:
            logging.error("Oops. loop/err/spoof? sender: " + inmsg.sender +
                "subject: " + inmsg.subject + " at date: " + inmsg.date)
            return


        # compute the address to forward to
        oumsg.to = self.recipient_of_pattern(inmsg.to)
        # at least we are allowed to set an arbitrary subject :)
        oumsg.subject = inmsg.subject

        # gather up the plain text parts of the incoming email
        # and cat them together. Add original sender as body text prefix
        # since we can't set the sender to anything we please.
        # InboundMailMessage can handle multiple plaintext parts
        # but outbound requires a single body field. Hence no option
        # but to cat the multiple parts if present.
        body = None

        for plaintext in inmsg.bodies(content_type='text/plain'):
            if body == None:
                body = "####Original sender: " + inmsg.sender + " and recipient: " + inmsg.to + " #####\n\n"
            body = body + plaintext[1].decode()

        if body == None:
            # corner case: if no body, oumsg.send() will fail. This is
            # a GAE limitation: no emails without body. Set a special
            # string as body.
            oumsg.body = "####Original email had no body text.####"
        else:
            oumsg.body = body

        # do similar things as plaintext for the html parts.
        html = None
        for htmlpart in inmsg.bodies(content_type='text/html'):
            if html == None:
                html = "<P style=\"color: red\">Original sender: " + cgi.escape(inmsg.sender) + " and recipient: " + cgi.escape(inmsg.to) + "<br></br><br></br></p>"
            html = html + htmlpart[1].decode()


        # corner case: if no html in original, dont put one in new
        if html != None:
            oumsg.html = html
        # TODO: attach the attachments.
        logging.info("Sending message to: " + oumsg.to)
        # queue it for sending
        oumsg.send()

        return
application = webapp.WSGIApplication([MailRedirector.mapping()], debug=True )
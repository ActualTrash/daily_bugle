FROM httpd:latest

# Copy your local web content to the Apache document root
COPY ./index.html /usr/local/apache2/htdocs/

# Copy custom Apache configuration
COPY ./custom-httpd.conf /usr/local/apache2/conf/extra/custom-httpd.conf

# Include the custom configuration in the main Apache configuration
RUN echo "Include conf/extra/custom-httpd.conf" >> /usr/local/apache2/conf/httpd.conf

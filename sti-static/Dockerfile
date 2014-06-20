FROM vlipco/mini

MAINTAINER Francisco Pinzon <pacho@vlipco.co>

ENV STI_SCRIPTS_URL https://raw.githubusercontent.com/vlipco/docker-images/master/sti-static/.sti/bin

#Install build dependencies
RUN yum -y install pcre-devel wget

#Download nginx, pagespeed and nginx module
RUN wget http://nginx.org/download/nginx-1.6.0.tar.gz https://github.com/pagespeed/ngx_pagespeed/archive/v1.8.31.3-beta.zip 


RUN tar -xvzf nginx-1.6.0.tar.gz && unzip v1.8.31.3-beta.zip && rm nginx-1.6.0.tar.gz v1.8.31.3-beta.zip

#RUN cd ngx_pagespeed-1.8.31.3-beta/ && wget https://dl.google.com/dl/page-speed/psol/1.8.31.3.tar.gz && tar -xzvf 1.8.31.3.tar.gz && rm 1.8.31.3.tar.gz

#RUN cd nginx-1.6.0/ && ./configure --add-module=/app/ngx_pagespeed-1.8.31.3-beta && make && make install



#baja y desc psol en ngx_pagesped. just there.


#RUN ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx

#ADD conf/nginx.conf /usr/local/nginx/conf/

#RUN mkdir /var/ngx_pagespeed_cache
#RUN useradd nginx && chown -R nginx /usr/local/nginx /var/ngx_pagespeed_cache

#USER nginx

#RUN echo `ls -Al /usr/local/nginx/`
#########################
#EXPOSE 5000

#CMD ["/usr/bin/nginx", "-p", "/nginx/"]

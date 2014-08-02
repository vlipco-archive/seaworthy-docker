FROM vlipco/mini

MAINTAINER David Pelaez <david@vlipco.co>

#Install build dependencies
RUN yum -y install gcc-c++ pcre-devel zlib-devel

ENV NPS_VERSION 1.8.31.4
ENV NGINX nginx-1.6.0

#Download and install nginx, ngx_pagespeed and psol.
RUN cd /tmp && \
	curl -Ls "https://github.com/pagespeed/ngx_pagespeed/archive/release-${NPS_VERSION}-beta.tar.gz" \
	| tar xfz - && \
 	curl -Ls "https://dl.google.com/dl/page-speed/psol/$NPS_VERSION.tar.gz" \
	| tar xzf - -C ngx_pagespeed-release-${NPS_VERSION}-beta && \
 	curl -Ls "http://nginx.org/download/$NGINX.tar.gz" \
	| tar xzf - && \
 	cd $NGINX && ./configure --add-module=/tmp/ngx_pagespeed-release-${NPS_VERSION}-beta && make && make install


RUN cd /usr/local/bin && curl -Ls https://github.com/davidpelaez/shoreman/raw/dpt-additions/shoreman.sh > shoreman && chmod +rx /usr/local/bin/shoreman

ADD .sti/conf /nginx/conf
RUN mkdir /nginx/logs && chown -R fakeuser:fakeuser /nginx && touch /nginx/logs/{error,access}

EXPOSE 5000

ENV STI_SCRIPTS_URL https://raw.githubusercontent.com/vlipco/seaworthy-docker/master/sti-static/.sti/bin

CMD ["/usr/local/bin/shoreman", "/nginx/conf/Procfile"]

FROM vlipco/mini

MAINTAINER Francisco Pinzon <pacho@vlipco.co>

ENV STI_SCRIPTS_URL https://raw.githubusercontent.com/vlipco/docker-images/master/sti-static/.sti/bin

#Install build dependencies
RUN yum -y install gcc-c++ pcre-devel zlib-devel

ENV NPS_VERSION 1.8.31.4
ENV NGINX nginx-1.6.0

EXPOSE 80

#Download ngx_pagespeed
RUN cd /tmp && \
	curl -Ls "https://github.com/pagespeed/ngx_pagespeed/archive/release-${NPS_VERSION}-beta.tar.gz" \
	| tar xfz - && \
 	curl -Ls "https://dl.google.com/dl/page-speed/psol/$NPS_VERSION.tar.gz" \
	| tar xzf - -C ngx_pagespeed-release-${NPS_VERSION}-beta && \
 	curl -Ls "http://nginx.org/download/$NGINX.tar.gz" \
	| tar xzf - && \
 	cd $NGINX && ./configure --add-module=/tmp/ngx_pagespeed-release-${NPS_VERSION}-beta && make && make install
FROM vlipco/hull
MAINTAINER David Pelaez <david@vlipco.co>
RUN cd /usr/local/bin && wget -q -O shoreman \
  "https://raw.githubusercontent.com/davidpelaez/shoreman/dpt-additions/shoreman.sh" \
  && chmod +x shoreman
ENV STI_SCRIPTS_URL https://raw.githubusercontent.com/vlipco/docker-images/master/sti-ruby/sti
EXPOSE 5000
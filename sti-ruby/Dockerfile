FROM vlipco/hull
MAINTAINER David Pelaez <david@vlipco.co>

RUN cd /usr/local/bin && wget -q -O shoreman https://github.com/davidpelaez/shoreman/raw/dpt-additions/shoreman.sh && chmod +rx /usr/local/bin/shoreman

ENV STI_SCRIPTS_URL https://raw.githubusercontent.com/vlipco/docker-images/master/sti-ruby/.sti/bin

EXPOSE 5000
USER fakeuser
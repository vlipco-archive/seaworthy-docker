FROM vlipco/hull
MAINTAINER David Pelaez <david@vlipco.co>

# raw url to davidpelaez/shoreman/dpt-additions/shoreman.sh
ADD http://bit.ly/1irS6WM /usr/local/bin/shoreman
RUN ls /usr/local/bin && chmod +x /usr/local/bin/shoreman

# raw url to vlipco/docker-images/sti-ruby/sti folder
ENV STI_SCRIPTS_URL http://bit.ly/1kKKyCZ

EXPOSE 5000
USER fakeuser
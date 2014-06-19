FROM vlipco/mini
MAINTAINER David Pelaez <david@vlipco.co>

RUN cd /usr/local/src && curl -L -s \
  "https://github.com/postmodern/ruby-install/archive/v0.4.3.tar.gz" \
  > ruby-install-0.4.3.tar.gz && \
  tar xzf ruby-install-0.4.3.tar.gz && cd ruby-install-0.4.3 && make install && \
  ruby-install -i /usr/local/ ruby $RUBY_VERSION -- --disable-install-rdoc 2> /dev/null && \
  gem install bundler && rm -rf /usr/local/src/* && rm -rf /tmp/* && yum clean all

RUN cd /usr/local/bin && wget -q -O shoreman https://github.com/davidpelaez/shoreman/raw/dpt-additions/shoreman.sh && chmod +rx /usr/local/bin/shoreman

ENV STI_SCRIPTS_URL https://raw.githubusercontent.com/vlipco/docker-images/master/sti-ruby/.sti/bin

EXPOSE 5000
USER fakeuser
FROM vlipco/mini
MAINTAINER David Pelaez <david@vlipco.co>

RUN yum upgrade -y && yum install -y automake gdbm-devel libffi-devel libyaml-devel \
  openssl-devel ncurses-devel readline-devel zlib-devel ruby-devel \
  libxml2 libxml2-devel libxslt libxslt-devel git mysql-devel

RUN cd /usr/local/src && curl -L -s \
  "https://github.com/postmodern/ruby-install/archive/v0.4.3.tar.gz" \
  > ruby-install-0.4.3.tar.gz && \
  tar xzf ruby-install-0.4.3.tar.gz && cd ruby-install-0.4.3 && make install && \
  ruby-install -i /usr/local/ ruby $RUBY_VERSION -- --disable-install-rdoc 2> /dev/null && \
  rm -rf /usr/local/src/* && rm -rf /tmp/* && yum clean all
  
RUN gem install bundler && bundle config build.nokogiri --use-system-libraries

RUN cd /usr/local/bin && curl -Ls https://github.com/davidpelaez/shoreman/raw/dpt-additions/shoreman.sh > shoreman && chmod +rx /usr/local/bin/shoreman

ENV STI_SCRIPTS_URL https://raw.githubusercontent.com/vlipco/seaworthy-docker/master/sti-ruby/.sti/bin

EXPOSE 5000

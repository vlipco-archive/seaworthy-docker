FROM fedora:20

ADD ./bashrc /app/.bashrc

ENV RUBY_VERSION 2.1.1
ENV HOME /app
# perl-Digest git 
RUN yum upgrade -y -x 'iputils*' -x 'systemd*' && \
  yum install -y gcc make curl unzip \
  openssl-devel gcc-c++ bzip2 automake gdbm-devel \
  libffi-devel libyaml-devel openssl-devel ncurses-devel \
  readline-devel zlib-devel 2> /dev/null && yum clean all

RUN cd /usr/local/src && curl -L -s "https://github.com/postmodern/ruby-install/archive/v0.4.3.tar.gz" > ruby-install-0.4.3.tar.gz && \
  tar xzf ruby-install-0.4.3.tar.gz && cd ruby-install-0.4.3 && \
  make install && ruby-install -i /usr/local/ ruby $RUBY_VERSION 2> /dev/null && \
  gem install bundler

RUN mkdir -p /app && groupadd -r fakeuser -f -g 433 && \
  useradd -u 431 -r -g fakeuser -d /app -s /sbin/nologin -c "Fake User" fakeuser && \
  chown -R fakeuser:fakeuser /app

RUN rm -rf /usr/local/src/*

WORKDIR /app

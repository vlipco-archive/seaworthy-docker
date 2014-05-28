FROM fedora:20

ADD ./bashrc /app/.bashrc

ENV RUBY_VERSION 2.1.1
ENV HOME /app

RUN yum upgrade -y -x 'iputils*' -x 'systemd*' && \
  yum install -y vim gcc make git mercurial wget perl-Digest curl nc unzip \
  openssl-devel gcc-c++ golang zsh wget bzip2 automake gdbm-devel \
  libffi-devel libyaml-devel openssl-devel ncurses-devel \
  readline-devel zlib-devel 2> /dev/null && yum clean all

RUN cd /usr/local/src && wget -q -O ruby-install-0.4.3.tar.gz \
  "https://github.com/postmodern/ruby-install/archive/v0.4.3.tar.gz" && \
  tar xzf ruby-install-0.4.3.tar.gz && cd ruby-install-0.4.3 && \
  make install && ruby-install -i /usr/local/ ruby $RUBY_VERSION 2> /dev/null && \
  gem install bundler

RUN mkdir -p /app && groupadd -r fakeuser -f -g 433 && \
  useradd -u 431 -r -g fakeuser -d /app -s /sbin/nologin -c "Fake User" fakeuser && \
  chown -R fakeuser:fakeuser /app

RUN rm -rf /usr/local/src/*

WORKDIR /app
USER fakeuser

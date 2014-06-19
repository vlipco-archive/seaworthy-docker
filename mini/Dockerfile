FROM centos

ADD ./bashrc /app/.bashrc

ENV HOME /app

RUN yum upgrade -y && yum install -y vim unzip bzip2 tar gcc make

RUN mkdir -p /app && groupadd -r fakeuser -f -g 433 && \
  useradd -u 431 -r -g fakeuser -d /app -s /sbin/nologin -c "Fake User" fakeuser && \
  chown -R fakeuser:fakeuser /app

RUN rm -rf /tmp/* && yum clean all

WORKDIR /app

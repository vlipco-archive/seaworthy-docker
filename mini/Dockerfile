FROM centos

ADD ./bashrc /app/.bashrc

ENV HOME /app
# enable centosplus to avoid a bug with selinux

RUN sed -i '/^\[centosplus\]$/,/^\[/ s/^enabled=0$/enabled=1/' \
    /etc/yum.repos.d/CentOS-Base.repo && yum upgrade -y && yum install -y \
    vim unzip bzip2 tar gcc make

RUN mkdir -p /app && groupadd -r fakeuser -f -g 433 && \
  useradd -u 431 -r -g fakeuser -d /app -s /sbin/nologin -c "Fake User" fakeuser && \
  chown -R fakeuser:fakeuser /app

RUN rm -rf /tmp/* && yum clean all

WORKDIR /app

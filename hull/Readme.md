Vlipco Hull
========

Fedora based starting point for Docker images

> Regardless of size, all ships must have a hull


The docker image defined here is the starting point for other Docker images we build at Vlipco. It's a Fedora 20 image provisioned with some goodies, namely:

* Ruby 2.1.1 built from source with ruby-install
* Vim for development, debugging
* Dev tools like gcc, make, devel pkgs, git, mercurial ...
* Misc utils like unzip, bzip2, wget, curl, zsh, nc
* A bash profile with a customized prompt

Hull is avaialable as a trusted build in the Docker Index, you can get it with:

```
docker pull vlipco/hull
```
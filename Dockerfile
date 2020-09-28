FROM jekyll/minimal:3.8.5
COPY . /srv/jekyll
CMD ["jekyll", "serve"]

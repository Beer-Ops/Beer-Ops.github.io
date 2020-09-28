#!/bin/bash
# Clean up files that should not go into any Docker image and would cause Jekyll to reinstall many gems

rm -rf Gemfile Gemfile.lock scripts/ package.json gulpfile.js README.md app.json azure-pipelines.yml Rakefile static.json

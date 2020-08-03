#!/bin/bash

NODE_ENV=test node_modules/.bin/enhanced-tape-runner "$@" | node_modules/.bin/tap-spec-dot
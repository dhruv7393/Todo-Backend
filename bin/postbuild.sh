#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute

cp -r ./dist ./.amplify-hosting/compute/default
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

cp -r public ./.amplify-hosting/static

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

cp -r ./src/commonComponents ./.amplify-hosting/compute/default
cp -r ./src/config ./.amplify-hosting/compute/default
cp -r ./src/controllers ./.amplify-hosting/compute/default
cp -r ./src/models ./.amplify-hosting/compute/default
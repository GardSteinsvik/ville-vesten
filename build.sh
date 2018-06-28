#!/bin/bash

# meningen med dette scriptet er å kunne endre script live, ved å opprette et scope
# tror det kan funke fint

A='(function () {'
B='})();'

mkdir -p "./release"

for dings in *.js; do
    cat <( echo "${A}" ) \
        "${dings}" \
        <( echo "${B}" ) > "./release/${dings}"
done

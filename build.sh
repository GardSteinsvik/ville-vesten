#!/bin/bash

# meningen med dette scriptet er å kunne endre script live, ved å opprette et scope
# tror det kan funke fint

# har en følelse av at ting lever videre i bakgrunnen da,
# så blir sikkert ultratregt om du scroller gjennom masse

# idé! ha et overlay over alle dingsene, som registrerer to fingre dratt fra toppen til bunnen av canvaset.
# skjermen blir svartere og svartere etterhvert som man drar nedover.
# oppover blir forrige?

# må kanskje endres hvis det slåss med touch inputs andre steder.
# kan binde p, n til forrige og neste

A='(function () {'
B='})();'

mkdir -p "./release"

for dings in *.js; do
    cat <( echo "${A}" ) \
        "${dings}" \
        <( echo "${B}" ) > "./release/${dings}"
done

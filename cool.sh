#!/bin/sh

convert "images/colax.png" -alpha extract -negate -transparent white "images/poltercolax.png"
# convert "images/poltercolax.png" -alpha set -background none -channel A -evaluate multiply "${1}" +channel "images/poltercolax.png"

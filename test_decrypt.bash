#!/bin/bash
echo $1

echo $1 | base64 -d | openssl pkeyutl -decrypt -inkey key.pem

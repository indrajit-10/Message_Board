#!/bin/bash
# probe.sh LABEL URL [ua:desk|mob|bot]  -> one sequential request, prints cache headers + timing
B=https://blog.123greetings.com
DUA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
MUA='Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
IUA='Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1'
ACC='text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
case "$3" in mob) UA=$MUA;; ios) UA=$IUA;; *) UA=$DUA;; esac
H=$(mktemp); O=$(mktemp)
W=$(curl -sS -o "$O" -D "$H" --compressed -A "$UA" -H "Accept: $ACC" -H 'Accept-Language: en-US,en;q=0.9' -w '%{http_code} conn=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}' "$2")
g(){ grep -i "^$1:" "$H" | tr -d '\r' | cut -d' ' -f2- | tr '\n' ' '; }
MD5=$(md5sum "$O" | cut -c1-8); SZ=$(stat -c %s "$O")
echo "$(date +%T) $1 ${2#$B} ua=$3 xac=[$(g x-ac)] st=[$(g server-timing)] nan=[$(g x-nananana)] age=[$(g age)] cc=[$(g cache-control)] vary=[$(g vary)] $W size=$SZ md5=$MD5"
rm -f "$H" "$O"

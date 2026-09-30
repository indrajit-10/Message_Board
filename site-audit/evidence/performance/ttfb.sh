#!/bin/bash
# TTFB cached vs uncached (cache-busting query string) using Chrome's real navigation Accept header.
# Sequential with 2.5s pauses. Prints: label url x-ac server-timing-dur http ttfb total bytes
B=https://blog.123greetings.com
MUA='Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
ACC='text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
probe() { # label url [accept]
  H=$(mktemp)
  A="${3:-$ACC}"
  W=$(curl -sS -o /dev/null -D "$H" --compressed -A "$MUA" -H "Accept: $A" -w '%{http_code} ttfb=%{time_starttransfer} total=%{time_total} bytes=%{size_download}' "$2")
  XAC=$(grep -i '^x-ac:' "$H" | tr -d '\r' | awk '{print $NF}')
  ST=$(grep -i '^server-timing:' "$H" | tr -d '\r' | grep -o 'dur=[0-9.]*')
  CC=$(grep -i '^cache-control:' "$H" | tr -d '\r' | cut -d' ' -f2-)
  echo "$1 ${2#$B} $XAC st_$ST $W cc=[$CC]"
  rm -f "$H"
  sleep 2.5
}
for P in / /birthday-messages-for-mom/ /mothers-day-messages/ /mothers-day-messages-for-wife-what-she-actually-wants/ /tag/alps/; do
  probe cached-1 "$B$P"
  probe cached-2 "$B$P"
  probe cached-3 "$B$P"
  for i in 1 2 3; do probe uncached-$i "$B$P?perfaudit=$RANDOM$RANDOM"; done
done
# Same URL, different Accept values -> separate cache objects?
P=/birthday-messages/
probe acc-chrome "$B$P"
probe acc-star "$B$P" '*/*'
probe acc-firefox "$B$P" 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
probe acc-safari "$B$P" 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
probe acc-chrome-again "$B$P"
echo DONE

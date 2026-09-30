#!/bin/bash
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
FL="--headless=new --no-sandbox --proxy-server=http://127.0.0.1:41729"
B=https://blog.123greetings.com
run() { # name path preset
  if [ "$3" = "desktop" ]; then P="--preset=desktop"; else P=""; fi
  echo "$(date +%T) start $1"
  npx -y lighthouse@12 "$B$2" $P --output=json --output-path=./$1.json --quiet --chrome-flags="$FL" > ./$1.log 2>&1
  echo "$(date +%T) done $1 rc=$?"
  sleep 8
}
run bdaymsgs-mobile /birthday-messages/ mobile
run mom-mobile /birthday-messages-for-mom/ mobile
run mothersday-mobile /mothers-day-messages/ mobile
run post-mobile /mothers-day-messages-for-wife-what-she-actually-wants/ mobile
run archive-mobile /archive/ mobile
run tag-mobile /tag/alps/ mobile
run home-desktop / desktop
run bdaymsgs-desktop /birthday-messages/ desktop
run mom-desktop /birthday-messages-for-mom/ desktop
run mothersday-desktop /mothers-day-messages/ desktop
run post-desktop /mothers-day-messages-for-wife-what-she-actually-wants/ desktop
run archive-desktop /archive/ desktop
run tag-desktop /tag/alps/ desktop
run home-mobile2 / mobile
run mom-mobile2 /birthday-messages-for-mom/ mobile
echo ALLDONE

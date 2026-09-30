#!/bin/bash
# What-if runs: same pages with reCAPTCHA blocked, and with all third parties blocked, to quantify their cost.
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
FL="--headless=new --no-sandbox --proxy-server=http://127.0.0.1:41729"
B=https://blog.123greetings.com
RC='--blocked-url-patterns=*recaptcha* --blocked-url-patterns=*contact-form-7*'
TP='--blocked-url-patterns=*recaptcha* --blocked-url-patterns=*googletagmanager* --blocked-url-patterns=*doubleclick* --blocked-url-patterns=*googlesyndication* --blocked-url-patterns=*fundingchoices* --blocked-url-patterns=*cdn77* --blocked-url-patterns=*cse.google* --blocked-url-patterns=*adtrafficquality* --blocked-url-patterns=*criteo* --blocked-url-patterns=*id5-sync* --blocked-url-patterns=*crwdcntrl* --blocked-url-patterns=*yahoo* --blocked-url-patterns=*im-apps* --blocked-url-patterns=*creativecdn* --blocked-url-patterns=*rtbhouse* --blocked-url-patterns=*jsdelivr*'
run() { # name path mode extra
  echo "$(date +%T) start $1"
  npx -y lighthouse@12 "$B$2" $3 --output=json --output-path=./$1.json --quiet --chrome-flags="$FL" $4 > ./$1.log 2>&1
  echo "$(date +%T) done $1 rc=$?"
  sleep 25
}
run home-desktop / "--preset=desktop" ""
run mom-desktop /birthday-messages-for-mom/ "--preset=desktop" ""
run post-desktop /mothers-day-messages-for-wife-what-she-actually-wants/ "--preset=desktop" ""
run home-mobile-norecaptcha / "" "$RC"
run mothersday-mobile-norecaptcha /mothers-day-messages/ "" "$RC"
run mothersday-mobile-no3p /mothers-day-messages/ "" "$TP"

echo ALLDONE

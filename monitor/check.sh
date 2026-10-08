#!/bin/sh
STATE=up
FAILS=0

send() {
  curl -s -X POST -H 'Content-Type: application/json' \
    -d "{\"text\":\"$1\"}" "$WEBHOOK_URL" >/dev/null
}

while true; do
  if curl -fsS --max-time 5 "$TARGET_URL" >/dev/null 2>&1; then
    if [ "$STATE" = "down" ]; then
      send ":white_check_mark: msemen-ui est de nouveau UP ($(date '+%d/%m %H:%M:%S'))"
      STATE=up
    fi
    FAILS=0
  else
    FAILS=$((FAILS+1))
    # 3 échecs d'affilée avant d'alerter (évite les fausses alertes)
    if [ "$STATE" = "up" ] && [ "$FAILS" -ge 3 ]; then
      send ":rotating_light: msemen-ui est DOWN depuis $((FAILS*INTERVAL))s ($(date '+%d/%m %H:%M:%S'))"
      STATE=down
    fi
  fi
  sleep "$INTERVAL"
done
#!/bin/bash
set -euo pipefail

CHARTS_DIR="charts"

echo "Extracting all .tgz Helm charts into folders..."

for tgz in "$CHARTS_DIR"/*.tgz; do
  [ -e "$tgz" ] || continue

  # Get the base name (e.g., redis-21.2.6.tgz → redis)
  chart_name=$(basename "$tgz" | sed -E 's/-[0-9].*\.tgz$//')

  # Create target dir and extract
  target_dir="$CHARTS_DIR/$chart_name"
  echo "-> Extracting $tgz to $target_dir"
  mkdir -p "$target_dir"
  tar -xzf "$tgz" -C "$target_dir" --strip-components=1
done

echo "Done: all charts extracted."

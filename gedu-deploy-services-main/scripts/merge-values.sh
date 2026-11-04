#!/bin/bash
set -e

ENV=${1:-prod}
OUTFILE="values-${ENV}.yaml"
# COMMON="values/common"
ENVDIR="values/${ENV}"

echo "# Auto-generated ${OUTFILE}" > $OUTFILE
echo "# Merged at $(date)" >> $OUTFILE
echo "" >> $OUTFILE
# Check if the environment directory exists
for f in values.yaml $ENVDIR/*.yaml; do
  echo -e "\n# -------- $f --------" >> $OUTFILE
  cat "$f" >> $OUTFILE
done

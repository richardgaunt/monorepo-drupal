#!/usr/bin/env bash
##
# Provision content.
#
# shellcheck disable=SC2086

set -eu
[ "${DREVOPS_DEBUG-}" = "1" ] && set -x

# ------------------------------------------------------------------------------

drush() { ./vendor/bin/drush -y "$@"; }

echo "[INFO] Enabling experience builder module."

  drush pm-enable experience_builder

echo "[ OK ] Finished enabling experience builder module."

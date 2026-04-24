#!/bin/bash
# ──────────────────────────────────────────────
# PetPals Test Runner Script
# ──────────────────────────────────────────────
# Usage:
#   ./scripts/run-tests.sh                    # Run all tests (staging)
#   ./scripts/run-tests.sh --env local        # Run all tests (local)
#   ./scripts/run-tests.sh --tag @smoke       # Run smoke tests only
#   ./scripts/run-tests.sh --project chromium # Run on chromium only
# ──────────────────────────────────────────────

set -e

ENV="staging"
TAG=""
PROJECT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENV="$2"
            shift 2
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --project)
            PROJECT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

CMD="cross-env TEST_ENV=$ENV npx playwright test"

if [ -n "$TAG" ]; then
    CMD="$CMD --grep $TAG"
fi

if [ -n "$PROJECT" ]; then
    CMD="$CMD --project=$PROJECT"
fi

echo "Running: $CMD"
eval $CMD

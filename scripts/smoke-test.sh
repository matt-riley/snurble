#!/bin/bash
set -e

REPO_ROOT=$(pwd)
ARTIFACTS_DIR="$REPO_ROOT/artifacts/packages"
SMOKE_DIR="$REPO_ROOT/artifacts/smoke-test"

echo "Cleaning up artifacts..."
rm -rf "$ARTIFACTS_DIR" "$SMOKE_DIR"
mkdir -p "$ARTIFACTS_DIR"

echo "Packing packages..."
pnpm --dir packages/tokens pack --pack-destination "$ARTIFACTS_DIR"
pnpm --dir packages/ui-astro pack --pack-destination "$ARTIFACTS_DIR"

echo "Creating smoke test project..."
# Using --yes and minimal flags for non-interactive use
pnpm create astro "$SMOKE_DIR" --template minimal --no-install --no-git --typescript strict --yes

echo "Installing artifacts in smoke test..."
TOKEN_TGZ=$(ls "$ARTIFACTS_DIR"/matt-riley-design-tokens-*.tgz)
UI_TGZ=$(ls "$ARTIFACTS_DIR"/matt-riley-ui-astro-*.tgz)

pnpm --dir "$SMOKE_DIR" add "$TOKEN_TGZ" "$UI_TGZ" astro

echo "Verifying build in smoke test..."
# Create a simple page that uses a component to verify it works
cat <<EOF > "$SMOKE_DIR/src/pages/index.astro"
---
import { Button } from '@matt-riley/ui-astro';
import '@matt-riley/design-tokens';
---
<Button>Smoke Test</Button>
EOF

pnpm --dir "$SMOKE_DIR" run build

echo "Smoke test passed!"

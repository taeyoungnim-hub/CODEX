#!/usr/bin/env bash
set -euo pipefail

# 사용자가 가장 자주 원하는 위치(바탕화면) 우선
TARGET_ROOT="${1:-$HOME/Desktop}"
FOLDER_NAME="${2:-Digital_Information_Architecture}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/scripts/setup_digital_architecture.sh" "$TARGET_ROOT" "$FOLDER_NAME"

echo
echo "완료: $TARGET_ROOT/$FOLDER_NAME"
echo "원하면 인자로 경로/폴더명을 바꿀 수 있습니다."

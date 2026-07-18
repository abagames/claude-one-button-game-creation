#!/usr/bin/env bash

set -euo pipefail

readonly PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly REPOSITORY="${AGENT_SKILLS_REPOSITORY:-https://github.com/abagames/agentic-gamedev-skills.git}"
readonly REF="${AGENT_SKILLS_REF:-313b2b616857ce1130d6e5ba05bb69b81735943c}"
readonly AGENTS_DIR="$PROJECT_ROOT/.agents"
readonly SKILLS_DIR="$AGENTS_DIR/skills"
readonly -a SKILLS=(
  designing-mini-games
  developing-with-crisp-game-lib
  smoke-testing-web-games
)

check_skills() {
  local skill
  local missing=0

  for skill in "${SKILLS[@]}"; do
    if [[ ! -f "$SKILLS_DIR/$skill/SKILL.md" ]]; then
      echo "Missing agent skill: $skill" >&2
      missing=1
    fi
  done

  if [[ ! -f "$SKILLS_DIR/smoke-testing-web-games/scripts/smoke-test.mjs" ]]; then
    echo "Missing smoke-test runner." >&2
    missing=1
  fi

  if ((missing)); then
    echo "Run 'npm run skills:install' from the project root." >&2
    return 1
  fi
}

if [[ "${1:-}" == "--check" ]]; then
  check_skills
  echo "Required agent skills are installed."
  exit 0
fi

if [[ $# -ne 0 ]]; then
  echo "Usage: $0 [--check]" >&2
  exit 2
fi

readonly TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT

git clone --quiet --filter=blob:none --no-checkout "$REPOSITORY" "$TEMP_DIR/source"
git -C "$TEMP_DIR/source" sparse-checkout init --cone

skill_paths=()
for skill in "${SKILLS[@]}"; do
  skill_paths+=(".agents/skills/$skill")
done

git -C "$TEMP_DIR/source" sparse-checkout set "${skill_paths[@]}"
git -C "$TEMP_DIR/source" checkout --quiet "$REF"

mkdir -p "$TEMP_DIR/install/skills"
for skill in "${SKILLS[@]}"; do
  source_dir="$TEMP_DIR/source/.agents/skills/$skill"
  if [[ ! -f "$source_dir/SKILL.md" ]]; then
    echo "Upstream skill is missing SKILL.md: $skill" >&2
    exit 1
  fi
  cp -R "$source_dir" "$TEMP_DIR/install/skills/$skill"
done

mkdir -p "$SKILLS_DIR"
for skill in "${SKILLS[@]}"; do
  rm -rf "$SKILLS_DIR/$skill"
  mv "$TEMP_DIR/install/skills/$skill" "$SKILLS_DIR/$skill"
done
check_skills

echo "Installed agent skills from $REPOSITORY at $REF:"
printf '  - %s\n' "${SKILLS[@]}"

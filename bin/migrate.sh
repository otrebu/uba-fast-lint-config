#!/usr/bin/env bash
set -euo pipefail

# migrate-to-fast-lint
# Migrates a project from uba-eslint-config to uba-fast-lint-config.
# Pure bash, no external deps (no jq).

VERSION="1.0.0"
DRY_RUN=false
PM=""

# --- Colors (respect NO_COLOR) ---

if [[ -z "${NO_COLOR:-}" ]] && [[ -t 1 ]]; then
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  RED='\033[0;31m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  GREEN='' YELLOW='' RED='' CYAN='' BOLD='' RESET=''
fi

# --- Helpers ---

info()  { printf "${GREEN}[INFO]${RESET}  %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${RESET}  %s\n" "$1"; }
error() { printf "${RED}[ERROR]${RESET} %s\n" "$1" >&2; }
step()  { printf "\n${BOLD}${CYAN}==> %s${RESET}\n" "$1"; }

# Portable sed -i (macOS vs Linux)
sedi() {
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

dry_run_or_exec() {
  if $DRY_RUN; then
    info "[dry-run] $1"
  else
    eval "$2"
  fi
}

# --- Usage ---

usage() {
  cat <<EOF
migrate-to-fast-lint v${VERSION}

Migrate a project from uba-eslint-config to uba-fast-lint-config.

USAGE:
  migrate-to-fast-lint [OPTIONS]

OPTIONS:
  --dry-run       Show what would happen without making changes
  --pm <pnpm|bun> Override auto-detected package manager
  --help          Show this help message

EXAMPLES:
  npx migrate-to-fast-lint
  npx migrate-to-fast-lint --dry-run
  npx migrate-to-fast-lint --pm bun
EOF
  exit 0
}

# --- Arg parsing ---

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dry-run) DRY_RUN=true; shift ;;
      --pm)
        if [[ -z "${2:-}" ]]; then
          error "--pm requires an argument (pnpm or bun)"
          exit 1
        fi
        PM="$2"; shift 2 ;;
      --help|-h) usage ;;
      *)
        error "Unknown option: $1"
        usage ;;
    esac
  done
}

# --- Detection ---

detect_package_manager() {
  if [[ -n "$PM" ]]; then
    case "$PM" in
      pnpm|bun) info "Using package manager: $PM (override)" ;;
      *) error "Unsupported package manager: $PM (use pnpm or bun)"; exit 1 ;;
    esac
    return
  fi

  if [[ -f "bun.lockb" ]] || [[ -f "bun.lock" ]]; then
    PM="bun"
  elif [[ -f "pnpm-lock.yaml" ]]; then
    PM="pnpm"
  else
    error "Could not detect package manager. No pnpm-lock.yaml or bun.lockb found."
    error "Use --pm pnpm or --pm bun to specify manually."
    exit 1
  fi
  info "Detected package manager: $PM"
}

check_already_migrated() {
  # Idempotency: if already migrated, exit cleanly
  if grep -q '"uba-fast-lint-config"' package.json 2>/dev/null \
    && [[ -f "biome.json" ]] \
    && [[ -f ".oxlintrc.json" ]]; then
    info "Already migrated (uba-fast-lint-config in package.json, biome.json and .oxlintrc.json exist)."
    info "Nothing to do."
    exit 0
  fi

  # Check that we're migrating from the right thing
  if ! grep -q '"uba-eslint-config"' package.json 2>/dev/null; then
    error "package.json does not reference uba-eslint-config. Nothing to migrate."
    exit 1
  fi
}

# --- Migration steps ---

step_1_swap_packages() {
  step "Step 1: Swap packages"

  local remove_cmd="$PM remove uba-eslint-config prettier prettier-plugin-packagejson prettier-plugin-tailwindcss 2>/dev/null || true"
  local add_cmd="$PM add -D uba-fast-lint-config"

  dry_run_or_exec "Remove old packages" "$remove_cmd"
  dry_run_or_exec "Install uba-fast-lint-config" "$add_cmd"
}

step_2_replace_prettier() {
  step "Step 2: Replace Prettier with Biome"

  local prettier_files=".prettierrc .prettierrc.js .prettierrc.json .prettierrc.yaml .prettierrc.yml .prettierrc.cjs .prettierrc.mjs .prettierrc.toml prettier.config.js prettier.config.mjs prettier.config.cjs"
  for f in $prettier_files; do
    if [[ -f "$f" ]]; then
      dry_run_or_exec "Delete $f" "rm '$f'"
    fi
  done

  # Also remove .prettierignore
  if [[ -f ".prettierignore" ]]; then
    dry_run_or_exec "Delete .prettierignore" "rm .prettierignore"
  fi

  local src="node_modules/uba-fast-lint-config/biome.json"
  if [[ -f "$src" ]]; then
    dry_run_or_exec "Copy biome.json" "cp '$src' biome.json"
  else
    warn "biome.json not found at $src — install uba-fast-lint-config first, then copy manually."
  fi
}

step_3_copy_oxlint() {
  step "Step 3: Copy oxlint config"

  local src="node_modules/uba-fast-lint-config/.oxlintrc.json"
  if [[ -f "$src" ]]; then
    dry_run_or_exec "Copy .oxlintrc.json" "cp '$src' .oxlintrc.json"
  else
    warn ".oxlintrc.json not found at $src — install uba-fast-lint-config first, then copy manually."
  fi
}

step_4_update_eslint() {
  step "Step 4: Update eslint.config.js"

  local eslint_config=""
  for f in eslint.config.js eslint.config.mjs eslint.config.cjs; do
    if [[ -f "$f" ]]; then
      eslint_config="$f"
      break
    fi
  done

  if [[ -z "$eslint_config" ]]; then
    warn "No eslint config file found. Skipping."
    return
  fi

  info "Updating $eslint_config"

  if $DRY_RUN; then
    info "[dry-run] Would apply sed replacements to $eslint_config"
    return
  fi

  # Order matters: longer patterns first to avoid partial matches

  # Package name
  sedi 's|"uba-eslint-config"|"uba-fast-lint-config"|g' "$eslint_config"

  # Function renames (longer first!)
  sedi 's|generateEslintConfigByFeatures|generateLintConfigByFeatures|g' "$eslint_config"
  sedi 's|generateEslintConfig|generateLintConfig|g' "$eslint_config"

  # Preset rename
  sedi 's|ubaEslintConfig|ubaFastLintConfig|g' "$eslint_config"

  # Delete Prettier-related imports
  sedi '/ubaPrettierConfig/d' "$eslint_config"
  sedi '/generatePrettierConfig/d' "$eslint_config"

  # Delete removed options
  sedi '/importCycleCheckMode/d' "$eslint_config"

  # Clean up empty imports: import {  } from "..."
  sedi '/^import {[[:space:]]*} from/d' "$eslint_config"
}

step_5_update_scripts() {
  step "Step 5: Update package.json scripts"

  if [[ ! -f "package.json" ]]; then
    warn "No package.json found. Skipping."
    return
  fi

  if $DRY_RUN; then
    info "[dry-run] Would apply sed replacements to package.json scripts"
    return
  fi

  # Compound patterns first (longer matches before shorter)

  # "prettier --write . && eslint --fix ." → "biome format --write . && oxlint --fix . && eslint --fix ."
  sedi 's|"prettier --write \. && eslint --fix \."|"biome format --write . \&\& oxlint --fix . \&\& eslint --fix ."|g' package.json

  # "prettier --write ." → "biome format --write ."
  sedi 's|"prettier --write \."|"biome format --write ."|g' package.json
  sedi 's|prettier --write \.|biome format --write .|g' package.json

  # "prettier --check ." → "biome format ."
  sedi 's|"prettier --check \."|"biome format ."|g' package.json
  sedi 's|prettier --check \.|biome format .|g' package.json

  # "eslint --fix ." → "oxlint --fix . && eslint --fix ."
  # Use negative lookbehind equivalent: match only when NOT preceded by "oxlint --fix . && "
  # Since sed lacks lookaround, match the exact standalone value instead
  sedi 's|": "eslint --fix \."|": "oxlint --fix . \&\& eslint --fix ."|g' package.json
  # Fallback: catch unquoted or differently-spaced variants
  sedi 's|":"eslint --fix \."|":"oxlint --fix . \&\& eslint --fix ."|g' package.json

  # "eslint ." → "oxlint . && eslint ."
  sedi 's|": "eslint \."|": "oxlint . \&\& eslint ."|g' package.json
  sedi 's|":"eslint \."|":"oxlint . \&\& eslint ."|g' package.json
}

step_6_update_hooks() {
  step "Step 6: Update pre-commit hook"

  local hook=".husky/pre-commit"
  if [[ ! -f "$hook" ]]; then
    info "No .husky/pre-commit found. Skipping."
    return
  fi

  info "Updating $hook"

  if $DRY_RUN; then
    info "[dry-run] Would apply sed replacements to $hook"
    return
  fi

  # Replace prettier with biome
  sedi 's|prettier --write \.|biome format --write .|g' "$hook"
  sedi 's|prettier --check \.|biome format .|g' "$hook"

  # Insert oxlint before eslint lines (only if not already present)
  # This adds "oxlint ." on the line before any "eslint" line that doesn't already have oxlint
  if ! grep -q 'oxlint' "$hook"; then
    sedi '/^[[:space:]]*eslint /i\
oxlint .' "$hook"
  fi
}

print_summary() {
  step "Migration complete!"

  if $DRY_RUN; then
    printf "\n${YELLOW}This was a dry run. No changes were made.${RESET}\n"
    printf "Run without --dry-run to apply changes.\n\n"
    return
  fi

  printf "\n${GREEN}Next steps:${RESET}\n"
  printf "  1. Review the changes (git diff)\n"
  printf "  2. If using generateLintConfig/generateLintConfigByFeatures,\n"
  printf "     update the return value: const { eslintConfig } = generateLintConfig(...)\n"
  printf "  3. Remove flags that no longer exist:\n"
  printf "     shouldEnableA11y, shouldEnableVitest, shouldEnableReact,\n"
  printf "     shouldEnableNodeGlobals, shouldEnableBrowserGlobals\n"
  printf "  4. Consider adding shouldEnableTailwind if using Tailwind CSS\n"
  printf "  5. Install Biome VS Code extension, disable Prettier extension\n"
  printf "  6. Run: $PM run lint\n"
  printf "\n  Full guide: https://github.com/otrebu/uba-fast-lint-config/blob/main/docs/MIGRATION_GUIDE.md\n\n"
}

# --- Main ---

main() {
  parse_args "$@"

  printf "${BOLD}migrate-to-fast-lint v${VERSION}${RESET}\n"
  if $DRY_RUN; then
    printf "${YELLOW}(dry-run mode — no changes will be made)${RESET}\n"
  fi

  detect_package_manager
  check_already_migrated
  step_1_swap_packages
  step_2_replace_prettier
  step_3_copy_oxlint
  step_4_update_eslint
  step_5_update_scripts
  step_6_update_hooks
  print_summary
}

main "$@"

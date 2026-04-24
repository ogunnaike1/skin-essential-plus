# =============================================================
# Skin Essential Plus - Palette Migration + Contrast Fix
# PowerShell edition (Windows-native, no bash required)
# =============================================================
#
# Run from your project root (where package.json lives):
#   .\fix-palette.ps1
#
# If PowerShell blocks the script, first allow it for this
# session only (safe, resets when you close the terminal):
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\fix-palette.ps1
# =============================================================

Write-Host ""
Write-Host "Running palette migration + contrast fix..."
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found." -ForegroundColor Red
    Write-Host "Run this script from your PROJECT ROOT."
    exit 1
}

if (-not ((Test-Path "components") -or (Test-Path "app"))) {
    Write-Host "ERROR: components or app folders not found." -ForegroundColor Red
    exit 1
}

# All replacements: OLD pattern -> NEW pattern
$replacements = @(
    @{ Old = '#C0A9BD'; New = '#8A6F88' }
    @{ Old = '#c0a9bd'; New = '#8A6F88' }
    @{ Old = '#94A7AE'; New = '#4F7288' }
    @{ Old = '#94a7ae'; New = '#4F7288' }
    @{ Old = '#F4F2F3'; New = '#FCFBFC' }
    @{ Old = '#f4f2f3'; New = '#FCFBFC' }
    @{ Old = 'rgba(192,169,189';   New = 'rgba(138,111,136' }
    @{ Old = 'rgba(192, 169, 189'; New = 'rgba(138, 111, 136' }
    @{ Old = 'rgba(148,167,174';   New = 'rgba(79,114,136' }
    @{ Old = 'rgba(148, 167, 174'; New = 'rgba(79, 114, 136' }
    @{ Old = 'rgba(244,242,243';   New = 'rgba(252,251,252' }
    @{ Old = 'rgba(244, 242, 243'; New = 'rgba(252, 251, 252' }
    @{ Old = 'text-deep/40';  New = 'text-deep/70' }
    @{ Old = 'text-deep/45';  New = 'text-deep/70' }
    @{ Old = 'text-deep/50';  New = 'text-deep' }
    @{ Old = 'text-deep/55';  New = 'text-deep' }
    @{ Old = 'text-deep/60';  New = 'text-deep' }
    @{ Old = 'text-deep/65';  New = 'text-deep' }
    @{ Old = 'text-deep/70';  New = 'text-deep' }
    @{ Old = 'text-deep/75';  New = 'text-deep' }
    @{ Old = 'text-ivory/40'; New = 'text-ivory/70' }
    @{ Old = 'text-ivory/50'; New = 'text-ivory/85' }
    @{ Old = 'text-ivory/55'; New = 'text-ivory/85' }
    @{ Old = 'text-ivory/60'; New = 'text-ivory/90' }
    @{ Old = 'text-ivory/65'; New = 'text-ivory/90' }
    @{ Old = 'text-ivory/70'; New = 'text-ivory' }
    @{ Old = 'text-ivory/75'; New = 'text-ivory' }
    @{ Old = 'text-ivory/80'; New = 'text-ivory' }
)

$files = @()
if (Test-Path "components") {
    $files += Get-ChildItem -Path "components" -Recurse -Include "*.tsx", "*.ts", "*.css" -File
}
if (Test-Path "app") {
    $files += Get-ChildItem -Path "app" -Recurse -Include "*.tsx", "*.ts", "*.css" -File
}

Write-Host "Found $($files.Count) files to process."
Write-Host ""

$modifiedCount = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if ($null -eq $content) { continue }

    $original = $content

    foreach ($r in $replacements) {
        $content = $content.Replace($r.Old, $r.New)
    }

    if ($content -ne $original) {
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        $modifiedCount++
    }
}

Write-Host "Modified $modifiedCount files." -ForegroundColor Green
Write-Host ""

# Verification
Write-Host "Scanning for remaining old-palette references..."

$oldHex = Select-String -Path "components\*","app\*" -Pattern "#C0A9BD","#c0a9bd","#94A7AE","#94a7ae","#F4F2F3","#f4f2f3" -Recurse -Include "*.tsx","*.ts","*.css" -ErrorAction SilentlyContinue
$oldRgba = Select-String -Path "components\*","app\*" -Pattern "rgba\(192,\s*169,\s*189","rgba\(148,\s*167,\s*174","rgba\(244,\s*242,\s*243" -Recurse -Include "*.tsx","*.ts","*.css" -ErrorAction SilentlyContinue

if (-not $oldHex -and -not $oldRgba) {
    Write-Host "  [OK] All palette references migrated." -ForegroundColor Green
} else {
    Write-Host "  Remaining references:" -ForegroundColor Yellow
    if ($oldHex)  { $oldHex  | ForEach-Object { Write-Host "    $($_.Path):$($_.LineNumber)" } }
    if ($oldRgba) { $oldRgba | ForEach-Object { Write-Host "    $($_.Path):$($_.LineNumber)" } }
}

Write-Host ""
Write-Host "Scanning for remaining low-contrast text classes..."

$contrast = Select-String -Path "components\*","app\*" -Pattern "text-deep/[4-6][05]","text-ivory/[4-6][05]" -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue

if (-not $contrast) {
    Write-Host "  [OK] All text contrast upgraded." -ForegroundColor Green
} else {
    Write-Host "  Remaining dim classes (usually intentional: dividers, unfilled stars, ghost numerals):" -ForegroundColor Yellow
    $contrast | ForEach-Object { Write-Host "    $($_.Path):$($_.LineNumber)" }
}

Write-Host ""
Write-Host "Done." -ForegroundColor Cyan
Write-Host "Reminder: also replace tailwind.config.ts with the new version."
Write-Host "Then run:  npm run dev"
Write-Host ""
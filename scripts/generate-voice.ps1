# Generate bundled Mandarin MP3 prompts with Microsoft Edge text-to-speech.
# Install once with: python -m pip install edge-tts
# Run from the repository root: pwsh -File scripts/generate-voice.ps1
param(
  [string]$VoiceName = 'zh-CN-XiaoxiaoNeural'
)

$ErrorActionPreference = 'Stop'
$python = Get-Command python, py -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $python) {
  throw 'Python 3 is required. Install it, then run: python -m pip install edge-tts'
}

$generator = Join-Path $PSScriptRoot 'generate-voice.py'
& $python.Source $generator --voice $VoiceName
if ($LASTEXITCODE -ne 0) {
  throw "Voice generation failed with exit code $LASTEXITCODE."
}

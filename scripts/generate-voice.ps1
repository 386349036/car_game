# Generate the bundled Mandarin prompts with a locally installed Windows voice.
# Run from the repository root: powershell -File scripts/generate-voice.ps1
param(
  [string]$VoiceName = 'Microsoft Yaoyao'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$outputDirectory = Join-Path (Split-Path -Parent $PSScriptRoot) 'public/audio/voice'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

$prompts = [ordered]@{
  'journey-start.wav' = '小车出发啦！'
  'stone-hint.wav' = '石头挡路啦，请挖掘机来帮忙。'
  'bridge-hint.wav' = '把木板放到小桥上吧。'
  'traffic-light-hint.wav' = '点一点红绿灯，小车就能走啦。'
  'scene-complete.wav' = '真棒，小车继续前进！'
  'journey-complete.wav' = '小车到家啦，真棒！'
}

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $voice = $synth.GetInstalledVoices() | Where-Object {
    $_.Enabled -and $_.VoiceInfo.Name -eq $VoiceName -and $_.VoiceInfo.Culture.Name -eq 'zh-CN'
  } | Select-Object -First 1
  if (-not $voice) {
    throw "Chinese voice '$VoiceName' is unavailable. Install a zh-CN Windows voice or pass -VoiceName."
  }

  $synth.SelectVoice($voice.VoiceInfo.Name)
  $synth.Rate = -2
  $format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(
    16000,
    [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,
    [System.Speech.AudioFormat.AudioChannel]::Mono
  )

  foreach ($fileName in $prompts.Keys) {
    $filePath = Join-Path $outputDirectory $fileName
    $synth.SetOutputToWaveFile($filePath, $format)
    $synth.Speak($prompts[$fileName])
    $synth.SetOutputToNull()
    Write-Output "$fileName - $($prompts[$fileName])"
  }
}
finally {
  $synth.Dispose()
}

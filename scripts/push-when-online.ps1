# 网络恢复后运行此脚本，将本地 CMS 修复同步到 GitHub
Set-Location $PSScriptRoot\..
$max = 20
for ($i = 1; $i -le $max; $i++) {
  Write-Host "Push attempt $i/$max..."
  git push origin main 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Push succeeded. Railway/Vercel will auto-deploy from GitHub."
    exit 0
  }
  Start-Sleep -Seconds 15
}
Write-Host "Push failed after $max attempts. Try VPN and run again."
exit 1

# Railway 一键部署脚本（需先完成 railway login）
# 用法：在项目根目录 PowerShell 执行  .\scripts\deploy-railway.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "检查 Railway 登录..." -ForegroundColor Cyan
railway whoami
if ($LASTEXITCODE -ne 0) {
  Write-Host "请先运行: railway login --browserless" -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path ".railway")) {
  Write-Host "创建 Railway 项目 acat-cms-api ..." -ForegroundColor Cyan
  railway init --name acat-cms-api
}

$pass = Read-Host "设置 CMS 后台密码 (ADMIN_PASSWORD)"
$jwt = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })

Write-Host "配置环境变量..." -ForegroundColor Cyan
railway variables set NODE_ENV=production ADMIN_PASSWORD=$pass JWT_SECRET=$jwt

Write-Host "开始部署（约 3-5 分钟）..." -ForegroundColor Cyan
railway up --detach

Write-Host "生成公网域名..." -ForegroundColor Cyan
railway domain

Write-Host ""
Write-Host "请复制上方域名，然后执行：" -ForegroundColor Green
Write-Host '  railway variables set PUBLIC_BASE_URL=https://你的域名.up.railway.app' -ForegroundColor White
Write-Host ""
Write-Host "验证：" -ForegroundColor Green
Write-Host "  https://你的域名/api/health" -ForegroundColor White
Write-Host "  https://你的域名/admin" -ForegroundColor White
Write-Host ""
Write-Host "最后在 Vercel 添加: VITE_API_URL=https://你的域名" -ForegroundColor Yellow

# Car Pathshala Portfolio - Simple HTTP Server
# This starts a basic HTTP server for viewing the portfolio locally

$port = 8080
$folder = $PSScriptRoot
$base = Get-Location

Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Car Pathshala Portfolio Server" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access the portfolio at:" -ForegroundColor Cyan
Write-Host "  http://localhost:$port/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server folder: $folder" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Load the .NET assembly
Add-Type -AssemblyName System.Web

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Listening on http://localhost:$port/" -ForegroundColor Green

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Get requested path
        $url = $request.Url.AbsolutePath
        $url = $url -replace '^/', ''
        if ($url -eq '' -or $url -eq '/') {
            $url = 'index.html'
        }

        $filePath = Join-Path $base $url

        # Security: ensure path is within our folder
        $realPath = (Get-Item $filePath).FullName
        if (-not $realPath.StartsWith($base.FullName)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue

            # Determine content type
            $extension = [System.Web.MimeMapping]::GetMimeMapping($filePath)
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentType = $extension
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $errorHtml = '<html><body><h1>404 - Page Not Found</h1><p>The requested page could not be found.</p><p><a href="/">Go Home</a></p></body></html>'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorHtml)
            $response.ContentType = 'text/html'
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
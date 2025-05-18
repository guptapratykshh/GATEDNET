# Test Admin Authentication Endpoints

# Set up headers
$headers = @{
    "Content-Type" = "application/json"
}

$email = "admin2@test.com"

# Test Sign In
Write-Host "`nTesting Admin Sign In..." -ForegroundColor Green
$signInBody = @{
    email = $email
    password = "test123"
    name = "Test Admin"
    societyId = "507f1f77bcf86cd799439011"
    role = "society_admin"
} | ConvertTo-Json

try {
    Write-Host "Sending request to: http://localhost:5000/api/admin/signin" -ForegroundColor Yellow
    Write-Host "Request body: $signInBody" -ForegroundColor Yellow
    $signInResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/signin" -Method Post -Headers $headers -Body $signInBody
    Write-Host "Sign In Response:" -ForegroundColor Cyan
    $signInResponse | ConvertTo-Json -Depth 10
    
    # Store the token for subsequent requests
    $token = $signInResponse.token
    $headers["Authorization"] = "Bearer $token"
} catch {
    Write-Host "Sign In Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# Test Login
Write-Host "`nTesting Admin Login..." -ForegroundColor Green
$loginBody = @{
    email = $email
    password = "test123"
} | ConvertTo-Json

try {
    Write-Host "Sending request to: http://localhost:5000/api/admin/login" -ForegroundColor Yellow
    Write-Host "Request body: $loginBody" -ForegroundColor Yellow
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method Post -Headers $headers -Body $loginBody
    Write-Host "Login Response:" -ForegroundColor Cyan
    $loginResponse | ConvertTo-Json -Depth 10
    
    # Update token
    $token = $loginResponse.token
    $headers["Authorization"] = "Bearer $token"
} catch {
    Write-Host "Login Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# Test Get Profile
Write-Host "`nTesting Get Admin Profile..." -ForegroundColor Green
try {
    Write-Host "Sending request to: http://localhost:5000/api/admin/profile" -ForegroundColor Yellow
    Write-Host "Headers: $($headers | ConvertTo-Json)" -ForegroundColor Yellow
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/profile" -Method Get -Headers $headers
    Write-Host "Profile Response:" -ForegroundColor Cyan
    $profileResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Profile Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
} 
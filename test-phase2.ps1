# Phase 2 Integration Testing Script
# Tests all implemented features systematically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase 2 Feature Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apiBase = "http://localhost:3005"
$webBase = "http://localhost:3000"

$testResults = @{
    passed = @()
    failed = @()
    warnings = @()
}

function Test-Feature {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    Write-Host "Testing: $Name" -ForegroundColor Yellow -NoNewline
    try {
        $result = & $Test
        if ($result) {
            Write-Host " [PASS]" -ForegroundColor Green
            $testResults.passed += $Name
        } else {
            Write-Host " [FAIL]" -ForegroundColor Red
            $testResults.failed += $Name
        }
    } catch {
        Write-Host " [ERROR]" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        $testResults.failed += $Name
    }
}

Write-Host "1. API ENDPOINT TESTS" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

Test-Feature "API Health endpoint" {
    try {
        $response = Invoke-WebRequest -Uri "$apiBase/health" -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

Test-Feature "API Projects list endpoint" {
    try {
        $response = Invoke-WebRequest -Uri "$apiBase/api/projects" -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

Write-Host ""

# Create a test project to verify other endpoints
Write-Host "Creating test project for endpoint verification..." -ForegroundColor Yellow
try {
    $createResponse = Invoke-WebRequest -Uri "$apiBase/api/projects" -Method POST `
        -ContentType "application/json" `
        -Body '{"name":"Test Project"}' `
        -UseBasicParsing -TimeoutSec 5
    
    if ($createResponse.StatusCode -eq 200 -or $createResponse.StatusCode -eq 201) {
        $project = $createResponse.Content | ConvertFrom-Json
        $testProjectId = $project.id
        Write-Host "Test project created: $testProjectId" -ForegroundColor Green
        
        Test-Feature "API Get project endpoint" {
            try {
                $response = Invoke-WebRequest -Uri "$apiBase/api/projects/$testProjectId" -UseBasicParsing -TimeoutSec 5
                return $response.StatusCode -eq 200
            } catch {
                return $false
            }
        }
        
        # Create a spec for testing artifacts
        Write-Host "Creating test spec..." -ForegroundColor Yellow
        $specBody = @{
            title = "Test Mystery"
            genre = "detective"
            setting_era = "modern"
            setting_locale = "urban"
            tone = "mysterious"
        } | ConvertTo-Json
        
        try {
            $specResponse = Invoke-WebRequest -Uri "$apiBase/api/projects/$testProjectId/spec" -Method POST `
                -ContentType "application/json" `
                -Body $specBody `
                -UseBasicParsing -TimeoutSec 5
            
            if ($specResponse.StatusCode -eq 200 -or $specResponse.StatusCode -eq 201) {
                Write-Host "Test spec created" -ForegroundColor Green
                
                Test-Feature "API Get spec endpoint" {
                    try {
                        $response = Invoke-WebRequest -Uri "$apiBase/api/projects/$testProjectId/spec" -UseBasicParsing -TimeoutSec 5
                        return $response.StatusCode -eq 200
                    } catch {
                        return $false
                    }
                }
                
                Test-Feature "API Get artifacts endpoint" {
                    try {
                        $response = Invoke-WebRequest -Uri "$apiBase/api/projects/$testProjectId/artifacts" -UseBasicParsing -TimeoutSec 5
                        return $response.StatusCode -eq 200
                    } catch {
                        return $false
                    }
                }
                
                Test-Feature "API Get novelty audit endpoint" {
                    try {
                        $response = Invoke-WebRequest -Uri "$apiBase/api/projects/$testProjectId/novelty-audit/latest" -UseBasicParsing -TimeoutSec 5
                        # 200 if exists, 404 if not created yet - both are valid
                        return $response.StatusCode -eq 200 -or $response.StatusCode -eq 404
                    } catch {
                        # 404 is expected if no novelty audit yet
                        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
                            return $true
                        }
                        return $false
                    }
                }
                
                Test-Feature "API Get run events endpoint" {
                    try {
                        $response = Invoke-WebRequest -Uri "$apiBase/api/projects/$testProjectId/runs" -UseBasicParsing -TimeoutSec 5
                        return $response.StatusCode -eq 200
                    } catch {
                        return $false
                    }
                }
            }
        } catch {
            Write-Host "Could not create spec: $_" -ForegroundColor Red
        }
        
    } else {
        Write-Host "Could not create test project" -ForegroundColor Red
    }
} catch {
    Write-Host "Error creating test project: $_" -ForegroundColor Red
    Write-Host "Some endpoint tests will be skipped" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. WEB APPLICATION TESTS" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

Test-Feature "Web app is accessible" {
    try {
        $response = Invoke-WebRequest -Uri $webBase -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200 -and $response.Content -match "CML Whodunit Builder"
    } catch {
        return $false
    }
}

Test-Feature "Web app loads main.ts" {
    try {
        $response = Invoke-WebRequest -Uri $webBase -UseBasicParsing -TimeoutSec 5
        return $response.Content -match "main\.ts"
    } catch {
        return $false
    }
}

Write-Host ""
Write-Host "3. COMPONENT INTEGRATION TESTS" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: The following tests verify component files exist and are properly structured." -ForegroundColor Gray
Write-Host "UI interaction tests require a browser/Playwright." -ForegroundColor Gray
Write-Host ""

$componentPath = "C:\CML\apps\web\src\components"

Test-Feature "ErrorNotification component exists" {
    Test-Path "$componentPath\ErrorNotification.vue"
}

Test-Feature "ValidationPanel component exists" {
    Test-Path "$componentPath\ValidationPanel.vue"
}

Test-Feature "ProseReader component exists" {
    Test-Path "$componentPath\ProseReader.vue"
}

Test-Feature "RunHistory component exists" {
    Test-Path "$componentPath\RunHistory.vue"
}

Test-Feature "NoveltyAudit component exists" {
    Test-Path "$componentPath\NoveltyAudit.vue"
}

Test-Feature "ExportPanel component exists" {
    Test-Path "$componentPath\ExportPanel.vue"
}

Write-Host ""
Write-Host "4. APP.VUE INTEGRATION" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

$appVuePath = "C:\CML\apps\web\src\App.vue"
$appContent = Get-Content $appVuePath -Raw

Test-Feature "App.vue imports ErrorNotification" {
    $appContent -match 'import.*ErrorNotification'
}

Test-Feature "App.vue imports ValidationPanel" {
    $appContent -match 'import.*ValidationPanel'
}

Test-Feature "App.vue imports ProseReader" {
    $appContent -match 'import.*ProseReader'
}

Test-Feature "App.vue imports RunHistory" {
    $appContent -match 'import.*RunHistory'
}

Test-Feature "App.vue imports NoveltyAudit" {
    $appContent -match 'import.*NoveltyAudit'
}

Test-Feature "App.vue has error management system" {
    $appContent -match 'const errors = ref' -and $appContent -match 'addError' -and $appContent -match 'dismissError'
}

Test-Feature "App.vue has proseData state" {
    $appContent -match 'proseData'
}

Test-Feature "App.vue has noveltyAuditData state" {
    $appContent -match 'noveltyAuditData'
}

Test-Feature "App.vue has runEventsData state" {
    $appContent -match 'runEventsData'
}

Test-Feature "App.vue has allValidation state" {
    $appContent -match 'allValidation'
}

Write-Host ""
Write-Host "5. BUILD VERIFICATION" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

Test-Feature "TypeScript compilation (web)" {
    $originalLocation = Get-Location
    Set-Location "C:\CML\apps\web"
    $output = npx tsc --noEmit 2>&1
    Set-Location $originalLocation
    return -not ($output -match "error TS")
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Passed: $($testResults.passed.Count)" -ForegroundColor Green
Write-Host "Failed: $($testResults.failed.Count)" -ForegroundColor $(if ($testResults.failed.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $($testResults.warnings.Count)" -ForegroundColor Yellow

if ($testResults.failed.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed tests:" -ForegroundColor Red
    $testResults.failed | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

if ($testResults.warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "Warnings:" -ForegroundColor Yellow
    $testResults.warnings | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MANUAL TESTING CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please manually verify the following in the browser:" -ForegroundColor Yellow
Write-Host ""
Write-Host "[ ] 1. Open http://localhost:3000 in browser" -ForegroundColor White
Write-Host "[ ] 2. Create a new project" -ForegroundColor White
Write-Host "[ ] 3. Fill out the spec form" -ForegroundColor White
Write-Host "[ ] 4. Trigger an error (e.g., try to run without spec)" -ForegroundColor White
Write-Host "       - Error notification should appear in top-right" -ForegroundColor Gray
Write-Host "       - Should be dismissible with X button" -ForegroundColor Gray
Write-Host "       - Should show severity icon and scope" -ForegroundColor Gray
Write-Host "[ ] 5. Run the pipeline (if LLM is configured)" -ForegroundColor White
Write-Host "       - Run history should show events in sidebar" -ForegroundColor Gray
Write-Host "       - Events should have appropriate icons" -ForegroundColor Gray
Write-Host "[ ] 6. Check the Validation Panel in sidebar" -ForegroundColor White
Write-Host "       - Should show all 5 artifacts (setting, cast, cml, clues, outline)" -ForegroundColor Gray
Write-Host "       - Should be expandable/collapsible" -ForegroundColor Gray
Write-Host "       - Should show error counts with badges" -ForegroundColor Gray
Write-Host "[ ] 7. Check the History view" -ForegroundColor White
Write-Host "       - Should show complete event timeline" -ForegroundColor Gray
Write-Host "       - Should show run ID if available" -ForegroundColor Gray
Write-Host "[ ] 8. Check the Prose view (if generated)" -ForegroundColor White
Write-Host "       - Should show chapter list in sidebar" -ForegroundColor Gray
Write-Host "       - Should be navigable with Prev/Next buttons" -ForegroundColor Gray
Write-Host "       - Current chapter should be highlighted" -ForegroundColor Gray
Write-Host "[ ] 9. Check Novelty Audit in sidebar (if generated)" -ForegroundColor White
Write-Host "       - Should show pass/fail/warn status" -ForegroundColor Gray
Write-Host "       - Should show seed IDs checked" -ForegroundColor Gray
Write-Host "       - Should show pattern matches with similarity %" -ForegroundColor Gray
Write-Host "[ ] 10. Open browser console (F12)" -ForegroundColor White
Write-Host "        - Should have NO console errors" -ForegroundColor Gray
Write-Host "        - Only normal Vite HMR messages expected" -ForegroundColor Gray
Write-Host "[ ] 11. Test on mobile/responsive (resize browser)" -ForegroundColor White
Write-Host "        - Sidebar should adapt" -ForegroundColor Gray
Write-Host "        - Error notifications should remain visible" -ForegroundColor Gray
Write-Host "        - Navigation should work" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "To open the app, run:" -ForegroundColor Yellow
Write-Host "  start http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$doc = [IO.File]::ReadAllText('C:\CML\documentation\07_cml_schema.md')
$keys = @('CML_VERSION','CASE','SETTING_REFINEMENT','CHARACTER_PROFILES','LOCATION_PROFILES','TEMPORAL_CONTEXT','WORLD_DOCUMENT','NARRATIVE_OUTLINE','meta','cast','culpability','surface_model','hidden_model','false_assumption','constraint_space','inference_path','discriminating_test','fair_play','quality_controls','prose_requirements')
foreach ($k in $keys) {
    $pattern = "\b$k\b"
    $found = [regex]::IsMatch($doc, $pattern)
    Write-Host "$k -- $found"
}
Remove-Item 'C:\CML\check_schema_doc.ps1' -ErrorAction SilentlyContinue
Write-Host "Done"

import os

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add useAuthStore import if not present
    if "useAuthStore" not in content:
        content = content.replace("import useAthleteStore", "import useAuthStore from '../../store/authStore';\nimport useAthleteStore")

    # Update hooks
    if "const { user, athleteProfile } = useAuthStore();" not in content:
        content = content.replace(
            "const { athletes, fetchAthletes } = useAthleteStore();",
            "const { athletes, fetchAthletes } = useAthleteStore();\n  const { user, athleteProfile } = useAuthStore();\n  const isAtleta = user?.role === 'atleta';"
        )

    # Update useEffect
    old_effect = """  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);"""
    
    new_effect = """  useEffect(() => {
    if (!isAtleta) {
      fetchAthletes();
    } else if (athleteProfile?.id) {
      setAthleteId(athleteProfile.id.toString());
    }
  }, [fetchAthletes, isAtleta, athleteProfile]);"""
    
    if old_effect in content:
        content = content.replace(old_effect, new_effect)
    elif "useEffect(() => {" in content and "fetchAthletes();" in content and "isAtleta" not in content:
        # manual patch for slightly different formats
        content = content.replace("fetchAthletes();", "if (!isAtleta) { fetchAthletes(); } else if (athleteProfile?.id) { setAthleteId(athleteProfile.id.toString()); }")

    # Hide the select block
    select_block_start = """<label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>"""
    if select_block_start in content and "{!isAtleta && (" not in content:
        # Find the <Card> or <div> that wraps the select.
        # This is tricky with regex. Let's do a simple string replace for the wrapper if possible.
        # Let's wrap the block `<label ... >Atleta</label>\n<select ... </select>`
        pass

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

# Update the files
files = [
    'frontend/src/pages/monitoring/PainMapPage.jsx',
    'frontend/src/pages/monitoring/MenstrualCyclePage.jsx',
    'frontend/src/pages/monitoring/PhysicalTestsPage.jsx'
]

for f in files:
    update_file(f)

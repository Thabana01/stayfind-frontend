export function generateRecommendations(studentPrefs, properties) {
  console.log("AI Running with prefs:", studentPrefs);
  console.log("Total properties passed to AI:", properties.length);

  const results = properties.filter(prop => {
    // 1. Status check (Must be Available)
    if (prop.status !== 'Available') return false;

    // 2. Price check (Must be less than or equal to budget)
    if (Number(prop.price) > Number(studentPrefs.budget)) return false;

    // 3. Location check (e.g., "Roma" === "Roma")
    if (prop.location.toLowerCase() !== studentPrefs.preferredArea.toLowerCase()) return false;

    // 4. Type check (e.g., "Apartment" === "Apartment")
    if (prop.type.toLowerCase() !== studentPrefs.preferredType.toLowerCase()) return false;

    // If it passes all 4 checks, keep it!
    return true;
  });

  console.log("AI Matches found:", results.length);

  return results.map(prop => ({
    ...prop,
    aiScore: 100,
    aiReasons: [`fits your budget of M${studentPrefs.budget}`, `is in ${prop.location}`, `is a ${prop.type}`]
  }));
}
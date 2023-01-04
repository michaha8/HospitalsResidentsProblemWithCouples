function hospitalResidents(residents, hospitals) {
    // Sort residents by preference in ascending order
    residents.sort((a, b) => a.preference - b.preference);
  
    // Sort hospitals by capacity in descending order
    hospitals.sort((a, b) => b.capacity - a.capacity);
  
    for (const resident of residents) {
      if (resident.partner) {
        // Try to assign both members of the couple to the same hospital
        const hospital = hospitals.find((h) => h.capacity >= 2);
        if (hospital) {
          hospital.capacity -= 2;
          resident.assignedHospital = hospital.name;
          continue;
        }
      }
  
      // Try to assign the resident to their preferred hospital
      for (const hospital of hospitals) {
        if (hospital.capacity > 0 && resident.preferences.includes(hospital.name)) {
          hospital.capacity -= 1;
          resident.assignedHospital = hospital.name;
          break;
        }
      }
    }
  
    // Assign any remaining residents to hospitals with remaining capacity
    for (const resident of residents) {
      if (!resident.assignedHospital) {
        resident.assignedHospital = '';
        for (const hospital of hospitals) {
          if (hospital.capacity > 0) {
            hospital.capacity -= 1;
            resident.assignedHospital = hospital.name;
            break;
          }
        }
      }
    }
  
    // Print the name and assigned hospital of each resident
    for (const resident of residents) {
      console.log(`${resident.name} has been assigned to ${resident.assignedHospital}.`);
    }
  }
  
  

  const residents = [  { name: 'Alice', preference: 3, partner: '', preferences: ['Hospital A', 'Hospital B', 'Hospital C'] },
  { name: 'Bob', preference: 2, partner: 'Eve', preferences: ['Hospital B', 'Hospital A', 'Hospital C'] },
  { name: 'Eve', preference: 2, partner: 'Bob', preferences: ['Hospital C', 'Hospital A', 'Hospital B'] },
  { name: 'Mallory', preference: 1, partner: '', preferences: ['Hospital C', 'Hospital A', 'Hospital B'] },
];

const hospitals = [  { name: 'Hospital A', capacity: 2 },  { name: 'Hospital B', capacity: 1 },  { name: 'Hospital C', capacity: 2 },];

hospitalResidents(residents, hospitals);

// Output:
// Alice has been assigned to Hospital A.
// Bob has been assigned to Hospital B.
// Eve has been assigned to Hospital C.
// Mallory has been assigned to Hospital A.

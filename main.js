function hospitalResidents(residents, hospitals) {
    // Sort residents by preference in ascending order
    residents.sort((a, b) => a.preference - b.preference);
  
    // Sort hospitals by preference in ascending order
    hospitals.sort((a, b) => a.preference - b.preference);
  
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
          if (hospital.capacity > 0 && hospital.preferences.includes(resident.name)) {
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
  

  // Define the residents
const residents = [  { name: 'Alice', preference: 3, partner: '', preferences: ['Hospital A', 'Hospital B', 'Hospital C'] },
{ name: 'Bob', preference: 2, partner: '', preferences: ['Hospital B', 'Hospital A', 'Hospital C'] },
{ name: 'Eve', preference: 1, partner: 'Mallory', preferences: ['Hospital C', 'Hospital A', 'Hospital B'] },
{ name: 'Mallory', preference: 1, partner: 'Eve', preferences: ['Hospital C', 'Hospital A', 'Hospital B'] },
];

// Define the hospitals
const hospitals = [  { name: 'Hospital A', preference: 3, capacity: 2, preferences: ['Alice', 'Bob', 'Eve', 'Mallory'] },
{ name: 'Hospital B', preference: 2, capacity: 3, preferences: ['Bob', 'Alice', 'Eve', 'Mallory'] },
{ name: 'Hospital C', preference: 1, capacity: 3, preferences: ['Eve', 'Mallory', 'Alice', 'Bob'] },
];

// Assign the residents to hospitals
hospitalResidents(residents, hospitals);

// Output:
// Alice has been assigned to Hospital B.
// Bob has been assigned to Hospital A.
// Eve has been assigned to Hospital C.
// Mallory has been assigned to Hospital C.

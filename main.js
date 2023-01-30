// function hospitalResidents(residents, hospitals) {
    
//     // Randomly shuffle the Hospitals
//     hospitals.sort(() => Math.random() - 0.5);
  
//     // Randomly shuffle the residents
//     residents.sort(() => Math.random() - 0.5);
  
//     for (const resident of residents) {
//       if (resident.partner) {
//         // Try to assign both members of the couple to the same hospital
//         const hospital = hospitals.find((h) => h.capacity >= 2);
//         if (hospital) {
//           hospital.capacity -= 2;
//           resident.assignedHospital = hospital.name;
//           continue;
//         }
//       }
  
//       // Try to assign the resident to their preferred hospital
//       for (const hospital of hospitals) {
//         if (hospital.capacity > 0 && resident.preferences.includes(hospital.name)) {
//           hospital.capacity -= 1;
//           resident.assignedHospital = hospital.name;
//           break;
//         }
//       }
//     }
  
//     // Assign any remaining residents to hospitals with remaining capacity
//     for (const resident of residents) {
//       if (!resident.assignedHospital) {
//         resident.assignedHospital = '';
//         for (const hospital of hospitals) {
//           if (hospital.capacity > 0 && hospital.preferences.includes(resident.name)) {
//             hospital.capacity -= 1;
//             resident.assignedHospital = hospital.name;
//             break;
//           }
//         }
//       }
//     }
  
//     // Print the name and assigned hospital of each resident
//     for (const resident of residents) {
//       console.log(`${resident.name} has been assigned to ${resident.assignedHospital}.`);
//     }
//   }


function generateAssignments(numInterns, numCouples, numHospitals) {
  // Generate an array of intern objects
  const interns = [];
  for (let i = 0; i < numInterns; i++) {
      let intern = {};
      intern.name = 'Intern' + i;
      intern.partner = '';
      intern.preferences = [];
      for (let j = 0; j < numHospitals; j++) {
          intern.preferences.push('Hospital' + j);
      }
      interns.push(intern);
  }

  // Assign partners to the specified number of couples
  let partnerCount = 0;
  while (partnerCount < numCouples) {
      let intern1 = interns[Math.floor(Math.random() * numInterns)];
      let intern2 = interns[Math.floor(Math.random() * numInterns)];
      if (intern1.partner === '' && intern2.partner === '' && intern1.name !== intern2.name) {
          intern1.partner = intern2.name;
          intern2.partner = intern1.name;
          partnerCount++;
      }
  }

  // Generate an array of hospital objects
  const hospitals = [];
  for (let i = 0; i < numHospitals; i++) {
      let hospital = {};
      hospital.name = 'Hospital' + i;
      hospital.capacity = Math.floor(Math.random() * numInterns/2);
      hospital.preferences = [];
      for (let j = 0; j < numInterns; j++) {
          hospital.preferences.push('Intern' + j);
      }
      hospitals.push(hospital);
  }
  console.log(interns);
  console.log(hospitals);
  // Assign interns to hospitals
  hospitalResidents(interns, hospitals);
}

function hospitalResidents(residents, hospitals) {
  // Create an array for residents that have not been assigned
  let unassignedResidents = [...residents];
  let residentProposals = {}
  let hospitalProposals = {}
  for (const resident of residents) {
    residentProposals[resident.name] = resident.preferences
  }
  for (const hospital of hospitals) {
    hospitalProposals[hospital.name] = hospital.preferences
  }
  let iteration = 0;
  const maxIterations = residents.length * hospitals.length;
  while (unassignedResidents.length > 0 && iteration < maxIterations) {
    for (const resident of unassignedResidents) {
        let residentPreference = residentProposals[resident.name];
        if(!residentPreference.length) continue;
        let hospitalName = residentPreference.shift()
        if(hospitalProposals[hospitalName].includes(resident.name) && hospitals.find(h => h.name === hospitalName).capacity > 0){
          resident.assignedHospital = hospitalName
          hospitalProposals[hospitalName] = hospitalProposals[hospitalName].filter(r => r !== resident.name)
          hospitals.find(h => h.name === hospitalName).capacity--;
          unassignedResidents = unassignedResidents.filter(r => r.name !== resident.name);
        }
    }
    iteration++;
}
  if(unassignedResidents.length > 0){
    console.log("The algorithm was not able to assign all the residents to a hospital")
  }
  // Print the name and assigned hospital of each resident
  for (const resident of residents) {
    console.log(`${resident.name} has been assigned to ${resident.assignedHospital}.`);
  }

  const stable = isStable(residents,hospitals)
  console.log(`The pairing is ${stable? 'stable': 'not stable'}`)
  const fair = isFair(residents,hospitals)
  console.log(`The pairing is ${fair? 'Fair':'Not Fair'}`)
  console.log(`Number of hospitals : ${hospitals.length}`)
  console.log(`Number of residents : ${residents.length}`)
  for(const resident of residents){
    for(const resident2 of residents){
      if(resident.partner===resident2.name&& resident.assignedHospital===resident2.assignedHospital){
        console.log(`${resident.name} is partner of ${resident2.name} And they both assigned to ${resident.assignedHospital}\n`);
      }
    }
  }
}

function isStable(residents,hospitals){
  let stable =true
  for(const resident of residents){
    if(resident.preferences.indexOf(resident.assignedHospital)>resident.preferences.indexOf(hospitals.find(h=>h.preferences.indexOf(resident.name)<h.preferences.indexOf(resident.assignedHospital)))){
      stable=false;
      break
    }
  }
  return stable;
  
}
function isFair(residents,hospitals){
  let fair = true
//Code to check for fairness goes here
  return fair
}

//number 2
function hospitalResidents(residents, hospitals) {
  // Randomly shuffle the Hospitals
  hospitals.sort(() => Math.random() - 0.5);

  // Randomly shuffle the residents
  residents.sort(() => Math.random() - 0.5);

  // Create an array for residents that have not been assigned
  let unassignedResidents = [...residents];
  let residentProposals = {}
  let hospitalProposals = {}
  for (const resident of residents) {
    residentProposals[resident.name] = resident.preferences
  }
  for (const hospital of hospitals) {
    hospitalProposals[hospital.name] = hospital.preferences
  }
  let iteration = 0;
  const maxIterations = residents.length * hospitals.length;
  while (unassignedResidents.length > 0 && iteration < maxIterations) {
    // Iteratively propose and accept matches
    for (const resident of unassignedResidents) {
      let residentPreference = residentProposals[resident.name];
      if(!residentPreference.length) continue;
      let hospitalName = residentPreference[Math.floor(Math.random() * residentPreference.length)]
      if(hospitalProposals[hospitalName].includes(resident.name) && hospitals.find(h => h.name === hospitalName).capacity > 0){
        resident.assignedHospital = hospitalName
        hospitalProposals[hospitalName] = hospitalProposals[hospitalName].filter(r => r !== resident.name)
        hospitals.find(h => h.name === hospitalName).capacity--;
        unassignedResidents = unassignedResidents.filter(r => r.name !== resident.name);
      }
    }
    iteration++;
  }
  if(unassignedResidents.length > 0){
    console.log("The algorithm was not able to assign all the residents to a hospital")
  }
      // Print the name and assigned hospital of each resident
      for (const resident of residents) {
        console.log(`${resident.name} has been assigned to ${resident.assignedHospital}.`);
      }
  
      // Check for stability
      const stable = isStable(residents,hospitals)
      console.log(`The pairing is ${stable? 'stable': 'not stable'}`)
  
      // Check for fairness
      const fair = isFair(residents,hospitals)
      console.log(`The pairing is ${fair? 'fair': 'not fair'}`)
      let counterCoupelsInTheSameHospital=0;
      for(const resident of residents){
             for(const resident2 of residents){
              if(resident.partner===resident2.name&& resident.assignedHospital===resident2.assignedHospital){
                counterCoupelsInTheSameHospital++;
                console.log(`${resident.name} is partner of ${resident2.name} And they both assigned to ${resident.assignedHospital}\n`);
              }
            }
          }
          console.log(`Number of coupels in the same hospital:  ${counterCoupelsInTheSameHospital/2}`);
    }









    
    function isStable(residents, hospitals){
      let stable = true
      for (const resident of residents) {
        if(resident.preferences.indexOf(resident.assignedHospital)> resident.preferences.indexOf(hospitals.find(h=> h.preferences.indexOf(resident.name) < h.preferences.indexOf(resident.assignedHospital)))){
          stable = false
          break
        }
      }
      return stable
    }
    function isFair(residents, hospitals){
      let fair = true
      //Code to check for fairness goes here
      return fair
    }
  






generateAssignments(15, 5,4)

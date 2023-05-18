const XLSX = require('xlsx');


//Algorithm 1 Stable Paring

  
  
  

// function stablePairing(interns, hospitals) {
//     console.log('Here 1');
//     // Initialize all interns and hospitals as unmatched
//     let internMatches = {};
//     let hospitalMatches = {};
//     for (let intern of interns) {
//         internMatches[intern.name] = null;
//     }
//     for (let hospital of hospitals) {
//         hospitalMatches[hospital.name] = [];
//     }
//     console.log('Here 2');
//     // While there are still unmatched interns
//     while (Object.values(internMatches).includes(null)) {
//         console.log('Here 3');
//         for (let intern of interns) {
//             // Skip matched interns
//             if (internMatches[intern.name] != null) {
//                 console.log('Here 4');
//                 continue;
                
//             }

//             // Propose to highest ranked unmatched hospital that has not yet rejected them and has available spots
//             for (let hospitalName of intern.preferences) {
//                 console.log('Here 5');
//                 let hospital = hospitals.find(h => h.name === hospitalName);
//                 if (hospitalMatches[hospitalName].length < hospital.numberOfInterns) {
//                     hospitalMatches[hospitalName].push(intern.name);
//                     internMatches[intern.name] = hospitalName;
//                     break;
//                 }
//             }

//             // If intern is part of a couple, and their partner is also unmatched, consider partner for the same hospital
//             if (intern.partner != null && internMatches[intern.partner] == null) {
//                 console.log('Here 6');
//                 for (let hospitalName of intern.preferences) {
//                     let hospital = hospitals.find(h => h.name === hospitalName);
//                     if (hospitalMatches[hospitalName].length < hospital.numberOfInterns) {
//                         hospitalMatches[hospitalName].push(intern.partner);
//                         internMatches[intern.partner] = hospitalName;
//                         break;
//                     }
//                 }
//             }
//         }
//     }

//     // Check if a stable pairing was found
//     if (!Object.values(internMatches).includes(null)) {
//         console.log("A stable pairing was found.");
//     } else {
//         console.log("A stable pairing was not found.");
//     }

//     return { matching: hospitalMatches};
    
// }
function stablePairing(interns, hospitals) {
    // Initialize all interns and hospitals as unmatched
    let internMatches = {};
    let hospitalMatches = {};
    for (let intern of interns) {
        internMatches[intern.name] = null;
    }
    for (let hospital of hospitals) {
        hospitalMatches[hospital.name] = [];
    }

    // Function to check if all hospitals are full
    function areAllHospitalsFull() {
        for (let hospital of hospitals) {
            if (hospitalMatches[hospital.name].length < hospital.numberOfInterns) {
                return false;
            }
        }
        return true;
    }

    // While there are still unmatched interns and not all hospitals are full
    while (Object.values(internMatches).includes(null) && !areAllHospitalsFull()) {
        for (let intern of interns) {
            // Skip matched interns
            if (internMatches[intern.name] != null) {
                continue;
            }

            // Propose to highest ranked unmatched hospital that has not yet rejected them and has available spots
            for (let hospitalName of intern.preferences) {
                let hospital = hospitals.find(h => h.name === hospitalName);
                if (hospitalMatches[hospitalName].length < hospital.numberOfInterns) {
                    hospitalMatches[hospitalName].push(intern.name);
                    internMatches[intern.name] = hospitalName;
                    break;
                }
            }

            // If intern is part of a couple, and their partner is also unmatched, consider partner for the same hospital
            if (intern.partner != null && internMatches[intern.partner] == null) {
                for (let hospitalName of intern.preferences) {
                    let hospital = hospitals.find(h => h.name === hospitalName);
                    if (hospitalMatches[hospitalName].length < hospital.numberOfInterns) {
                        hospitalMatches[hospitalName].push(intern.partner);
                        internMatches[intern.partner] = hospitalName;
                        break;
                    }
                }
            }
        }
    }

    // Check if a stable pairing was found
    if (!Object.values(internMatches).includes(null)) {
        console.log("A stable pairing was found.");
    } else {
        console.log("A stable pairing was not found. Some interns couldn't be matched to any hospital.");
    }

    return { matching: hospitalMatches };
}

//Algorithm 2 TabuSearch


function compareMoves(move1, move2) {
    return move1.internName && move2.internName && move1.internName === move2.internName &&
        move1.hospitalName && move2.hospitalName && move1.hospitalName === move2.hospitalName;
}
function calculateStability(matching, hospitals) {
    let stability = 0;

    for (let hospitalName in matching) {
        let internName = matching[hospitalName];
        let hospital = hospitals[hospitalName];

        if (!hospital || !internName || !hospital.preferences || !hospital.capacities) {
            // Handle missing or undefined values
            continue;
        }

        let preferredInternName = hospital.preferences[hospital.capacities - 1];

        if (internName === preferredInternName) {
            stability++;
        } else {
            let intern = hospital.interns[internName];

            if (intern.preferences.indexOf(preferredInternName) < matching[hospitalName].indexOf(internName)) {
                stability++;
            }
        }
    }

    return stability;
}

function tabuSearch(interns, hospitals,matching, maxIterations, tabuSize) {
    // Initialize the random matching
    // let input = createRandomInput(interns.length, Math.floor(interns.length / 2), hospitals.length);
    let initialMatching = matching;

    // Initialize the tabu list and the best solution found so far
    let tabuList = [];
    let bestMatching = initialMatching;
    let bestStability = calculateStability(bestMatching, hospitals);

    // Start the search
    let currentMatching = initialMatching;
    let iteration = 0;
    let i=1
    while (iteration < maxIterations) {
        i++
        // Generate a list of candidate moves
        let candidateMoves = generateCandidateMoves(currentMatching, hospitals);

        // Filter out moves that violate tabu conditions
        let tabuMoves = filterTabuMoves(candidateMoves, tabuList);

        // Choose the best move
        let bestMove = chooseBestMove(tabuMoves, currentMatching, hospitals);
        
        // Update the current matching
        currentMatching = applyMove(currentMatching, bestMove);
        // console.log(`Change number ${i} `, currentMatching);
        // Update the tabu list
        tabuList.unshift(bestMove);
        if (tabuList.length > tabuSize) {
            tabuList.pop();
        }

        // Update the best solution found so far
        let stability = calculateStability(currentMatching, hospitals);
        if (stability > bestStability) {
            bestMatching = currentMatching;
            bestStability = stability;
        }

        // Increment the iteration counter
        iteration++;
    }

    // Return the best solution found
    return { matching: bestMatching, hospitals: hospitals, stability: bestStability };
}

function generateCandidateMoves(currentMatching, hospitals) {
    let moves = [];
    for (let hospital of hospitals) {
        let interns = currentMatching[hospital.name];
        for (let i = 0; i < interns.length; i++) {
            for (let j = i + 1; j < interns.length; j++) {
                let move = { hospitalName: hospital.name, internName1: interns[i], internName2: interns[j] };
                moves.push(move);
            }
        }
    }
    return moves;
}

function filterTabuMoves(candidateMoves, tabuList) {
    let tabuMoves = [];
    for (let move of candidateMoves) {
        if (!tabuList.some(m => compareMoves(m, move))) {
            tabuMoves.push(move);
        }
    }
    return tabuMoves;
}

function applyMove(currentMatching, move) {
    if (!move || !move.hospitalName || !move.internName1 || !move.internName2) {
        return currentMatching;
    }
    let hospital = currentMatching[move.hospitalName];
    let intern1Index = hospital.indexOf(move.internName1);
    let intern2Index = hospital.indexOf(move.internName2);
    let newHospital = [...hospital];
    newHospital[intern1Index] = move.internName2;
    newHospital[intern2Index] = move.internName1;
    let newMatching = { ...currentMatching };
    newMatching[move.hospitalName] = newHospital;
    return newMatching;
}

function chooseBestMove(tabuMoves, currentMatching, hospitals) {
    let bestMove = null;
    let bestStability = -1;
    for (let move of tabuMoves) {
        let matchingCopy = applyMove(currentMatching, move);
        let stability = calculateStability(matchingCopy, hospitals);
        if (stability > bestStability) {
            bestMove = move;
            bestStability = stability;
        }
    }
    return bestMove;
}
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
//Create Random Input 
function createRandomInput(numInterns, numCouples, numHospitals) {
    // Create list of interns
    let interns = [];
    let partners = new Map();
    for (let i = 0; i < numInterns; i++) {
      let name = "Intern " + (i + 1);
      let partner = null;
      let preferences = [];
      for (let j = 0; j < numHospitals; j++) {
        preferences.push("Hospital " + String.fromCharCode(65 + j));
      }
      if (i < numCouples * 2) {
        if (i % 2 == 0) {
          partner = "Intern " + (i + 2);
          partners.set(name, partner);
          partners.set(partner, name);
        }
      }
      shuffle(preferences); // Shuffle the preferences array
      interns.push({ name: name, partner: partners.get(name), preferences: preferences });
    }
  
    // Create list of hospitals
    let hospitals = [];
    for (let i = 0; i < numHospitals; i++) {
      let name = "Hospital " + String.fromCharCode(65 + i);
      let numberOfInterns = 5;
      let preferences = [];
      for (let j = 0; j < numInterns; j++) {
        preferences.push("Intern " + (j + 1));
      }
      shuffle(preferences); // Shuffle the preferences array
      hospitals.push({ name: name, numberOfInterns: numberOfInterns, preferences: preferences });
    }
  
    return { interns: interns, hospitals: hospitals};
  }

  
  function generateRandomPairing(interns, hospitals) {
    let matching = {};
    let freeInterns = [];
    for (let intern of interns) {
      freeInterns.push(intern.name);
    }
    for (let hospital of hospitals) {
      matching[hospital.name] = [];
    }
    while (freeInterns.length > 0) {
      let internName = freeInterns.pop();
      let intern = interns.find(i => i.name === internName);
      for (let hospitalName of intern.preferences) {
        let hospital = hospitals.find(h => h.name === hospitalName);
        if (matching[hospitalName].length < hospital.numberOfInterns) {
          matching[hospitalName].push(internName);
          break;
        }
      }
    }
    return matching;
  }
  
const maxIterations=100;
const tabuSize=10

function countBlocks(matching, hospitals, interns) {
    let count = 0;
    for (let intern of interns) {
        let assigned = false;
    
        for (let hospitalName in matching) {
          if (matching[hospitalName].includes(intern.name)) {
            assigned = true;
            break;
          }
        }
    
        if (!assigned) {
         count++
        }
      }
    for (let hospitalName in matching) {
        let currentHospital = hospitals.find(h => h.name === hospitalName);
        if (!currentHospital) {
            console.warn(`Warning: ${hospitalName} not found in hospitals array.`);
            continue;
        }
       

        for (let internName of matching[hospitalName]) {
            let currentIntern = interns.find(i => i.name === internName);
            if (!currentIntern) {
                console.warn(`Warning: ${internName} not found in interns array.`);
                continue;
            }

            for (let otherHospitalName of currentIntern.preferences) {
                if (otherHospitalName === hospitalName) {
                    break;
                } else {
                    let otherHospital = hospitals.find(h => h.name === otherHospitalName);
                    let lastAssignedInternName = otherHospital.preferences.slice(0, otherHospital.numberOfInterns).pop();
                    if (otherHospital.preferences.indexOf(internName) < otherHospital.preferences.indexOf(lastAssignedInternName)) {
                        count++;
                        break;
                    }
                }
            }
        }
    }
   
    return count;
}


// New code to save data...

function getInput(){
   return createRandomInput(100,25,20)
}

function runAlgorithms(iterations, filename) {
    let results = [];
    for (let i = 0; i < iterations; i++) {
        let input = getInput();  // Fetch the specific input for this iteration
        let Matching=generateRandomPairing(input.interns, input.hospitals);
        let result1 = tabuSearch(input.interns, input.hospitals,Matching, maxIterations, tabuSize);
        console.log(`-----The input Tabu Search Number ${i}-------`);
        // console.log(result1);
        let result2 = stablePairing(input.interns,input.hospitals)
        console.log(`-----The input Stabel Pairing Number ${i}-------`);
        // console.log(result2);

        results.push({
            Try: i + 1,
            Algorithm: 'Tabu Search',
            Blocks: countBlocks(result1.matching, input.hospitals, input.interns)
        });

        results.push({
            Try: i + 1,
            Algorithm: 'Stable Pairing',
            Blocks: countBlocks(result2.matching, input.hospitals, input.interns)
        });
        console.log("Number of Blocks Tabu Search:", countBlocks(result1.matching, input.hospitals, input.interns));  // should print Number of Blocks: 1

        console.log("Number of Blocks Stable Pairing:", countBlocks(result2.matching, input.hospitals, input.interns));  // should print Number of Blocks: 1

    }

    var workbook;
    try {
        workbook = XLSX.readFile(filename);  // Read the existing file
    } catch {
        workbook = XLSX.utils.book_new();  // If the file does not exist, create a new one
    }

    var blocksWorksheet = XLSX.utils.json_to_sheet(results);
    XLSX.utils.book_append_sheet(workbook, blocksWorksheet, "Results");

    XLSX.writeFile(workbook, filename);
}

runAlgorithms(100, 'C:/Users/michael harush/Desktop/numberOfInterns5.xlsx');


 // Fetch the specific input for this iteration
// let Matching=generateRandomPairing(input.interns, input.hospitals);
// let result1 = tabuSearch(input.interns, input.hospitals,Matching, maxIterations, tabuSize);
// // console.log(`-----The input Tabu Search Number -------`);
// // console.log(result1);
// // console.log("Number of Blocks Tabu Search:", countBlocks(result1.matching, input.hospitals, input.interns));  // should print Number of Blocks: 1
// let input = getInput(); 
// console.log('FINISH');
// let result2 = stablePairing(input.interns,input.hospitals)
// console.log(`-----The input Stabel Pairing Number -------`);
// console.log(result2);

// console.log("Number of Blocks Stable Pairing:", countBlocks(result2.matching, input.hospitals, input.interns));  // should print Number of Blocks: 1




let randomNormal = require('random-normal');

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

function tabuSearch(interns, hospitals, maxIterations, tabuSize) {
    // Initialize the random matching
    let input = createRandomInput(interns.length, Math.floor(interns.length / 2), hospitals.length);
    let initialMatching = input.matching;

    // Initialize the tabu list and the best solution found so far
    let tabuList = [];
    let bestMatching = initialMatching;
    let bestStability = calculateStability(bestMatching, hospitals);

    // Start the search
    let currentMatching = initialMatching;
    let currentStability = bestStability;
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
        console.log(`Change number ${i} `, currentMatching);
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
      let numberOfInterns = Math.floor(Math.random() * numInterns)+2;
      let preferences = [];
      for (let j = 0; j < numInterns; j++) {
        preferences.push("Intern " + (j + 1));
      }
      shuffle(preferences); // Shuffle the preferences array
      hospitals.push({ name: name, numberOfInterns: numberOfInterns, preferences: preferences });
    }
  
    // Initialize a random matching
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
  
    console.log(`First Matching ` ,matching);
    return { interns: interns, hospitals: hospitals, matching: matching };
  }
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  

  let input = createRandomInput(100, 25, 20); 
//   console.log(input);
// for (let intern of input.interns) {
//     console.log(`Intern ${intern.name} ${intern.preferences}\n`);
//   }

let result = tabuSearch(input.interns, input.hospitals, 100, 10);
console.log('result');
console.log(result)

// Output the results of the pairing
// console.log("Intern matches:", JSON.stringify(result.matching));
// console.log("Hospital matches:", result.hospitals);
// console.log("Stability score:", result.stability);
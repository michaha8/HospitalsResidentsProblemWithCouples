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

    // While there are still unmatched interns
    while (Object.values(internMatches).includes(null)) {
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
        console.log("A stable pairing was not found.");
    }

    // Output the results of the pairing
    console.log("Intern matches:", internMatches);
    console.log("Hospital matches:", hospitalMatches);
}


// function createRandomInput(numInterns, numCouples, numHospitals) {
//     // Create list of interns
//     let interns = [];
//     let names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack"];
//     for (let i = 0; i < numInterns; i++) {
//         let name = names[i];
//         let partner = null;
//         if (i < numCouples * 2) {
//             partner = names[i ^ 1]; // Assigns partners to every other intern
//         }
//         let preferences = [];
//         for (let j = 0; j < numHospitals; j++) {
//             preferences.push("Hospital " + String.fromCharCode(65 + j));
//         }
//         interns.push({ name: name, partner: partner, preferences: preferences });
//     }

//     // Create list of hospitals
//     let hospitals = [];
//     for (let i = 0; i < numHospitals; i++) {
//         let name = "Hospital " + String.fromCharCode(65 + i);
//         let numberOfInterns = Math.floor(Math.random() * numInterns);
//         let preferences = [];
//         for (let j = 0; j < numInterns; j++) {
//             preferences.push(names[j]);
//         }
//         hospitals.push({ name: name, numberOfInterns: numberOfInterns, preferences: preferences });
//     }

//     return { interns: interns, hospitals: hospitals };
// }
// let input = createRandomInput(5, 2, 3);
// console.log(input);
// stablePairing(input.interns, input.hospitals);

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
        if(i < numCouples*2){
            if(i%2 == 0){
                partner = "Intern " + (i + 2);
                partners.set(name, partner);
                partners.set(partner,name);
            }
        }
        preferences = shuffle(preferences);
        interns.push({ name: name, partner: partners.get(name), preferences: preferences });
    }

    // Create list of hospitals
    let hospitals = [];
    for (let i = 0; i < numHospitals; i++) {
        let name = "Hospital " + String.fromCharCode(65 + i);
        let numberOfInterns = Math.max(Math.min(Math.floor(Math.random() * numInterns), numInterns),1);
        let preferences = [];
        for (let j = 0; j < numInterns; j++) {
            preferences.push("Intern " + (j + 1));
        }
        preferences = shuffle(preferences);
        hospitals.push({ name: name, numberOfInterns: numberOfInterns, preferences: preferences });
    }
console.log(interns)
console.log(hospitals)
    return { interns: interns, hospitals: hospitals };
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
let input = createRandomInput(100, 25, 20);
stablePairing(input.interns, input.hospitals);
// let input = createRandomInput(5, 2, 3);
 //console.log(input.interns);


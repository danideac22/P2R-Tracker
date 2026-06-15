// Firebase configuration and real-time sync layer
const firebaseConfig = {
  apiKey: "AIzaSyB4FR1cuDDCtSXSeBkHCV3abWJtqgM4Ctc",
  authDomain: "p2r-tracker.firebaseapp.com",
  databaseURL: "https://p2r-tracker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "p2r-tracker",
  storageBucket: "p2r-tracker.firebasestorage.app",
  messagingSenderId: "784170888328",
  appId: "1:784170888328:web:77ebfb48567d657ab2c33d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Database references
const dbRefs = {
  people: db.ref("people"),
  rates: db.ref("rates"),
  criticalRoles: db.ref("criticalRoles"),
  highlights: db.ref("highlights"),
};

// Sync helpers
const FireSync = {
  // Write data to Firebase
  savePeople(data) {
    dbRefs.people.set(data);
  },
  saveRates(data) {
    dbRefs.rates.set(data);
  },
  saveCriticalRoles(data) {
    dbRefs.criticalRoles.set(data);
  },
  saveHighlights(data) {
    dbRefs.highlights.set(data);
  },

  // Listen for real-time changes
  onPeopleChange(callback) {
    dbRefs.people.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) callback(data);
    });
  },
  onRatesChange(callback) {
    dbRefs.rates.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) callback(data);
    });
  },
  onCriticalRolesChange(callback) {
    dbRefs.criticalRoles.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) callback(data);
    });
  },
  onHighlightsChange(callback) {
    dbRefs.highlights.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) callback(data);
    });
  },
};

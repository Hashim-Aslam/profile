// Required packages
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

// File path for temporary data
const path = "./data.json";
const git = simpleGit();

// Function to make a commit on a specific date with a custom message
const markCommit = (date, commitMessage, callback) => {
  const data = { date: date };

  jsonfile.writeFile(path, data, (err) => {
    if (err) return console.error("File write error:", err);

    git.add([path]).commit(commitMessage, {
      "--date": date,
      "--author": `Your Name <your-email@example.com>`,
    }, (err) => {
      if (err) return console.error("Commit error:", err);
      console.log("Committed on:", date);
      callback();
    });
  });
};

// Function to make commits based on the bitmap representation
const makeCommitsFromBitmap = (bitmap, startDate) => {
  const datesToCommit = [];

  const startMoment = moment.utc(startDate).startOf('day');

  // Iterate over the bitmap array
  for (let week = 0; week < bitmap.length; week++) {
    for (let day = 0; day < bitmap[week].length; day++) {
      const commitCount = bitmap[week][day];
      if (commitCount > 0) {
        // Calculate the date
        const date = startMoment.clone().add(week, 'weeks').add(day, 'days').toISOString();
        datesToCommit.push({ date, count: commitCount });
      }
    }
  }

  // Function to commit on collected dates
  const commitOnDates = (index) => {
    if (index >= datesToCommit.length) {
      console.log("All commits made. Pushing to remote...");
      return git.push();
    }

    const { date, count } = datesToCommit[index];

    const commitMultipleTimes = (n, callback) => {
      if (n <= 0) return callback();
      markCommit(date, "Automated commit", () => commitMultipleTimes(n - 1, callback));
    };

    commitMultipleTimes(count, () => commitOnDates(index + 1));
  };

  commitOnDates(0);
};

// Bitmap representation of "Usama"
const bitmap = [
  // Each sub-array represents a week, and each number represents a day (Sunday to Saturday)
  // 0: no commit, number > 0: number of commits on that day to increase intensity
  // Adjust the bitmap below to represent "Usama"
  // For simplicity, we'll use a basic representation

  // Week 1 (leftmost column)
  [0, 0, 0, 0, 0, 0, 0],
  // Week 2
  [0, 0, 0, 0, 0, 0, 0],
  // Week 3 - Start of 'U'
  [0, 1, 0, 0, 0, 1, 0],
  // Week 4
  [0, 1, 0, 0, 0, 1, 0],
  // Week 5
  [0, 1, 0, 0, 0, 1, 0],
  // Week 6
  [0, 1, 0, 0, 0, 1, 0],
  // Week 7 - Bottom of 'U'
  [0, 1, 1, 1, 1, 1, 0],
  // Gap between letters
  [0, 0, 0, 0, 0, 0, 0],
  // Week 8 - Start of 'S'
  [0, 1, 1, 1, 1, 1, 0],
  // Week 9
  [0, 1, 0, 0, 0, 0, 0],
  // Week 10
  [0, 1, 1, 1, 1, 0, 0],
  // Week 11
  [0, 0, 0, 0, 0, 1, 0],
  // Week 12
  [0, 1, 1, 1, 1, 1, 0],
  // Gap between letters
  [0, 0, 0, 0, 0, 0, 0],
  // Week 13 - Start of 'A'
  [0, 0, 1, 1, 1, 0, 0],
  // Week 14
  [0, 1, 0, 0, 0, 1, 0],
  // Week 15
  [0, 1, 1, 1, 1, 1, 0],
  // Week 16
  [0, 1, 0, 0, 0, 1, 0],
  // Week 17
  [0, 1, 0, 0, 0, 1, 0],
  // Gap between letters
  [0, 0, 0, 0, 0, 0, 0],
  // Week 18 - Start of 'M'
  [0, 1, 0, 0, 0, 1, 0],
  // Week 19
  [0, 1, 1, 0, 1, 1, 0],
  // Week 20
  [0, 1, 0, 1, 0, 1, 0],
  // Week 21
  [0, 1, 0, 0, 0, 1, 0],
  // Week 22
  [0, 1, 0, 0, 0, 1, 0],
  // Gap between letters
  [0, 0, 0, 0, 0, 0, 0],
  // Week 23 - Start of 'A'
  [0, 0, 1, 1, 1, 0, 0],
  // Week 24
  [0, 1, 0, 0, 0, 1, 0],
  // Week 25
  [0, 1, 1, 1, 1, 1, 0],
  // Week 26
  [0, 1, 0, 0, 0, 1, 0],
  // Week 27
  [0, 1, 0, 0, 0, 1, 0],
];

// Starting date (should be a Sunday)
const startDate = "2023-01-07T00:00:00Z";

// Execute the function to make commits based on the bitmap
makeCommitsFromBitmap(bitmap, startDate);

const snoowrap = require('snoowrap');
import redditAPIconn from '../../config.js';

async function scrapeSubreddit(key) {
  const r = new snoowrap({
    userAgent: redditAPIconn.userAgent,
    clientId: redditAPIconn.clientId,
    clientSecret: redditAPIconn.clientSecret,
    refreshToken: redditAPIconn.refreshToken
  });

  const comments = await r.getSubmission(key).comments.fetchAll();

  const stockList = ['GME', 'PLTR'];
  const wordsToIgnore = [
    'the',
    'a',
    'and',
    'this',
    'of',
    'are',
    'in',
    'it',
    'I',
    'so',
    'with',
    'but',
    'they',
    'can',
    'me',
    'you',
    'too',
    'to',
    'or',
    'was',
    'The',
    'that'
  ];

  var summary = [];
  var numComments = 0;
  for (var i = 0; i < comments.length; i++) {
    var currComment = comments[i];
    var iterator = function(currComment) {
      numComments++;
      for (var z = 0; z < stockList.length; z++) {
        if (currComment.body.includes(stockList[z])) {
          var words = currComment.body.split(' ');
          for (var u = 0; u < wordsToIgnore.length; u++) {
            words = words.filter(e => e !== wordsToIgnore[u]);
          }

          var wordCounter = {};
          for (var y = 0; y < words.length; y++) {
            if (wordCounter[words[y]]) {
              wordCounter[words[y]] += 1;
            } else {
              wordCounter[words[y]] = 1;
            }
          }

          var found = false;
          for (var k = 0; k < summary.length; k++) {
            if (summary[k].ticker === stockList[z]) {
              found = true;
              summary[k].count += 1;
              summary[k].ups += currComment.ups;

              for (var keys in wordCounter) {
                if (summary[k].wordCount[keys]) {
                  summary[k].wordCount[keys] += 1;
                } else {
                  summary[k].wordCount[keys] = 1;
                }
              }
              break;
            }
          }
          if (!found) {
            var obj = { ticker: stockList[z], count: 1, ups: currComment.ups, wordCount: wordCounter };
            summary.push(obj);
          }
        }
      }
      for (var j = 0; j < currComment.replies.length; j++) {
        iterator(currComment.replies[j]);
      }
    }
    iterator(currComment);
  }

  var wordList = [];
  for (var i = 0; i < summary.length; i++) {
    var summaryArr = [];
    for (var keys in summary[i].wordCount) {
      summaryArr.push({text: keys, value: summary[i].wordCount[keys]});
    }
    wordList.push(summaryArr);
  }
  return wordList;
};

export default scrapeSubreddit;

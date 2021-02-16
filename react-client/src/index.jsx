import React from 'react';
import ReactDOM from 'react-dom';

const snoowrap = require('snoowrap');
import WordCloud  from 'wordcloud';

async function scrapeSubreddit(key) {
  const r = new snoowrap({
    userAgent: 'dasp33',
    clientId: '5NclHjbLqNW15A',
    clientSecret: 'AdXLM09Bi3T_O_GutkARixh-wKK1CA',
    refreshToken: '807457195744-U7LoJFGI93PkZSZQ4cMkkQWM0uNXzA'
  });

  const comments = await r.getSubmission(key).comments.fetchAll();
  console.log(comments);

  const stockList = ['GME', 'PLTR'];

  var summary = [];
  var numComments = 0;

  for (var i = 0; i < comments.length; i++) {
    var currComment = comments[i];
    numComments++;
    var iterator = function(currComment) {
      numComments++;
      for (var z = 0; z < stockList.length; z++) {
        if (currComment.body.includes(stockList[z])) {
          var words = currComment.body.split(' ');
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

  console.log('number of comments: ', numComments);
  console.log('Summary: ', summary);

  var wordList = [];
  for (var keys in summary[0].wordCount) {
    wordList.push([keys, summary[0].wordCount[keys]]);
  }
  var list = [['foo', 12], ['bar', 6]];
  WordCloud(document.getElementById('wordcloud'), { list: list } );

};

/* Small thread (~150 comments):
** https://www.reddit.com/r/wallstreetbets/comments/ljqz3v/how_well_did_wsb_predict_the_market_3_months_ago/
*/
/* Large thread (~18,600 comments):
** https://www.reddit.com/r/wallstreetbets/comments/lkn19o/what_are_your_moves_tomorrow_february_16_2021/?sort=top
*/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threadURL: 'https://www.reddit.com/r/wallstreetbets/comments/ljqz3v/how_well_did_wsb_predict_the_market_3_months_ago/',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({threadURL: event.target.threadURL});
  }

  handleSubmit(event) {
    event.preventDefault();
    const threadKey = this.state.threadURL.split('/')[6];
    scrapeSubreddit(threadKey);
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Reddit Thread:
          <input type="text" value={this.state.threadURL} onChange={this.handleChange} />
        </label>
        <div></div>
        <input type="submit" value="Scrape" />
      </form>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

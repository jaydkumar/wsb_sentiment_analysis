import React from 'react';
import ReactDOM from 'react-dom';
import ReactWordcloud from 'react-wordcloud';
import WordCloud from './wordcloud.jsx';
import styled from 'styled-components';
import scrapeSubreddit from '../scrape.js';
import "regenerator-runtime/runtime";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threadURL: '',
      tickerWordCount: [
        [{text: 'GME', value: 5}],
        [{text: 'PLTR', value: 5}]
      ],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({threadURL: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const threadKey = this.state.threadURL.split('/')[6];
    var tickerWordCount = await scrapeSubreddit(threadKey);
    this.setState({tickerWordCount});
  }

  render () {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <label>
            r/wallstreetbets thread URL:
            <div></div>
            <input type="text" name="threadURL" value={this.state.threadURL} onChange={this.handleChange} style={{width: '750px'}}/>
          </label>
          <div></div>
          <input type="submit" value="Run" />
        </form>

        {
          this.state.tickerWordCount.map( (tickerWords) => <WordCloud tickerWords={tickerWords} /> )
        }
      </>
    );
  }
}

export default App;

import React from 'react';
import ReactWordcloud from 'react-wordcloud';

function wordcloud(props) {
  return <ReactWordcloud words={props.tickerWords} />
}

export default wordcloud;

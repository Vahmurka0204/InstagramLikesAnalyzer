import React from 'react';
import ReactDOM from 'react-dom';
import LikesAnalyzer from './LikesAnalyzer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LikesAnalyzer />, div);
  ReactDOM.unmountComponentAtNode(div);
});

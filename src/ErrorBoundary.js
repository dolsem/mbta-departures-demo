import React from 'react';

export default class ErrorBoundary extends React.Component {
  componentDidCatch(error) {
    alert(`${error.constructor.name}: ${error.message}`);
    throw error;
  }

  render() {
    return this.props.children;
  }
}
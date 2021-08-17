import React from "react";

export default class Catcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  // Update state so the next render will show the fallback UI.
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <div>{this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

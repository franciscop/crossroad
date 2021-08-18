import React from "react";

export default class Catcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = false;
  }

  componentDidCatch(error, errorInfo) {
    this.setState(error.message);
  }

  render() {
    if (this.state) {
      return <div>{this.state}</div>;
    }
    return this.props.children;
  }
}

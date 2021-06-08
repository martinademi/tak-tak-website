import React, { Component } from "react";
import Switch from "react-switch";

class Switchs extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
   
    this.props.onChange({
      target: {
        name: this.props.name,
        value: this.state.checked ? "Enabled" : "Disabled",
      },
    });
  }

  render() {
    return (
      <label>
        <Switch
          className="store-switch"
          onColor="#00cec5"
          onChange={this.handleChange}
          checked={this.state.checked}
        />
        <style jsx>{``}</style>
      </label>
    );
  }
}
export default Switchs;

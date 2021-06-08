class RadioButton extends React.Component {
  render() {
    return (
      <div className="radiobutton">
        <label className="radiobutton container">
          <span className="mb-1">{this.props.label}</span>
          <input {...this.props} />
          <span className="checkmark-radio"></span>
        </label>
        <style jsx>{`
          .radiobutton .container {
            display: block;
            position: relative;
            padding-left: 20px;
            margin-bottom: 12px;
            cursor: pointer;
            font-size: 0.8rem;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          /* Hide the browser's default radio button */
          .radiobutton .container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
          }

          /* Create a custom radio button */
          .radiobutton .checkmark-radio {
            position: absolute;
            top: 0;
            left: 0;
            height: 17px;
            width: 17px;
            background-color: #eee;
            border-radius: 50%;
          }

          /* On mouse-over, add a grey background color */
          .radiobutton .container:hover input ~ .checkmark-radio {
            background-color: #ccc;
          }

          /* When the radio button is checked, add a blue background */
          .container input:checked ~ .checkmark-radio {
            background-color: #00cec5 !important;
          }

          /* Create the indicator (the dot/circle - hidden when not checked) */
          .radiobutton .checkmark-radio:after {
            content: "";
            position: absolute;
            display: none;
          }

          /* Show the indicator (dot/circle) when checked */
          .radiobutton .container input:checked ~ .checkmark-radio:after {
            display: block;
          }

          /* Style the indicator (dot/circle) */
          .radiobutton .container .checkmark-radio:after {
            top: 5px;
            left: 5px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: white;
          }
        `}</style>
      </div>
    );
  }
}

export default RadioButton;

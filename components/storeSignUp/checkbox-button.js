class CheckBoxButton extends React.Component {
  render() {
    return (
      <div className="checkb mr-4">
        <label className="checkbox-block">
          <span className="checkbox-label">{this.props.label}</span>
          <input {...this.props} />
          <span className="checkmarkcss"></span>
        </label>
        <style jsx>{`
          .checkbox-label {
            text-decoration: none !important;
          }
          .checkbox-block {
            text-decoration: none !important;
            display: block;
            position: relative;
            padding-left: 30px;
            margin-bottom: 12px;
            cursor: pointer;
            font-size: 0.8rem;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          /* Hide the browser's default checkbox */
          .checkbox-block input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          /* Create a custom checkbox */
          .checkmarkcss {
            position: absolute;
            top: 0;
            left: 0;
            height: 20px;
            width: 20px;
            border-radius: 3px;
            background-color: #eee;
          }

          /* On mouse-over, add a grey background color */
          .checkbox-block:hover input ~ .checkmarkcss {
            background-color: #ccc;
          }

          /* When the checkbox is checked, add a blue background */
          .checkbox-block input:checked ~ .checkmarkcss {
            background-color: #00cec5;
          }

          /* Create the checkmarkcss/indicator (hidden when not checked) */
          .checkmarkcss:after {
            content: "";
            position: absolute;
            display: none;
          }

          /* Show the checkmarkcss when checked */
          .checkbox-block input:checked ~ .checkmarkcss:after {
            display: block;
          }

          /* Style the checkmarkcss/indicator */
          .checkbox-block .checkmarkcss:after {
            left: 8px;
            top: 5px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        `}</style>
      </div>
    );
  }
}

export default CheckBoxButton;

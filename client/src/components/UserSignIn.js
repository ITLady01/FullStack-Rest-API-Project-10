import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Consumer } from "../Context";

class UserSignIn extends Component {
  state = {
    emailAddress: "",
    password: "",
    errors: ""
  };

  render() {
    const { errors } = this.state;

    return (
      <Consumer>
        {({ signIn }) => (
          <div className="bounds">
            <div className="grid-33 centered signin">
              <h1>Sign In</h1>
              <div>
                {errors ? ( // shows errors when applicable
                  <div>
                    <h2 className="validation--errors--label">
                      Validation Error
                    </h2>
                    <div className="validation-errors">
                      <ul>
                        <li>{errors}</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <form
                  onSubmit={event =>
                    this.Submit(
                      event,
                      signIn,
                      this.state.emailAddress,
                      this.state.password
                    )
                  }
                >
                  <div>
                    <input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      className=""
                      placeholder="Email Address"
                      defaultValue=""
                      onChange={this.update}
                    />
                  </div>
                  <div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className=""
                      placeholder="Password"
                      defaultValue=""
                      onChange={this.update}
                    />
                  </div>
                  <div className="grid-100 pad-bottom">
                    <button className="button" type="handleSubmit">
                      Sign In
                    </button>
                    <Link className="button button-secondary" to="/courses">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
              <p>&nbsp;</p>
              <p>
                Don't have a user account?
                <Link to="/signup"> Click here </Link> to sign up!
              </p>
            </div>
          </div>
        )}
      </Consumer>
    );
  }

  // this onchange event will handle the input. Onchange events occurs when the value of element has been changed
  update = event => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;

    //to change a value in the state object. When a value in the state object changes, the component will re-render, meaning that the output will change according to the new value
    this.setState({
      [name]: value
    });
  };

  Submit = (event, signIn, emailAddress, password, err) => {
    if (event) {
      event.preventDefault();

      signIn(event, emailAddress, password, err);
      this.props.history.push("/");
    }
  };
}
export default withRouter(UserSignIn);

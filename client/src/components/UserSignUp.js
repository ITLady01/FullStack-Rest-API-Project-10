import React, { Component } from "react";
import axios from "axios";
import { Link, Router } from "react-router-dom";


import Context from "../Context";

class UserSignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    validatePassword: "",
    errors: ""
  };


  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      errors,
      signIn
    } = this.state;


    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            {errors ? (
              <div>
                <h2 className="validation--errors--label">Validation Error</h2>
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
              onSubmit={e =>
                this.SignUp(
                  e,
                  signIn,
                  firstName,
                  lastName,
                  emailAddress,
                  password
                )
              }
            >
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className=""
                  placeholder="First Name"
                  onChange={this.update}
                />
              </div>
              <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className=""
                  placeholder="Last Name"
                  onChange={this.update}
                />
              </div>
              <div>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  className=""
                  placeholder="Email Address"
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
                  onChange={this.update}
                />
              </div>
              <div>
                <input
                  id="validatePassword"
                  name="validatePassword"
                  type="password"
                  className=""
                  placeholder="Confirm Password"
                  onChange={this.update}
                />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="Submit">
                  Sign Up
                </button>
                <Link className="button button-secondary" to="/">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>
            Already have a user account? <Link to="/signIn"> Click here </Link>{" "}
            to sign in!
          </p>
        </div>
      </div>
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

  SignUp = (event, err, error, signIn) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      validatePassword
    } = this.state;
    if (password !== validatePassword) {
      // if passwords aren't confirmed send error messages
      this.setState({
        errors: "Opps. Passwords do not match"
      });
    } else {
      axios
        .post("http://localhost:5000/api/users", {
          firstName,
          lastName,
          emailAddress,
          password
        })
        .then(res => {
          if (res.status === 201) {
            //if response is okay,
            this.setState({
              errors: ""
            });
            this.context.signIn(null, emailAddress, password);
            this.props.history.push("/courses");
          }
        })

        .catch(err => {
          // catch errors
          if (err.response.status === 400) {
            // if the response status is bad request
            this.setState({
              // show error
              errors: err.response.data.message
            });
          } else if (err.response.status === 401) {
            // or if response status is unauthorized
            this.setState({
              //show error
              errors: err.response.data.message
            });
          } else {
            this.props.history.push("/error");
            console.log(err.response.status);
          }
        });
    }
  };
}
UserSignUp.contextType = Context; //importing from context 

export default Router(UserSignUp);

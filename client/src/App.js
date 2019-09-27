import React, { Component } from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import axios from "axios";
import "./styles/global.css";

//importing my components

import CourseDetail from "./components/CourseDetail";
import Courses from "./components/Courses";
import CreateCourse from "./components/CreateCourse";
import Error from "./components/Error";
import Header from "./components/Header";
import UpdateCourse from "./components/UpdateCourse";
import UserSignIn from "./components/UserSignIn";
import UserSignOut from "./components/UserSignOut";
import UserSignUp from "./components/UserSignUp";

import { Provider } from "./Context";
import PrivateRoute from "./PrivateRoute";

class App extends Component {
  state = {
    // first initalize state
    user: {},
    username: "",
    password: "",
    authenticated: false,
    errors: ""
  };

  render() {
    return (
      <BrowserRouter>
        <Provider
          value={{
            user: this.state.user,
            userId: this.state.user.id,
            emailAddress: this.state.emailAddress,
            password: this.state.password,
            authenticated: this.state.authenticated,
            signIn: this.handleSignIn.bind(this),
            signOut: this.signOut.bind(this),
            errors: this.errors
          }}
        >
          <div>
            <Header props={this.props} />
            <div className="bounds">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/courses" />}
                />

                <Route exact path="/courses" render={() => <Courses />} />
                <PrivateRoute
                  exact
                  path="/courses/:id/update"
                  component={UpdateCourse}
                />
                <PrivateRoute
                  exact
                  path="/courses/create"
                  component={CreateCourse}
                />
                <Route exact path="/courses/:id" component={CourseDetail} />

                <Route exact path="/signin" render={() => <UserSignIn />} />
                <Route exact path="/signup" render={() => <UserSignUp />} />
                <Route exact path="/signout" render={() => <UserSignOut />} />

                <Route exact path="/error" render={() => <Error />} />
              </Switch>
            </div>
          </div>
        </Provider>
      </BrowserRouter>
    );
  }

  // Signin authentication
  handleSignIn = (e, emailAddress, password, props, err) => {
    if (e) {
      e.preventDefault();
    }

    axios
      .get("http://localhost:5000/api/users", {
        auth: {
          username: emailAddress,
          password: password
        }
      })
      .then(res => {
        if (res.status === 200) {
          const user = res.data;
          this.setState({
            user: user,
            userId: user.id,
            authenticated: true,
            password: user.password,
            username: user.emailAddress
          });
          console.log("SignIn successful");
          console.log("user.id is " + user.id);
          console.log(user);

        
          localStorage.setItem("id", user.id);
          localStorage.setItem("user", user);
          localStorage.setItem("username", emailAddress);
          localStorage.setItem("password", password);
          localStorage.setItem("authenticated", true);
        }
      })
      .catch(err => {
        if (err.response.status === 400) {
          this.setState({
            errors: err.response.data.error.message
          });
        } else if (err.status === 401) {
          this.setState({
            errors: err.response.message
          });
        } else {
        }
      });
  };

  async signOut() {
    localStorage.clear();
    await this.setState({
      user: {},
      username: "",
      password: "",
      authenticated: false
    });
  }
}

export default App;

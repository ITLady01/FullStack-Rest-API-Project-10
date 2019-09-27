import React, { Component } from "react";
import axios from "axios";
import { Consumer } from "../Context";
import { Link, withRouter } from "react-router-dom";

class UpdateCourse extends Component {
  state = {
    id: "",
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    userId: "",
    errors: ""
  };

  // fetching courses using axios
  componentDidMount() {
    this.Courses();
  }

  Courses = () => {
    axios
      .get("http://localhost:5000/api/courses/" + this.props.match.params.id)
      .then(res => {
        const course = res.data;
        if (course.userId === parseInt(localStorage.getItem("id"))) {
          this.setState({
            id: course.id,
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded,
            userId: course.userId,
            errors: ""
          });
        }
      })
      .catch(err => {
        // uses try-catch method to catch errors
        if (err.status === 400) {
          // if error status is equal to bad request
          this.props.history.push("/error"); // direct to error page
        } else if (err.status === 500) {
          // or if error status equals the internal server error
          this.props.history.push("/error"); // direct to error page
        }
      });
  };


  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors
    } = this.state;


    return (
      <Consumer>
        {({ user, userId, emailAddress, password, }) => (
          <div className="bounds course--detail">
            <h1>Update Course</h1>
            <div>
              {errors ? (
                <div>
                  <h2 className="validation--errors--label">
                    Registration Error
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
                onSubmit={e =>
                  this.handleSubmit(
                    e,
                    user,
                    userId,
                    emailAddress,
                    password,
                    title,
                    description,
                    materialsNeeded,
                    estimatedTime
                  )
                }
              >
                <div className="grid-66">
                  <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <div>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className="input-title course--title--input"
                        placeholder="Course title..."
                        value={this.state.title}
                        onChange={this.change}
                      />
                    </div>
                    <p>
                      By {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div className="course--description">
                    <div>
                      <textarea
                        id="description"
                        name="description"
                        className=""
                        placeholder="Course description..."
                        value={this.state.description}
                        onChange={this.change}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <div>
                          <input
                            id="estimatedTime"
                            name="estimatedTime"
                            type="text"
                            className="course--time--input"
                            placeholder="Hours"
                            value={this.state.estimatedTime}
                            onChange={this.change}
                          />
                        </div>
                      </li>
                      <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <ul>
                          <div>
                            <textarea
                              id="materialsNeeded"
                              name="materialsNeeded"
                              className=""
                              placeholder="List materials..."
                              value={this.state.materialsNeeded}
                              onChange={this.change}
                            ></textarea>
                          </div>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid-100 pad-bottom">
                  <button className="button" type="handleSubmit">
                    Update Course
                  </button>
                  <button className="button button-secondary">
                    <Link to={"/courses/" + this.props.match.params.id}>
                      Cancel
                    </Link>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Consumer>
    );
  }

  // this onchange event will handle the input. Onchange events occurs when the value of element has been changed
  change = event => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;

    //to change a value in the state object. When a value in the state object changes, the component will re-render, meaning that the output will change according to the new value
    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    axios({
      method: "put",
      url: "http://localhost:5000/api/courses/" + this.props.match.params.id,
      auth: {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password")
      },

      data: {
        id: this.state.id,
        title: this.state.title,
        description: this.state.description,
        estimatedTime: this.state.estimatedTime,
        materialsNeeded: this.state.materialsNeeded,
        userId: this.state.userId
      }
    })
      .then(res => {
        //route to show the course details once authorized
        this.props.history.push("/courses/" + this.props.match.params.id);
      })

      .catch(err => {
        // uses try-catch method to catch errors
        if (err.response.status === 400) {
          // if error status is equal to bad request
          this.setState({
            // direct to error page
            errors: err.response.data.message
          });
        } else if (err.response.status === 401) {
          // or if error status equals the unauthorized status
          this.setState({
            // direct to error page
            errors: err.response.data.message
          });
        } else {
          this.props.history.push("/error");
        }
      });
  };
  
}
export default withRouter(UpdateCourse);

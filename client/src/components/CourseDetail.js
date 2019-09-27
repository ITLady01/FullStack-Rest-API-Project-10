import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Consumer } from "../Context";
import axios from "axios";

class CourseDetail extends Component {
  state = {
    course: {},
    username: ""
  };


  componentDidMount() {
    this.CoursesDetail();
  }

  CoursesDetail = () => {
    axios
      .get("http://localhost:5000/api/courses/" + this.props.match.params.id)
      .then(res => {
        const course = res.data;
        this.setState({
          course,
          username: course.User.firstName + " " + course.User.lastName
        });
      })

      .catch(err => {
        if (err.response.status === 400) {
          this.props.history.push("/error");
        } else if (err.response.status === 500) {
          this.props.history.push("/error");
        }
      });
  };

  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded
    } = this.state.course;

    return (
      <Consumer>
        {({ user, userId, authenticated, emailAddress, password, signIn }) => (
          <div id="root">
            <div className="actions--bar">
              <div className="bounds">
                <div className="grid-100">
                  {authenticated && userId === this.state.course.userId ? ( // only allow auh users to access buttons
                    <span>
                      <Link
                        className="button"
                        to={"/courses/" + this.state.course.id + "/update/"}
                      >
                        Update Course
                      </Link>
                      <button
                        className="button"
                        onClick={e => this.Delete(e)}
                      >
                        Delete Course
                      </button>
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <Link className="button button-secondary" to="/courses">
                    Return to List
                  </Link>
                </div>
              </div>
            </div>
            <div className="bounds course--detail">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course-label">Course</h4>
                  <h3 className="course--title">{title}</h3>
                  <p>By {this.state.username} </p>
                </div>
                <div className="course--description">
                  <ReactMarkdown source={description} />
                </div>
              </div>

              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{estimatedTime}</h3>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        <ReactMarkdown source={materialsNeeded} />
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Consumer>
    );
  }

  Delete = e => {   //delete function
    e.preventDefault();
    axios
      .delete(
        "http://localhost:5000/api/courses/" + this.props.match.params.id,
        {
          auth: {   // validating the user and password for authentication
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password")
          }
        }
      )
      .then(res => {
        this.props.history.push("/courses");
        console.log("Course deleted.");
      })
      .catch(err => {
        // using catch to errors
        if (err.response.status === 404 || 500) {
          // if error response status is not found or internal error server
          this.props.history.push("/error"); // send to error page
        }
      });
  };

  
}

export default withRouter(CourseDetail);

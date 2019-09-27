import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class Courses extends Component {
   // STATE Courses Component
  state = {
    isLoading: true,
    courses: []
  };

// FETCH courses from REST API when Courses Component mounted and setState
  componentDidMount() {
    axios
    // GET request to the REST API URL
      .get(`http://localhost:5000/api/courses`)
      .then(res => {
        const courses = res.data;
        this.setState({
          courses
        });
      })

      .catch(err => {
        // using catch to get the errors
        if (err.response.status === 500) {
          // if error response is internal server error
          this.props.history.push("/error"); // send to error page
          console.log(err.response, err);
        }
      });
  }
  render() {

    
    return (
      <div id="root">
        <div>
          <div className="bounds">
            {/*mapping through courses, returns courses ID*/}
            {this.state.courses.map(course => (
              <div key={course.id} className="grid-33">
                <Link
                  className="course--module course--link"
                  to={"/courses/" + course.id}
                >
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{course.title}</h3>
                </Link>
              </div>
            ))}
            <div className="grid-33">
              <Link
                className="course--module course--add--module"
                to={"/courses/create"}
              >
                <h3 className="course--add--title">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 13 13"
                    className="add"
                  >
                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                  </svg>
                  New Course
                </h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}//end Courses

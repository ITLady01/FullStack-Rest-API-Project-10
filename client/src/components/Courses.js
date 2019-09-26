import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CourseID from './CourseID';

export default class Courses extends Component {

  // STATE Courses Component
  state = {
    courses: []
  }

  // FETCH courses from REST API when Courses Component mounted and setState
  async componentDidMount() {
    // GET request to the REST API
    const res = await this.props.context.data.api("/courses", "GET");
    if (res.status === 200) {
      return res.json().then(courses => this.setState({courses: courses}));
    }else if (res.status === 500) {
      window.location.href = '/error';
    }else {
      throw new Error();
    }
  }
  render() {
    return (
      <div className="bounds">
        {/*mapping through courses, returns courses ID*/}
        {this.state.courses.map(course => <CourseID title={course.title} key={course.id} id={course.id} />)}

        {/*the following is a card that creates a new course (maybe deseves it's own component ?)*/}
        <div className="grid-33">
          <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course
            </h3>
          </Link>
        </div>

      </div>
    );
  }


} // end Courses
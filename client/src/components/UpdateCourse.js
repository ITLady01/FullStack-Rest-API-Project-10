import React, { Component } from 'react';
import config from "../config";


export default class UpdateCourse extends Component {

  // inital state of the UpdateCourse Component
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: '',
    user:{},
    errors: [],
      }

  // // change func to handle form inputs
  update = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  // GET request to the REST API for the single course when component mounted
  async componentDidMount() {
    // GET request
    const res = await this.props.context.data.api(`/courses/${this.props.match.params.id}`, 'GET');
    if (res.status === 200) {
      return res.json().then(course => this.setState({
        // setState course details of the fetched course
        title: course.title,
        description: course.description,
        estimatedTime: course.estimatedTime,
        materialsNeeded: course.materialsNeeded,
        userId: course.userId,
        user: course.user,
      }));
    }else if (res.status === 404) { // not found
      window.location.href = '/notfound';
    }else if (res.status === 500) { // server error
      window.location.href = '/error';
    }else {
      throw new Error();
    }
  }

  // checks if authenticated user is the course owner,
  // if not redirect to '/forbidden'
  componentDidUpdate() {
    // context from props
    const { context } = this.props;
    // authenticated user from context
    const authUser = context.authenticatedUser;
    // course id from state
    const courseUserId = this.state.userId;
    // if the authenticated user is NOT the course owner
    if(authUser.id !== courseUserId) {
      window.location.href = '/forbidden';
    }
  }


  // FUNC that handles a PUT request to the REST API to update the course
  handleUpdate = async (e) => {
    e.preventDefault();
    // context from props
    const { context } = this.props;
    // authenticated user from context
    const authUser = context.authenticatedUser;
    // authenticated user credentials
    const authUserId = authUser.id;
    const emailAddress = authUser.emailAddress;
    const password = authUser.password;
    // data to be sent
    const data = this.state;
    // append authenticated user id to data
    data.userId = authUserId;

    // PUT request
    const res = await context.data.api(`/courses/${this.props.match.params.id}`, 'PUT', data, true, { emailAddress, password } );
    if (res.status === 204) { // updated
    
      this.setState({errors: []});
      window.location.href = `/courses/${this.props.match.params.id}`;
    }else if (res.status === 400) { // bad request
      return res.json().then(data => {
        this.setState({errors: data.errors});
      });
    }
    // else if (res.status === 401) { // access denied
    //   return null; // show message or something
    // }
    else if (res.status === 500) {
      window.location.href = '/error';
    }else {
      throw new Error();
    }
  }



  render() {

    return(
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
        {/* ternary operator -> validation errors ? show them : show nothing */}
        {
          this.state.errors.length ?
          <div>
            <h2 className="validation--errors--label">Validation errors</h2>
            <div className="validation-errors">
              <ul>
                {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
              </ul>
            </div>
          </div> : null
        }
          <form onSubmit={this.handleUpdate}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div><input id="title" name="title" type="text" onChange={this.update} value={this.state.title}  className="input-title course--title--input" placeholder="Course title..."/></div>
                <p>By {this.state.user.firstName} {this.state.user.lastName} </p>
              </div>
              <div className="course--description">
                <div>
                  <textarea id="description" name="description" onChange={this.update} value={this.state.description} className="" placeholder="Course description..." ></textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" onChange={this.update} value={this.state.estimatedTime} className="course--time--input"
                        placeholder="Hours"  /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                     <textarea id="materialsNeeded" name="materialsNeeded" onChange={this.update} value={this.state.materialsNeeded} className="" placeholder="List materials..." ></textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">Update Course</button>
              <button className="button button-secondary" onClick={(e) => {e.preventDefault(); window.location.href=`/courses/${this.props.match.params.id}`;}}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

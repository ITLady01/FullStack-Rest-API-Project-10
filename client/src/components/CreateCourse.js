import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Consumer } from '../Context';



export default class CreateCourse extends Component {

    state = {
        id: "",
        title: "",
        description: "",
        estimatedTime: "",
        materialsNeeded: "",
        errors: ""
    };


    render() {
        const { title, description, estimatedTime, materialsNeeded, errors } = this.state;
        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    <Consumer>{({ user, emailAddress, password, authenticated }) => (
                        <div>
                            {errors ? (           // shows validation errors when applicable
                                <div>
                                    <h2 className="validation--errors--label">Validation Error</h2>
                                    <div className="validation-errors">
                                        <ul>
                                            <li>{errors}</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : ''}
                            <form onSubmit={e => this.Submit(e, user, emailAddress, password, title, description, materialsNeeded, estimatedTime, authenticated)}>
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
                                                onChange={this.update} />
                                        </div>
                                        <p>By {user.firstName} {user.lastName}</p>
                                    </div>
                                    <div className="course--description">
                                        <div>
                                            <textarea
                                                id="description"
                                                name="description"
                                                className=""
                                                placeholder="Course description..."
                                                onChange={this.update}>
                                            </textarea>
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
                                                        onChange={this.update} />
                                                </div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div>
                                                    <textarea
                                                        id="materialsNeeded"
                                                        name="materialsNeeded"
                                                        className=""
                                                        placeholder="List materials..."
                                                        onChange={this.update}>
                                                    </textarea>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="grid-100 pad-bottom">
                                    <button className="button" type="Submit">Create Course</button>
                                    <Link className="button button-secondary" to={"/courses"}>Cancel</Link>
                                </div>
                            </form>
                        </div>
                    )}</Consumer>
                </div>
            </div>
        );
    }

    update = (e) => {
        e.preventDefault();
        const input = e.target;
        this.setState({
            [input.name]: input.value
        });
    };


    Submit = (e, error) => {
        e.preventDefault();
        
        axios("http://localhost:5000/api/courses", { // I am using axios to fetch courses
            method: "POST",
            auth: { // authorizing username and password
            //reference info found on https://stackoverflow.com/questions/11246947/can-localstorage-be-modified-by-a-client
                username: localStorage.getItem("username"),
                password: localStorage.getItem("password")
            },

            data: {
                title: this.state.title,
                description: this.state.description,
                estimatedTime: this.state.estimatedTime,
                materialsNeeded: this.state.materialsNeeded,
                userId: localStorage.getItem("id")
            }
        })

            .then(res => {
                this.props.history.push("/courses");
                console.log("course successfully created");

            }).catch(err => {       // using the try/catch method to catch the errors
                if (err.response.status === 400) {      // if the response status is bad request
                    this.setState({     // show error messages
                        errors: err.response.data.message
                    })
                } else if (err.response.status === 401) { // or if response status is unauthorized 
                    this.setState({     // show error messages
                        errors: err.response.data.message
                    })

                } else {        // or route to the error page
                    this.props.history.push("/error");
                }
            });
    }

    
}


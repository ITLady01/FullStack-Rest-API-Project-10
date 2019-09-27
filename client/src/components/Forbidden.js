import React from 'react';

const Forbidden = () => {
    return (<div className="bounds" >
        <h1> Forbidden </h1>
        <p> You are not authorized to view this page! </p>
        <button className="button button-primary btn-not-found"
            onClick={
                (e) => {
                    e.preventDefault();
                    window.location.href = '/';
                }
            }>Return to previous page</button>
    </div>
    );
}
export default Forbidden;

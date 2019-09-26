import React from 'react';

const NotFound = () => {
  return(
    <div className="bounds">
      <h1>Not Found</h1>
      <p>Sorry! We couldn't find the page you're looking for.</p>
      <button className="button button-primary btn-not-found" onClick={(e) => {e.preventDefault(); window.location.href='/';}}>Back</button>      
    </div>
  );
}

export default NotFound;
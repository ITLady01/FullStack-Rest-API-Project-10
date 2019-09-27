import React from 'react';

/* exports a function that renders any validation errors sent from the API via the <ErrorsShown> function component */
export default (props) => {
    const {
        cancel,
        errors,
        submit,
        submitButtonText,
        elements,
    } = props;

    /* renders submit button of a form and handles functionality */
    function Submit(event) {
        event.preventDefault();
        submit();
    }

    /* renders cancel button of a form and handles functionality */
    function Cancel(event) {
        event.preventDefault();
        cancel();
    }

    return (
        <div>
            <ErrorsShown errors={errors} />
            <form onSubmit={Submit}>
                {elements()}
                <div className='pad-bottom'>
                    <button className='button' type='submit'>{submitButtonText}</button>
                    <button className='button button-secondary' onClick={Cancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

function ErrorsShown({ errors }) {
    let errorsShown = null;

    if (errors.length) {
        errorsShown = (
            <div>
                <h2 className='validation--errors--label'>Validation errors</h2>
                <div className='validation-errors'>
                    <ul>
                        {errors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            </div>
        );
    }

    return errorsShown;
}
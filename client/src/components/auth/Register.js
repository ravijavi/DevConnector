import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

//Using axios to access backend with the below, commented out code
//import axios from 'axios';

//can destructure props. Instead of Register = props, can do Register = ({ setAlert })
const Register = ({ setAlert }) => {
  //will connect this method to redux
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData; //destructuring data

  const onChange = async e =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); //by using e.target.name, we can use this key to format every field

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passowrds do not match', 'danger'); //will generate id in alert.js, "danger" is the alert type
    } else {
      console.log('SUCCESS');

      //I plan to implement this with a redux action, this is a successful attempt to register with React and Node.js working in tandem, result checked out in MongoDB Atlas with the creation of a new user
      /*
      const newUser = {
        name,
        email,
        password
      };

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const body = JSON.stringify(newUser);

        // first parameter is the route, second is the data, third is config, which has the header value/content-type
        const res = await axios.post('/api/users', body, config); //need to do this b/c axios returns a promise
        console.log(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
      */
    }
  };
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
            minLength='6'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={e => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Register);
//setAlert portions will allow us to access props.setAlert

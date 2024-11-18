import React, { useState } from 'react';
import UserService from '../../Services/UserServices';
import MedicalInfoService from '../../Services/MedicalInfoService';
import { useNavigate } from 'react-router-dom';
import { RiUserFill, RiMailFill, RiLockPasswordFill, RiPhoneFill, RiHealthBookFill, RiFirstAidKitFill, RiAlertFill } from "react-icons/ri";
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [emergencyNotes, setEmergencyNotes] = useState('');
  const [errors, setErrors] = useState([]); // Array to store validation errors
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !phone || !password || !bloodType || !allergies || !medicalConditions || !emergencyNotes) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const userResponse = await UserService.create({
        user_username: username,
        user_pass: password,
        user_email: email,
        user_phone: phone,
      });

      if (userResponse.status === 201) {
        const userId = userResponse.data.user.user_id;

        const medicalInfoResponse = await MedicalInfoService.create({
          user_id: userId,
          blood_type: bloodType,
          allergies: allergies,
          medical_conditions: medicalConditions,
          emergency_notes: emergencyNotes,
        });

        if (medicalInfoResponse.status === 201) {
          alert('Registration successful!');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Registration error', error);

      if (error.response && error.response.status === 400 && error.response.data.errors) {
        // Server returned validation errors
        setErrors(error.response.data.errors);
      } else {
        alert('An error occurred during registration. Please try again.');
      }
    }
  };

  return (
    <div className="container register-container mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <p className="text-center">Create a new account</p>

      {/* Display server validation errors */}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Username */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiUserFill /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiMailFill /></span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiPhoneFill /></span>
            <input
              type="tel"
              className="form-control"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiLockPasswordFill /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Medical Information Fields */}
          <h5 className="text-center mt-4">Medical Information</h5>

          {/* Blood Type */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiHealthBookFill /></span>
            <select
              className="form-control"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
            >
              <option value="" disabled>Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>


          {/* Allergies */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiFirstAidKitFill /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          {/* Medical Conditions */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiAlertFill /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Medical Conditions"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
            />
          </div>

          {/* Emergency Notes */}
          <div className="input-group mb-3">
            <span className="input-group-text"><RiAlertFill /></span>
            <textarea
              className="form-control"
              placeholder="Emergency Notes"
              value={emergencyNotes}
              onChange={(e) => setEmergencyNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary" onClick={handleRegister}>Register</button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

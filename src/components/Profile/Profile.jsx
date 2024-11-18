import React, { useState, useEffect } from 'react';
import UserService from '../../Services/UserServices';
import MedicalInfoService from '../../Services/MedicalInfoService';
import { Alert, Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [medicalInfo, setMedicalInfo] = useState({
        blood_type: '',
        allergies: '',
        medical_conditions: '',
        emergency_notes: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserData({
                id: storedUser.user_id,
                name: storedUser.user_username,
                email: storedUser.user_email,
                phone: storedUser.user_phone || '',
                password: '',
            });

            const fetchMedicalInfo = async () => {
                try {
                    const response = await MedicalInfoService.get(storedUser.user_id);
                    if (response.status === 200) {
                        setMedicalInfo(response.data.info);
                    }
                } catch (error) {
                    console.error("Error fetching medical info:", error);
                }
            };

            fetchMedicalInfo();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleMedicalChange = (e) => {
        const { name, value } = e.target;
        setMedicalInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await UserService.update(userData.id, {
                user_username: userData.name,
                user_email: userData.email,
                user_phone: userData.phone,
                user_pass: userData.password,
            });

            const medicalResponse = await MedicalInfoService.update(userData.id, {
                blood_type: medicalInfo.blood_type,
                allergies: medicalInfo.allergies,
                medical_conditions: medicalInfo.medical_conditions,
                emergency_notes: medicalInfo.emergency_notes,
            });

            if (response.status === 200 && medicalResponse.status === 200) {
                setMessage('Profile and medical information updated successfully!');
                const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Failed to update profile. Please try again.');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">Update Profile</h2>
                            {message && <Alert variant="info">{message}</Alert>}
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ID (Read-Only)</Form.Label>
                                    <Form.Control type="text" value={userData.id} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <h3 className="mt-4">Medical Information</h3>

                                <Form.Group className="mb-3">
                                    <Form.Label>Blood Type</Form.Label>
                                    <Form.Select
                                        name="blood_type"
                                        value={medicalInfo.blood_type}
                                        onChange={handleMedicalChange}
                                        required
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
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Allergies</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="allergies"
                                        value={medicalInfo.allergies}
                                        onChange={handleMedicalChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Medical Conditions</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="medical_conditions"
                                        value={medicalInfo.medical_conditions}
                                        onChange={handleMedicalChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Emergency Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows="3"
                                        name="emergency_notes"
                                        value={medicalInfo.emergency_notes}
                                        onChange={handleMedicalChange}
                                        placeholder="Enter any important emergency information"
                                    />
                                </Form.Group>

                                <div className="text-center">
                                    <Button type="submit" variant="primary" size="lg">Update Profile</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;

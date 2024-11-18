import React, { useEffect, useState, useCallback } from 'react';
import { RiAddCircleFill, RiEdit2Fill } from 'react-icons/ri';
import EmergencyContactsService from '../../Services/EmergencyContactsService';
import { Modal, Button, Card, Alert, Form, Container, Row, Col } from 'react-bootstrap';
import './EmergencyContacts.css';

const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [contact_name, setName] = useState('');
    const [contact_phone, setPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [contactToUpdate, setContactToUpdate] = useState(null);

    const [updateName, setUpdateName] = useState('');
    const [updatePhone, setUpdatePhone] = useState('');
    const [updateRelationship, setUpdateRelationship] = useState('');

    const userId = JSON.parse(localStorage.getItem('user')).user_id;

    const fetchContacts = useCallback(async () => {
        try {
            const response = await EmergencyContactsService.get(userId);
            setContacts(response.data.contacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleAddContact = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        if (!contact_name || !contact_phone || !relationship) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        try {
            await EmergencyContactsService.create({
                userId,
                contact_name,
                contact_phone,
                relationship,
            });
            fetchContacts();
            setSuccessMessage("Contact added successfully!");
            setName('');
            setPhone('');
            setRelationship('');
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Error adding contact');
            console.error('Error adding contact:', error);
        }
    };

    const openDeleteModal = (contactId) => {
        setContactToDelete(contactId);
        setShowModal(true);
    };

    const handleDeleteContact = async () => {
        try {
            await EmergencyContactsService.remove(contactToDelete);
            fetchContacts();
            setSuccessMessage("Contact deleted successfully!");
        } catch (error) {
            setErrorMessage('Error deleting contact');
            console.error('Error deleting contact:', error);
        }
        setShowModal(false);
    };

    const openUpdateModal = (contact) => {
        setContactToUpdate(contact);
        setUpdateName(contact.contact_name);
        setUpdatePhone(contact.contact_phone);
        setUpdateRelationship(contact.relationship);
        setShowUpdateModal(true);
    };

    const handleUpdateContact = async () => {
        if (!updateName || !updatePhone || !updateRelationship) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        try {
            await EmergencyContactsService.update(contactToUpdate.contact_id, {
                name: updateName,
                phone: updatePhone,
                relationship: updateRelationship,
            });
            fetchContacts();
            setShowUpdateModal(false);
            setSuccessMessage("Contact updated successfully!");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Error updating contact');
            console.error('Error updating contact:', error);
        }
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Emergency Contacts</h2>
            
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            
            <Card className="p-4 mb-4 shadow-sm">
                <h5>Add New Contact</h5>
                <Row className="g-2">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            value={contact_name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="tel"
                            placeholder="Phone Number"
                            value={contact_phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Relationship"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        />
                    </Col>
                </Row>
                <Button variant="primary" className="mt-3 custom-button" onClick={handleAddContact}>
                    <RiAddCircleFill /> Add Contact
                </Button>
            </Card>

            <Row>
                {contacts.length === 0 ? (
                    <p className="text-center">No emergency contacts found.</p>
                ) : (
                    contacts.map((contact) => (
                        <Col md={4} key={contact.contact_id} className="mb-4">
                            <Card className="h-100 shadow-sm contact-card">
                                <Card.Body>
                                    <Card.Title><strong>Name:</strong> {contact.contact_name}</Card.Title>
                                    <Card.Text><strong>Phone:</strong> {contact.contact_phone}</Card.Text>
                                    <Card.Text><strong>Relationship:</strong> {contact.relationship}</Card.Text>
                                    <Button
                                        variant="custom-update"
                                        className="update-button custom-button me-2"
                                        onClick={() => openUpdateModal(contact)}
                                    >
                                        <RiEdit2Fill /> Update
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="custom-button"
                                        onClick={() => openDeleteModal(contact.contact_id)}
                                    >
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this contact?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteContact}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={updateName}
                                onChange={(e) => setUpdateName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                value={updatePhone}
                                onChange={(e) => setUpdatePhone(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Relationship</Form.Label>
                            <Form.Control
                                type="text"
                                value={updateRelationship}
                                onChange={(e) => setUpdateRelationship(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateContact}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EmergencyContacts;

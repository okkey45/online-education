import React, { useState, useCallback, useContext, useEffect } from 'react';


import { Form, Button } from 'react-bootstrap';
export const AnswersStudent = () => {
  
            return (
                <div>
                    <Form className="form__createTraining mb-3">
                        <Form.Group controlId="pleForm.ControlTextarea1" className="mb-3">
                            <Form.Label>Ответ:</Form.Label>
                            <Form.Control as="textarea" rows="3" style={{height: '150px'}}/>
                        </Form.Group>
                        <Button
                        className="ml-3"
                        type="submit"
                        >
                            Отправить
                        </Button>
                    </Form>
                </div>
        
            );
}
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';

import { Form, Button } from 'react-bootstrap';
export const AnswerStudent = () => {
    const { request, loading } = useHttp();
    const { token }  = useContext(AuthContext);
    const [form, setForm] = useState({
        subject_id: '',
        stud_response: '',
        creation_date: Date.now(),
        //author_id: req.user.userId,
    });
    
    const changeHandler = (event) => {
       setForm({ ...form, [event.target.name]: event.target.value });
    };
    
    const sendAnswer = async (event) => {
		try {
			const data = await request(
				'/api/answer/create',
				'POST',
                { ...form },
            );      
		} catch (e) {}
    };
       return (
                <div>
                    <Form className="form__createTraining mb-3">
                        <Form.Group controlId="pleForm.ControlTextarea1" className="mb-3">
                            <Form.Label>Ответ:</Form.Label>
                            <Form.Control
                             as="textarea"
                             rows="3" 
                             className="textarea-answer"
                             name="stud_response"
                             value={form.stud_response}
                             onChange={changeHandler}
                       
                             />
                        </Form.Group>
                        <Button
                        type="submit"
                        onClick={sendAnswer}
                        disabled={loading}
                        >
                            Отправить
                        </Button>
                    </Form>
                </div>
        
            );
}
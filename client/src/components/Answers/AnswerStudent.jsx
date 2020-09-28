import React, { useState, useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { useParams } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';
export const AnswerStudent = () => {
    const subjectId = useParams().id;
    const { request, loading } = useHttp();
    const { token }  = useContext(AuthContext);
    const [ answers, setAnswers ]  = useState();
    const [ answer, setAnswer ]  = useState();
    const [form, setForm] = useState({
        subject_id: subjectId,
        stud_response: '',
        creation_date: Date.now(),
    });
    const { userRoles }  = useContext(AuthContext);

	const userRol = userRoles.filter(rol => rol === 'student')

    const changeHandler = (event) => {
       setForm({ ...form, [event.target.name]: event.target.value });
    };
    
    const sendAnswer = async (event) => {
		try {
			const data = await request(
				'/api/answers/create',
				'POST',
                { ...form },
                { Authorization: `Bearer ${token}` },
            );
            setAnswers(data);    
		} catch (e) {}
    };

    const getAnswer = useCallback(async () => {
		try {
			const data = await request('/api/answers/${subjectId}', 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
            setAnswer(data);
            console.log(data);
		} catch (e) {}
    }, [token, request]);
    
    useEffect(() => {
		getAnswer();
    }, [getAnswer, subjectId]);
    
       return ( 
                <>
                { !answers && (String(userRol) === 'student') && 
                    <div>
                        <Form className="form__createTraining mb-3">
                            <Form.Group controlId="pleForm.ControlTextarea1" className="mb-3">
                                <Form.Label>Ответ студента:</Form.Label>
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
                }
                {
                   answers && 
                   
                    <div>
                        <p>Ответ:</p>
                        <p className="mt-3">{answers.answer.stud_response}</p>
                    </div>   
                }
                </>
            );
           
}
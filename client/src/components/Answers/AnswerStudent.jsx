import React, { useState, useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { useParams } from 'react-router-dom';

import { Form, Button, Col } from 'react-bootstrap';
export const AnswerStudent = () => {
    const subjectId = useParams().id;
    const { request, loading } = useHttp();
    const { token }  = useContext(AuthContext);
    const [ answerTeacher, setAnswerTeacher ]  = useState([]);
    const [ answerStud, setAnswerStud ]  = useState([]);
    const [form, setForm] = useState({
        subject_id: subjectId,
        stud_response: '',
        creation_date: Date.now(),
    });
    const [formTeach, setFormTeach] = useState({
        prof_response: '',
        score: '',
        date_of_change: Date.now(),
    });
    const { userRoles }  = useContext(AuthContext);

    const userRolStudent = userRoles.filter(rol => rol === 'student')
    const userRolTeacher = userRoles.filter(rol => rol === 'teacher')

    const changeHandler = (event) => {
       setForm({ ...form, [event.target.name]: event.target.value });
    };
    const changeHandlerTeach = (event) => {
        setFormTeach({ ...formTeach, [event.target.name]: event.target.value });
     };
    const sendAnswer = async (event) => {
		try {
			const data = await request(
				'/api/answers/create',
				'POST',
                { ...form },
                { Authorization: `Bearer ${token}` },
            );
            setAnswerStud(data);  
		} catch (e) {}
    };
    const sendAnswerTeacher = async (event) => {
		try {
			const data = await request(
				`/api/answers/create`,
				'POST',
                { ...formTeach },
                { Authorization: `Bearer ${token}` },
            );
            setAnswerTeacher(data);
            console.log(data);  
console.log(data);
		} catch (e) {}
    };
    const getAnswers = useCallback(async () => {
		try {
        const data = await request(`/api/answers/${subjectId}`, 'GET', null, {
				Authorization: `Bearer ${token}`,
            });
            setAnswerStud(data);
            console.log(data);
		} catch (e) {}
    }, [token, request, subjectId]);
    
    useEffect(() => {
		getAnswers();
    }, [getAnswers, subjectId]);

       return ( 
                <>
                { (String(userRolStudent) === 'student') && 
                    <div>
                        {
                        answerStud.length <= 0 &&
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
                        }
                        {   
                            answerStud.length > 0 &&        
                            answerStud.map((an, i) => {
                            return (
                                <div key={i}>
                                    <p>Ответ:</p>
                                    <p className="mt-3">{an.stud_response}</p>
                                </div>  
                                )
                            })  
                        }
                    </div>
                }
                {
                  (String(userRolTeacher) === 'teacher') && 
                  <div>
                      {
                          answerStud.length > 0 &&        
                          answerStud.map((an, i) => {
        
                          return (
                              <div key={i}>
                                  <p>Ответ студента:</p>
                                  <p className="mt-3">{an.stud_response}</p>
                              </div> 
                              )
                          })
                      }
                      {                         
                    <Form className="form__createTraining mb-3">
                         <Form.Group controlId="pleForm.ControlTextarea1" className="mb-3">
                             <Form.Label>Комментарий учителя:</Form.Label>
                             <Form.Control
                             as="textarea"
                             rows="3" 
                             className="textarea-answer"
                             name="prof_response"
                             value={formTeach.prof_response}
                             onChange={changeHandlerTeach}
                             />
                         </Form.Group>
                         <Button
                         type="submit"
                         onClick={sendAnswerTeacher}
                         disabled={loading}
                         >
                             Отправить
                         </Button>
                     </Form>                    
                      }
                  </div>
                }  
                </>
            );
           
}
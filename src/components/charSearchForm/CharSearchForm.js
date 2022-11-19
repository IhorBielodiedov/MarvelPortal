import {Formik, Form, Field, ErrorMessage, useField} from 'formik';
import * as Yup from 'yup';

const CharSearchForm = () => {
    return (
        <div className="char__search-form">
            <Formik 
            initialValues= {{
                char: ''
            }}
            validationSchema= {Yup.object({
                char: Yup.string().min(2, "Minimum 2 symbols").required("Field is required")})}
            >
                <label className="char__search-label" htmlFor="char">Or find a character by name:</label>
                <div className="char__search-wrapper">
                    <Form>
                        <Field type="char" name="char"/>
                        <ErrorMessage component="div" className="error" name="char"/>
                        <button type="submit">Отправить</button>
                    </Form>
                </div>
            </Formik>
        </div>
    )
}

export default CharSearchForm;
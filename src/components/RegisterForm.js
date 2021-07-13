import {useState, useRef} from 'react';
import db from '../firebase/db';
import InputFieldSet from './InputFieldSet';




const RegistrationForm= () => {
    const [formWasValidated, setFormWasValidated] = useState(false);
    const [checked, setChecked] = useState(false);

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        role: ''

    });

    const [fieldValues, setFieldValues] = useState({
        fullName: '',
        email: '',
        role: ''

    });

    const references = {
        fullName: useRef(),
        email: useRef(),
        role: useRef()
    };

    const categoryOptions = [
        {
          value: "",
          text: "Válassz!"
        },
        {
          value: "admin"
        },
        {
          value: "vendég"
        },
        {
          value: "regisztrált felhasználó"
        }
      ];

    const validators = {
        admin: {
            required: isNotEmpty
         },
        email: {
            required: isNotEmpty,
            validEmail: isValidEmail
        },
        role: {
            requiredSelet: isSelectNotEmpty
        }

    }

  
    function isNotEmpty(value) {
        return value !== '';
    }

    function isSelectNotEmpty(value) {
      return value !== '';
  }

  function isValidEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
 }

 

    const errorTypes = {
        required: "Kitöltése kötelező",
        requiredSelet: "Választani kötelező",
        validEmail: "Nem megfelelő email cím formátum"
        
    };


    function handleInputBlur(e) {
        const name = e.target.name;
        validateField(name);
    }

    const handleClick = () => setChecked(!checked)

    function handleInputChange(e) {
        const value = e.target.value;
        const fieldName = e.target.name;
        setFieldValues({
            ...fieldValues,
            [fieldName]: value
        });
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
    }

   

    
    const [formAlertText, setFormAlertText] = useState('');
    const [formAlertType, setFormAlertType] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const isValid = isFormValid();

        if (isValid) {
            db.collection('qualification-exam').add({
              ...fieldValues,
              'isActive': checked
          })
              .then((docRef) => {
                setFormAlertText(`sikeres mentés`);
                setFormAlertType('success');
                setChecked(false);
                setFieldValues({
                    fullName: '',
                    email: '',
                    role: ''
                });              
            });
        }
    }

    function validateField(fieldName) {
        const value = fieldValues[fieldName];
        let isValid = true;
        setErrors((previousErrors) => ({
            ...previousErrors,
            [fieldName]: ''
        }));
        references[fieldName].current.setCustomValidity('');

        if (validators[fieldName] !== undefined) {
            for (const [validationType, validatorFn] of Object.entries(validators[fieldName])) {
                if (isValid) {
                    isValid = validatorFn(value);
                    if (!isValid) {
                        const errorText = errorTypes[validationType];
                        setErrors((previousErrors) => {
                            return ({
                                ...previousErrors,
                                [fieldName]: errorText
                            })
                        });
                        references[fieldName].current.setCustomValidity(errorText);
                    }
                }
            }
        }
        return isValid;
    }

    
    function isFormValid() {
        let isFormValid = true;
        for (const fieldName of Object.keys(fieldValues)) {
            const isFieldValid = validateField(fieldName);
            if (!isFieldValid) {
                isFormValid = false;
            }
        }
        return isFormValid;
    }

    

    return ( 
        <main>
            <h1>Regisztráció</h1>
            <form 
            onSubmit={handleSubmit} 
            noValidate={true}
            className={`needs-validation ${formWasValidated ? 'was-validated' : ''}`}>
                    <InputFieldSet
                    reference={references['fullName']}
                    name="fullName"
                    labelText="Név"
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                    />
                    <InputFieldSet
                    reference={references['email']}
                    name="email"
                    labelText="Email"
                    type="text"
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                    />
                    <InputFieldSet
                    reference={references['role']}
                    name="role"
                    labelText="Jogkör"
                    type="select"
                    options={categoryOptions}
                    errors={errors}
                    fieldValues={fieldValues}
                    handleInputBlur={handleInputBlur}
                    handleInputChange={handleInputChange}
                    required={true}
                    />
                    <div>
                      <input 
                      className="form-check-input" 
                      type="checkbox" 
                      onChange={handleClick} 
                      checked={checked}
                      name="isActive"
                      id="active"
                      />
                      <label className="form-check-label" htmlFor="active">
                          Aktív
                      </label>
                    </div>
               
                <button type="submit" className="btn btn-primary">Regisztráció</button>
                <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
                {formAlertText}
                </div>
            </form>
        </main>
    );
}
 
export default RegistrationForm;

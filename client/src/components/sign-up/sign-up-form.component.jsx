import { useState } from "react"
import { createAuthUserWithEmailAndPassword , createUserDocumentFromAuth} from '../../firebase-config'
import { useNavigate } from "react-router-dom"

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const SignUpForm = ({setIsAuth}) => {
    let navigate = useNavigate();
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {displayName, email, password, confirmPassword} = formFields;


    const resetFormFields = () =>{
        setFormFields(defaultFormFields);
    }

    const handleChange= (event) =>{
        const {name, value} = event.target;

        setFormFields({...formFields, [name]: value})
    }

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("passwords do not match")
            return;
        }

        if (!validatePassword(password)) {
            alert(
              "Password must be at least 6 characters and contain at least one number and one uppercase letter."
            );
            return;
        }
        
        try {
            const {user} = await createAuthUserWithEmailAndPassword(email, password);
            
            await createUserDocumentFromAuth(user, {displayName});
            resetFormFields();
            setIsAuth(true);
            navigate('/homepage');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                alert ('Cannot create user, email already in use');
            } else {
                console.log('user created encountered an error', err.message);
            }         
        }
    }

    return (
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Don't have an account?</h2>
            <h3 className="text-gray-600 text-center">Sign Up with your email and password</h3>

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-600">Display Name</label>
                    <input
                        id="displayName"
                        type="text"
                        required
                        onChange={handleChange}
                        name="displayName"
                        value={displayName}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        onChange={handleChange}
                        name="email"
                        value={email}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        onChange={handleChange}
                        name="password"
                        value={password}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        required
                        onChange={handleChange}
                        name="confirmPassword"
                        value={confirmPassword}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                <button type="submit" className="bg-green-500 text-white w-full py-2 mt-3 font-medium rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800">
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignUpForm
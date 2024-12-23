import {useState} from "react";
import {
    Button,
    Form,
    Message,
    Segment,
    Header,
    Grid,
    Image,
} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import {auth} from "../../firebase/index.jsx";
import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import Logo from "../../assets/images/logo.jpeg";
import representatorIcon from "../../assets/images/representators.png";

const Login = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [login, setLogin] = useState(true);

    const history = useHistory();

    const submit = async () => {
        const {email, password} = user;
        try {
            if (login) {
                setloading(true);
                await signInWithEmailAndPassword(auth, email, password)
                history.push("/admin");
            } else {
                setloading(true);
                await sendPasswordResetEmail(auth, email);
                setIsPasswordReset(true);
                setError(null);
                setloading(false);
            }
        } catch (err) {
            setError(err.message);
            setIsPasswordReset(false);
            setloading(false);
        }
    };

    const changeInput = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const setLoginOrForgot = () => {
        setLogin(!login);
        setIsPasswordReset(false);
    };

    return (
        <Grid textAlign="center" style={{height: "70vh"}} verticalAlign="middle">
            <Grid.Column style={{maxWidth: 450}}>
                <Image src={Logo}/>
                <Header as="h1" textAlign="center">
                    <Image src={representatorIcon}/>
                    התחברות למערכת מיוצגים
                </Header>
                <Form onSubmit={submit} size="large">
                    <Segment stacked>
                        <Form.Field>
                            <Form.Input
                                onChange={changeInput}
                                value={user.email}
                                name="email"
                                type="email"
                                placeholder={
                                    login ? "דואל" : "נא הכנס את כתובת הדואר האלקטרוני שלך"
                                }
                                fluid
                            />
                            {login && (
                                <Form.Input
                                    onChange={changeInput}
                                    value={user.password}
                                    name="password"
                                    minLength="6"
                                    type="password"
                                    fluid
                                    placeholder="סיסמא"
                                />
                            )}
                        </Form.Field>
                        {isPasswordReset && (
                            <Message positive>
                                <Message.Header>השחזור עבר בהצלחה</Message.Header>
                                <p>בדוק את תיבת הדוא"ל שלך ופעל בהתאם להוראות</p>
                                <span
                                    style={{cursor: "pointer", fontWeight: "bold"}}
                                    onClick={setLoginOrForgot}
                                >
                  חזרה להתחברות
                </span>
                            </Message>
                        )}
                        {error && (
                            <Message negative>
                                <Message.Header>שגיאה, אנא נסה שנית</Message.Header>
                                <p>{error}</p>
                            </Message>
                        )}
                        <Button
                            color="blue"
                            loading={loading}
                            disabled={loading || !user.email || (login && !user.password)}
                        >
                            {login ? "התחברות" : "שחזר סיסמה"}
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    {login ? "שכחת סיסמה?" : "זוכר את הסיסמה?"}{" "}
                    <span
                        style={{cursor: "pointer", color: "green"}}
                        onClick={setLoginOrForgot}
                    >
            {login ? "לחץ כאן" : "חזרה להתחברות"}
          </span>
                </Message>
            </Grid.Column>
        </Grid>
    );
};

export default Login;

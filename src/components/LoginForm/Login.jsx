import React, { useEffect, useState } from 'react';
import '../LoginForm/LoginForm.css';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import AlertContent from '../../content/AlertContent';
import { object, string } from "yup";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton'; // Importa IconButton
import CircularProgress from '@mui/material/CircularProgress';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Login = () => {
  const [correoElectronico, setcorreoElectronico] = useState('');

  const [contrasena, setcontrasena] = useState('');
  const [loanding, setLoading] = useState(false)
  const [hcaptchaToken, setHcaptchaToken] = useState(null);
  const [emailError, setEmailError] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [hcaptchaError, setHcaptchaError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const siteKey = process.env.REACT_APP_HCAPTCHA_SITE_KEY;

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailError('');
      setPasswordError('');
      setHcaptchaError('');
      setFetchError('')
    }, 2000);
    return () => clearTimeout(timer);
  }, [emailError, passwordError, hcaptchaError, fetchError]);

  const buttonAlert = async (e) => {
    e.preventDefault();

    let todoCorrecto = true;
    const loginSchema = object({
      user: string("El campo debe ser un texto")
        .email("El campo debe contener un correo valido")
        .required("El campo es obligatorio")
        .min(5, "El campo debe tener minimo 5 caracteres").max(50, "El campo debe tener maximo 50 caracteres"),
      password: string().required("El campo es obligatorio")
    });

    try {
      await loginSchema.validate({
        user: correoElectronico,
        password: contrasena
      }, { abortEarly: false });
      setEmailError('');
      setPasswordError('');
    } catch (error) {
      todoCorrecto = false;
      const newErrors = {};
      error.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });

      setEmailError(newErrors.user || '');
      setPasswordError(newErrors.password || '');
    }

    if (!hcaptchaToken) {
      setHcaptchaError("Por favor, completa el hCaptcha.");
      todoCorrecto = false;
    } else {
      setHcaptchaError('');
    }

    if (todoCorrecto) {
      try {
        handdleLogin();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVerification = (token, ekey) => {
    setHcaptchaToken(token);
  };

  const handdleLogin = (e) => {
    if (!hcaptchaToken) {
      setHcaptchaError("Por favor, completa el hCaptcha.");
      return;
    }

    const data = {
      correoElectronico: correoElectronico,
      contrasena: contrasena,
      hcaptchaToken: hcaptchaToken,
    };

    fetch('http://localhost:5000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.token) {
          setLoading(true)
          localStorage.setItem('token', result.token);
          window.location.href = '/ListVentaPro';
        } else {
          console.log(result.message);

          setTimeout(() => {
            window.location.reload();
          }, 3000);

          setFetchError(result.message || "Error al iniciar sesión.");
        }
        setHcaptchaToken(null);
      })
      .catch((error) => {
        console.log(error);
        setHcaptchaToken(null);
      });
  };

  return (
    <div id="formUser">
      <form action="" className="wrapper">
        <h1>Login</h1>
        <div className="input-box">
          <PersonIcon className="icon"></PersonIcon>
          <TextField
            id="outlined-basic"
            label="Correo electrónico"
            onChange={(e) => setcorreoElectronico(e.target.value)}
            variant="outlined"
            error={!!emailError}
            helperText={emailError}
            sx={{
            
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" }, // Borde blanco
                "&:hover fieldset": { borderColor: "white" }, // Borde en hover
                "&.Mui-focused fieldset": { borderColor: "white" }, // Borde cuando está enfocado
              }
            }}
          />
        </div>

        <div className="input-box">
          <LockIcon className="icon"></LockIcon>
          <TextField
            id="outlined-basic"
            type={showPassword ? 'text' : 'password'} // Cambia el tipo dinámicamente
            label="Contraseña"
            onChange={(e) => setcontrasena(e.target.value)}
            variant="outlined"
            error={!!passwordError}
            helperText={passwordError}
            sx={{

              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" }, // Borde blanco
                "&:hover fieldset": { borderColor: "white" }, // Borde en hover
                "&.Mui-focused fieldset": { borderColor: "white" }, // Borde cuando está enfocado
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
        </div>
        <div className="remember-forgot">
          <label>
            <HCaptcha
              sitekey={siteKey}
              onVerify={handleVerification}
            />
          </label>
        </div>

        <div className="button">
          <Button variant="contained" onClick={buttonAlert} disabled={loanding}
          >
            {loanding ? (
              <CircularProgress color="warning" size={24} />
            ) : (
              <>
                    Iniciar sesión
              </>
            )}
           
          </Button>
        </div>
        {fetchError && (
          <AlertContent
            message={fetchError}
            severity="error"
          />
        )}
        {hcaptchaError && !fetchError && (
          <AlertContent
            message={hcaptchaError}
            severity="error"
          />
        )}
      </form>
    </div>
  );
};

export default Login;
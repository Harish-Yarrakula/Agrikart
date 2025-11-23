"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Mic, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button as LoadingButton } from '@/components/ui/ButtonWithLoading';

const Page = () => {
    const { t } = useTranslation("common");
    const [isSignIn, setIsSignIn] = useState(true);
    const [signInStep, setSignInStep] = useState('mobile'); 
    const [otp, setOtp] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [activeMicField, setActiveMicField] = useState(null);
    const [addressLoading, setAddressLoading] = useState(false);
    const [speechApiSupported, setSpeechApiSupported] = useState(false);
    const { login } = useAuth();
    const { addToast } = useNotification();

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            setSpeechApiSupported(true);
        }
    }, []);

    const [formData, setFormData] = useState({
        signInMobile: '',
        signUpName: '',
        signUpMobile: '',
        signUpAddress: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
        setSignInStep('mobile'); 
    };

    const handleMobileSubmit = (e) => {
        e.preventDefault();
        console.log(`OTP requested for: ${formData.signInMobile}`);
        setSignInStep('otp');
    };
    
    const handleOtpVerify = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/verify-otp", {method:"POST",headers:{"Content-Type":"application/json"},credentials: "include",body:JSON.stringify({mobile:formData.signInMobile, otp})})
        .then(response => response.json())
        .then(data => {
            console.log("OTP verification response:", data.message);
            if (data.message === "OTP verified successfully!") {
                addToast({ title: t('auth.alert.otpSuccess'), type: 'success' });
                login(data.user);
                window.location.href = "/DashBoard";
            } else {
                addToast({ title: t('auth.alert.otpInvalid'), type: 'error' });
            }
        })
        .catch(error => {
            console.error("Error verifying OTP:", error);
            addToast({ title: t('auth.alert.otpInvalid'), type: 'error' });
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: formData.signUpName, mobile: formData.signUpMobile, Address: formData.signUpAddress }),
            });
            const data = await response.json();
            if (response.ok) {
                addToast({ title: t('auth.alert.signupSuccess'), type: 'success' });
                login(data.user);
                window.location.href = "/DashBoard";
            } else {
                addToast({ title: data.message || t('auth.alert.signupFailed'), type: 'error' });
            }
        } catch (error) {
            console.error("Error during signup:", error);
            addToast({ title: t('auth.alert.signupFailed'), type: 'error' });
        }
    };
    
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            addToast({ title: t('auth.location.notSupported'), type: 'error' });
            return;
        }
        setAddressLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                if (!response.ok) throw new Error("Reverse geocoding failed");
                const data = await response.json();
                setFormData(prev => ({ ...prev, signUpAddress: data.display_name || t('auth.location.fetchError') }));
            } catch (error) {
                addToast({ title: t('auth.location.fetchError'), type: 'error' });
                console.error(error);
            } finally {
                setAddressLoading(false);
            }
        }, () => {
            addToast({ title: t('auth.location.denied'), type: 'error' });
            setAddressLoading(false);
        });
    };

    const handleSpeechToText = (fieldName) => {
        if (!speechApiSupported) {
            addToast({ title: t('auth.speech.notSupported'), type: 'error' });
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        setActiveMicField(fieldName);
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setFormData(prev => ({ ...prev, [fieldName]: transcript }));
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                addToast({ title: t('auth.speech.denied'), type: 'error' });
            }
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
            setActiveMicField(null);
        };

        recognition.start();
    };

    const renderMicIcon = (fieldName) => (
        <LoadingButton type="button" onClick={() => handleSpeechToText(fieldName)} loading={isListening && activeMicField === fieldName} disabled={!speechApiSupported || isListening} className="mic-button" size="sm">
            <Mic size={18} className={(isListening && activeMicField === fieldName) ? 'text-red-500 animate-pulse' : 'text-gray-500'}/>
        </LoadingButton>
    );

    return (
        <StyledWrapper className='w-full h-screen flex justify-center items-center bg-gray-100'>
            <div className="text-black container">
                <div className="heading">{isSignIn ? t('auth.signIn.title') : t('auth.signUp.title')}</div>
                <div className="forms-container" style={{ transform: isSignIn ? 'translateX(0)' : 'translateX(-60%)' }}>
                    
                    <div className={`form-wrapper ${isSignIn ? 'active' : ''}`}>
                        {signInStep === 'mobile' && (
                            <form onSubmit={handleMobileSubmit} className="form">
                                <div className="input-with-icon">
                                    <input required className="input" type="number" name="signInMobile" placeholder={t('auth.form.mobilePlaceholder')} value={formData.signInMobile} onChange={handleInputChange} />
                                    {renderMicIcon('signInMobile')}
                                </div>
                                <input className="login-button" type="submit" value={t('auth.otp.signInButton')} />
                            </form>
                        )}

                        {signInStep === 'otp' && (
                            <form onSubmit={handleOtpVerify} className="form">
                                <p className="otp-info">{"Testing OTP is 123456"}</p>
                                <input required className="input" type="text" pattern="\d{6}" title={t('auth.otp.placeholder')} name="otp" placeholder={t('auth.otp.placeholder')} value={otp} onChange={(e) => setOtp(e.target.value)} />
                                <input className="login-button" type="submit" value={t('auth.otp.verifyButton')} />
                            </form>
                        )}
                        
                        <span className="agreement"><a href="#">{t('auth.signIn.licenseAgreementLink')}</a></span>
                        <div className="switch-form">
                            {t('auth.signIn.switchToSignUpPrompt')} <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>{t('auth.signUp.button')}</a>
                        </div>
                    </div>
                    
                    <div className={`form-wrapper ${!isSignIn ? 'active' : ''}`}>
                        <form onSubmit={handleSignup} className="form">
                            <div className="input-with-icon">
                                <input required className="input" type="text" name="signUpName" placeholder={t('auth.form.fullNamePlaceholder')} value={formData.signUpName} onChange={handleInputChange} />
                                {renderMicIcon('signUpName')}
                            </div>
                            <div className="input-with-icon">
                                <input required className="input" type="number" name="signUpMobile" placeholder={t('auth.form.mobilePlaceholder')} value={formData.signUpMobile} onChange={handleInputChange} />
                                {renderMicIcon('signUpMobile')}
                            </div>
                            <div className="input-with-icon">
                                <input type="text" required className='input' name='signUpAddress' placeholder={t('auth.form.addressPlaceholder')} value={formData.signUpAddress} onChange={handleInputChange} />
                                <LoadingButton type="button" onClick={handleGetLocation} loading={addressLoading} disabled={addressLoading} className="mic-button" size="sm">
                                    <MapPin size={18} className='text-gray-500' />
                                </LoadingButton>
                                {renderMicIcon('signUpAddress')}
                            </div>
                            <input className="login-button" type="submit" value={t('auth.signUp.button')} />
                        </form>
                        <div className="switch-form">
                            {t('auth.signUp.switchToSignInPrompt')} <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>{t('auth.signIn.button')}</a>
                        </div>
                    </div>

                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .container {
    max-width: 380px;
    width: 90%;
    background: #F8F9FD;
    background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
    margin: 20px;
    overflow: hidden;
    position: relative;
  }
  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
    margin-bottom: 20px;
  }
  .forms-container {
    display: flex;
    width: 250%;
    transition: transform 0.5s ease-in-out;
    gap: 20%;
  }
  .form-wrapper {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .input-with-icon {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
  }
  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12B1D1;
  }
  .mic-button {
    position: absolute;
    right: 15px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input-with-icon .mic-button:first-of-type {
    right: 45px;
  }
  .spinner {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 10px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  .form .login-button:hover {
    transform: scale(1.03);
  }
  .form .login-button:active {
    transform: scale(0.95);
  }
  .otp-info {
    font-size: 13px;
    color: #555;
    text-align: center;
    margin-bottom: -5px;
  }
  .agreement {
    display: block;
    text-align: center;
    margin-top: 15px;
  }
  .agreement a {
    text-decoration: none;
    color: #0099ff;
    font-size: 9px;
  }
  .switch-form {
    margin-top: 20px;
    font-size: 13px;
    color: #555;
    text-align: center;
  }
  .switch-form a {
    color: #0099ff;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
  }
  .switch-form a:hover {
    text-decoration: underline;
  }
`;

export default Page;
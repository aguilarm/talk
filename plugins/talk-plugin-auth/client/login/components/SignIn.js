import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Spinner,
  Alert,
} from 'plugin-api/beta/client/components/ui';
import styles from './SignIn.css';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';
import Recaptcha from 'coral-framework/components/Recaptcha';
import External from './External';

class SignIn extends React.Component {
  recaptcha = null;

  handleForgotPasswordLink = e => {
    e.preventDefault();
    this.props.onForgotPasswordLink();
  };
  handleSignUpLink = e => {
    e.preventDefault();
    this.props.onSignUpLink();
  };
  handleEmailChange = e => this.props.onEmailChange(e.target.value);
  handlePasswordChange = e => this.props.onPasswordChange(e.target.value);

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();

    // Reset recaptcha because each response can only
    // be used once.
    if (this.recaptcha) {
      this.recaptcha.reset();
    }
  };

  handleRecaptchaRef = ref => {
    this.recaptcha = ref;
  };

  render() {
    const {
      email,
      password,
      errorMessage,
      requireRecaptcha,
      loading,
    } = this.props;
    return (
      <div className="coral-sign-in">
        <div className={cn(styles.header, 'header')}>
          <h1>{t('sign_in.sign_in_to_join')}</h1>
        </div>
        {errorMessage && <Alert>{errorMessage}</Alert>}
        <div>
          <External slot="authExternalSignIn" />
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              type="email"
              label={t('sign_in.email')}
              value={email}
              style={{ fontSize: 16 }}
              onChange={this.handleEmailChange}
            />
            <TextField
              id="password"
              type="password"
              label={t('sign_in.password')}
              value={password}
              style={{ fontSize: 16 }}
              onChange={this.handlePasswordChange}
            />
            {requireRecaptcha && (
              <div className={styles.recaptcha}>
                <Recaptcha
                  className={styles.recaptcha}
                  ref={this.handleRecaptchaRef}
                  onVerify={this.props.onRecaptchaVerify}
                  size="compact"
                />
              </div>
            )}
            <div className={styles.action}>
              {!loading ? (
                <Button
                  id="coralLogInButton"
                  type="submit"
                  cStyle="black"
                  className={styles.signInButton}
                  full
                >
                  {t('sign_in.sign_in')}
                </Button>
              ) : (
                <Spinner />
              )}
            </div>
          </form>
        </div>
        <div className={cn(styles.footer, 'footer')}>
          <span>
            <a onClick={this.handleForgotPasswordLink}>
              {t('sign_in.forgot_your_pass')}
            </a>
          </span>
          <span>
            {t('sign_in.need_an_account')}
            <a onClick={this.handleSignUpLink} id="coralRegister">
              {t('sign_in.register')}
            </a>
          </span>
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  loading: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onForgotPasswordLink: PropTypes.func.isRequired,
  onSignUpLink: PropTypes.func.isRequired,
  onRecaptchaVerify: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  requireRecaptcha: PropTypes.bool.isRequired,
};

export default SignIn;

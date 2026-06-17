import app from 'flarum/forum/app';
import addCreateAccountAlert from './addCreateAccountAlert';
import enableGuestPosting from './enableGuestPosting';
import modifySignUpModal from './modifySignUpModal';

app.initializers.add('guest-posting', () => {
    addCreateAccountAlert();
    enableGuestPosting();
    modifySignUpModal();
});

export * from './utils/textFormatter';

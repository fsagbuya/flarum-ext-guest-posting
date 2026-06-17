import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import listItems from 'flarum/common/helpers/listItems';

/* global m */

/**
 * Renders similarly to Flarum's Alert, but with an additional .container inside
 */
export default class CreateAccountAlert extends Component {
    view() {
        const text = app.translator.trans('guest-posting.forum.alert.create-account', {
            count: app.forum.attribute('guestPostCount'),
        });

        return m('.Alert.Alert-info', m('.container', [
            m('span.Alert-body', text),
            m('ul.Alert-controls', listItems([
                Button.component({
                    className: 'Button Button--link',
                    onclick: () => {
                        app.modal.show(() => import('flarum/forum/components/SignUpModal'));
                    },
                }, app.translator.trans('guest-posting.forum.alert.signup')),
            ])),
        ]));
    }
}

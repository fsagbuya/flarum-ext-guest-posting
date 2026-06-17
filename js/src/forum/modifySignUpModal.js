import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';

/* global m */

export default function () {
    extend('flarum/forum/components/SignUpModal', 'oninit', function () {
        this.importGuestContent = !!app.forum.attribute('guestPostCount');
    });

    extend('flarum/forum/components/SignUpModal', 'fields', function (items) {
        if (!app.forum.attribute('guestPostCount')) {
            return;
        }

        items.add('guest-posting', m('.Form-group', m('div', m('label.checkbox', [
            m('input', {
                type: 'checkbox',
                checked: this.importGuestContent,
                onchange: () => {
                    this.importGuestContent = !this.importGuestContent;
                },
                disabled: this.loading,
            }),
            app.translator.trans('guest-posting.forum.modal.import', {
                count: app.forum.attribute('guestPostCount'),
            }),
        ]))));
    });

    extend('flarum/forum/components/SignUpModal', 'submitData', function (data) {
        if (this.importGuestContent) {
            data.importGuestContent = this.importGuestContent;
        }
    });
}

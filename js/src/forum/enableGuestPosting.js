import {extend, override} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Badge from 'flarum/common/components/Badge';
import CommentPost from 'flarum/forum/components/CommentPost';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import listItems from 'flarum/common/helpers/listItems';
import Avatar from 'flarum/common/components/Avatar';
import username from 'flarum/common/helpers/username';
import ComposerPostPreview from 'flarum/forum/components/ComposerPostPreview';

/* global m */

export default function () {
    override(DiscussionControls, 'replyAction', function (original, goToLast, forceRefresh) {
        if (!app.session.user && this.canReply()) {
            // Code copied from DiscussionControls.replyAction
            return new Promise(resolve => {
                const showReply = () => {
                    app.composer.show();

                    if (goToLast && app.viewingDiscussion(this) && !app.composer.isFullScreen()) {
                        app.current.get('stream').goToNumber('reply');
                    }

                    return resolve(app.composer);
                };

                if (!app.composer.composingReplyTo(this) || forceRefresh) {
                    app.composer
                        .load(() => import('flarum/forum/components/ReplyComposer'), {
                            user: app.session.user,
                            discussion: this,
                        })
                        .then(showReply);
                } else {
                    showReply();
                }
            });
        }

        return original(goToLast, forceRefresh);
    });

    override(IndexSidebar.prototype, 'newDiscussionAction', function (original) {
        if (!app.session.user && app.forum.attribute('canStartDiscussion')) {
            // Code copied from IndexSidebar.newDiscussionAction
            return app.composer
                .load(() => import('flarum/forum/components/DiscussionComposer'), {user: app.session.user})
                .then(() => app.composer.show());
        }

        return original();
    });

    extend(CommentPost.prototype, 'headerItems', function (items) {
        const guestUsername = this.attrs.post.attribute('guest_username');

        if (!guestUsername) {
            return;
        }

        if (items.has('user')) {
            items.remove('user');
        }

        items.add('guest-user', m('.PostUser', [
            m('h3', [
                m('span.Avatar.PostUser-avatar', guestUsername.charAt(0).toUpperCase()),
                m('span.username', guestUsername),
            ]),
            m('ul.PostUser-badges badges', m('li', Badge.component({
                type: 'guest',
                icon: 'fas fa-user-secret',
                label: app.translator.trans('guest-posting.forum.badge.guest'),
            }))),
        ]), 100);
    });

    // Fix Flarum trying to loop over the guest's badges
    override('flarum/forum/components/ReplyPlaceholder', 'view', function (original, ...args) {
        if (app.composer.composingReplyTo(this.attrs.discussion)) {
            return (
                <article className="Post CommentPost editing">
                    <header className="Post-header">
                        <div className="PostUser">
                            <h3>
                                <Avatar user={app.session.user} className="PostUser-avatar"/>
                                {username(app.session.user)}
                            </h3>
                            {app.session.user ?
                                <ul className="PostUser-badges badges">{listItems(app.session.user.badges().toArray())}</ul> : null}
                        </div>
                    </header>
                    <ComposerPostPreview className="Post-body" composer={app.composer}
                                         surround={this.anchorPreview.bind(this)}/>
                </article>
            );
        }

        return original(...args);
    });
}

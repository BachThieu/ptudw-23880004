'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const models = require('../models');


// ham nay duoc goi khi xac thuc thanh cong va luu thong tin user vao session
passport.serializeUser((user, done) => {
    done(null, user.id);
});


// ham duoc goi boi passport.session de lay thong tin cua user tu csdl va gan vao req.user
passport.deserializeUser(async (id, done) => {
    try {
        let user = await models.User.findOne({
            attributes: ['id', 'email', 'firstName', 'lastName', 'mobile', 'isAdmin'],
            where: { id }
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// ham xac thuc nguoi dung khi dang nhap
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    if (email) {
        email = email.toLowerCase(); // chuyen doi email ve chu thuong
    }
    try {
        if (!req.user) { // neu chua dang nhap
            let user = await models.User.findOne({ where: { email } });
            if (!user) { // neu email khong ton tai
                return done(null, false, req.flash('loginMessage', 'Email does not exist!'));
            }
            if (!bcrypt.compareSync(password, user.password)) { // mat khau khong dung
                return done(null, false, req.flash('loginMessage', 'Invalid Password!'));
            }

            return done(null, user);
        }
        // bo qua dang nhap
        done(null, req.user);
    } catch (error) {
        done(error);
    }
}));
// Ham dang ki tai khoan
passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    if (email) {
        email = email.toLowerCase();
    }
    if (req.user) { // neu nguoi dung da dang nhap, bo qua
        return done(null, req.user);
    }
    try {
        let user = await models.User.findOne({ where: { email } });
        if (user) { // neu email da ton tai
            return done(null, false, req.flash('registerMessage', 'Email is already taken!'));
        }
        user = await models.User.create({
            email: email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
            firstName: req.body.firstName,
            lastname: req.body.lastName,
            
        });
        //thong bao dang ki thanh cong
        done(null, false, req.flash('registerMessage', 'Register successfully! Please login!'));
    } catch (error) {
        done(error);
    }
}));

module.exports = passport;
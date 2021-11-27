const { Router } = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const router = Router();
var error, success;
var invalidName, invalidEmail, invalidPhone, invalidEntity, invalidUser;

router.get('/', (req, res) =>
{
    res.render('index', {
        title: 'Velox',
        isIndex: true,
        styles: ['/styles/main.css'],
        scripts: ['/public/js/index.js']
    });
});

router.get('/form', (req, res) =>
{
    res.render('form', {
        layout: 'form.hbs',
        title: 'Request Access',
        styles: ['/styles/form.css'],
        scripts: ['/public/js/form.js']
    });
});

router.post('/submit',
    body('name').not().isEmpty().withMessage('Required'),
    body('email').normalizeEmail().isEmail().withMessage('Email is not valid').not().isEmpty().withMessage('Required'),
    body('phone').not().isEmpty().withMessage('Required'),
    body('entity').custom(value =>
    {
        if (value != undefined) return true;
    }),
    body('user').custom(value =>
    {
        if (value != undefined) return true;
    }),
    (req, res) =>
    {
        const errors = validationResult(req);
        var form =
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message
        };

        if (!errors.isEmpty())
        {
            error = true;
            success = false;
            if (errors.array().some(e => e.param === 'name')) invalidName = true; else invalidName = false;
            if (errors.array().some(e => e.param === 'email')) invalidEmail = true; else invalidEmail = false;
            if (errors.array().some(e => e.param === 'phone')) invalidPhone = true; else invalidPhone = false;
            if (errors.array().some(e => e.param === 'entity')) invalidEntity = true; else invalidEntity = false;
            if (errors.array().some(e => e.param === 'user')) invalidUser = true; else invalidUser = false;
        }
        else
        {
            error = false;
            success = true;
            invalidName = false;
            invalidEmail = false;
            invalidPhone = false;
            invalidEntity = false;
            invalidUser = false;

            const mailOptions =
            {
                from: 'veloxformmailer@gmail.com',
                to: 'maximko1993@gmail.com',
                //to: 'sales@velox-global.com',
                subject: 'New Access Request',
                html: `
                <ul>
                    <li><b>Name:</b>${req.body.name}</li>
                    <li><b>E-mail:</b>${req.body.email}</li>
                    <li><b>Phone Number:</b>(+${req.body.countrycode})${req.body.phone}</li>
                    <li><b>Registered Entity:</b>${req.body.entity}</li>
                    <li><b>I am:</b>${req.body.user}</li>
                    <li><b>Heard from:</b>${req.body.hear}</li>
                    <li><b>Message:</b>${req.body.message}</li>
                </ul>`
            }

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  type: 'OAuth2',
                  user: 'veloxformmailer@gmail.com',
                  clientId: '304491380074-4ljefs4rlktn3icf4nh9qqtbmgvu2ghd.apps.googleusercontent.com',
                  clientSecret: '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',
                  refreshToken: '1//04nWSstUR6X6QCgYIARAAGAQSNwF-L9Ir4XNabnQW82H3ay4dv0P8iFygOfxFDnSyrm3lmrhiTXEiMlkPRcgEM6vP_HdQhCXp-0c'
                }
            });

            transport.sendMail(mailOptions, (error, data) =>
            {
                if (error)
                {
                    res.json({ error: 'Error sending form' });
                    console.log(error.message);
                }
            })
        }

        res.render('form', {
            layout: 'form.hbs',
            title: 'Request Access',
            form: form,
            error: error,
            success: success,
            invalidName: invalidName,
            invalidEmail: invalidEmail,
            invalidPhone: invalidPhone,
            invalidEntity: invalidEntity,
            invalidUser: invalidUser,
            styles: ['/styles/form.css'],
            scripts: ['/public/js/form.js']
        });
    });


module.exports = router;
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const port = process.env.PORT || 3000;

const csData = fs.readFileSync(path.join(__dirname, "www", "cs.html"), "utf-8");
const enData = fs.readFileSync(path.join(__dirname, "www", "en.html"), "utf-8");
const cs404Data = fs.readFileSync(path.join(__dirname, "www", "404cs.html"), "utf-8");
const en404Data = fs.readFileSync(path.join(__dirname, "www", "404en.html"), "utf-8");

app.use((req, res, next) => {
    try {
        const userAgent = req.headers['user-agent']
        if (userAgent && userAgent.includes('Bytespider')) {
            return res.sendStatus(403);
        }

        res.set("Cache-Control", "no-cache, public");
        res.set("Content-Security-Policy", `default-src 'none'; script-src 'none'; style-src 'self'; require-trusted-types-for 'script';`);
        res.set("X-Content-Type-Options", "nosniff");
        res.set("X-Frame-Options", "DENY");
        res.set("X-Xss-Protection", "0");
        res.set("Cross-Origin-Opener-Policy", "same-origin");
        res.set("Cross-Origin-Resource-Policy", "same-origin");
        res.set("Cross-Origin-Embedder-Policy", "require-corp");
        res.set("Referrer-Policy", "strict-origin-when-cross-origin");
        res.removeHeader('X-Powered-By');
        
        next();
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at headers middleware: ${error}`
        }
        console.log(JSON.stringify(log));
        res.sendStatus(500);
    }
});

app.get("/", (req, res) => {
    try {
        const langHeader = req.headers['accept-language'];
        const host = req.headers['host'].replace("www.", "");

        res.set('Vary', 'Accept-Language');

        if (langHeader && langHeader.includes('cs')) {
            res.send(csData.replace("{{domain}}", host));
        } else {
            res.redirect('/en')
        }
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at /: ${error}`
        }
        console.log(JSON.stringify(log));
        res.sendStatus(500);
    }
});

app.get("/en", (req, res) => {
    try {
        const host = req.headers['host'].replace("www.", "");

        res.send(enData.replace("{{domain}}", host));
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at /en: ${error}`
        }
        console.log(JSON.stringify(log));
        res.sendStatus(500);
    }
});

app.get("/cs", (req, res) => {
    try {
        const host = req.headers['host'].replace("www.", "");

        res.send(csData.replace("{{domain}}", host));
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at /cs: ${error}`
        }
        console.log(JSON.stringify(log));
        res.sendStatus(500);
    }
});

app.get("/build.css", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "www", "build.css"))
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at /build.css: ${error}`
        }
        console.log(JSON.stringify(log));
        res.sendStatus(500);
    }
});

app.get("/robots.txt", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "www", "robots.txt"))
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at /robots.txt: ${error}`
        }
        console.log(JSON.stringify(log));
        res.sendStatus(500);
    }
});

app.use((req, res) => {
    try {
        const langHeader = req.headers['accept-language'];
        const host = req.headers['host'].replace("www.", "");

        res.set('Vary', 'Accept-Language');

        if (langHeader && langHeader.includes('cs')) {
            res.status(410).send(cs404Data.replace("{{domain}}", host));
        } else {
            res.status(410).send(en404Data.replace("{{domain}}", host));
        }
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at 410 middleware: ${error}`
        }
        console.log(JSON.stringify(log));
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    const log = {
        severity: "INFO",
        message: `Server is running on http://localhost:${port}`
    }
    console.log(JSON.stringify(log));
});
const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    try {
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

        if (langHeader && langHeader.includes('cs')) {
            res.sendFile(path.join(__dirname, "www", "cs.html"))
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
        res.sendFile(path.join(__dirname, "www", "en.html"))
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
        res.sendFile(path.join(__dirname, "www", "cs.html"))
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
        res.redirect('/');
    } catch (error) {
        const log = {
            severity: "ERROR",
            "logging.googleapis.com/trace": req.header("X-Cloud-Trace-Context"),
            message: `Caught error at 404 middleware: ${error}`
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
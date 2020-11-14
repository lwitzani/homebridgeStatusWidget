// Welcome! This script shows basic infos about your Homebridge installation
// All infos shown are based and provided by the Homebridge Config UI X found at https://github.com/oznu/homebridge-config-ui-x
// Thanks to the github user oznu for providing such a nice programm!
// This script does not work if you don't have the Homebridge service (Homebridge Config UI X) running


// CONFIGURATION //////////////////////
// you must at least configure the next 3 lines to make this script work
const hbServiceMachineBaseUrl = '>enter the ip with the port here<'; // location of your system running the hb-service, e.g. http://192.168.178.33:8581
const userName = '>enter username here<'; // username of administrator of the hb-service
const password = '>enter password here<'; // password of administrator of the hb-service

const systemGuiName = 'Raspberry Pi' // name of the system your service is running on
const requestTimeoutInterval = 1; // in seconds; If requests take longer, the script is stopped. Increase it if it doesn't work or you
const decimalChar = ','; // if you like a dot as decimal separator make the comma to a dot here
const maxLineWidth = 310; // if layout doesn't look good for you,
const normalLineHeight = 35; // try to tweak the (font-)sizes & remove/add spaces below
// CONFIGURATION END //////////////////////

const authUrl = hbServiceMachineBaseUrl + '/api/auth/login'
const cpuUrl = hbServiceMachineBaseUrl + '/api/status/cpu';
const hbStatusUrl = hbServiceMachineBaseUrl + '/api/status/homebridge'
const ramUrl = hbServiceMachineBaseUrl + '/api/status/ram'
const uptimeUrl = hbServiceMachineBaseUrl + '/api/status/uptime'
const pluginsUrl = hbServiceMachineBaseUrl + '/api/plugins'
const hbVersionUrl = hbServiceMachineBaseUrl + '/api/status/homebridge-version'
// logo is downloaded only the first time! It is saved in iCloud and then loaded from there everytime afterwards
const logoUrl = 'https://github.com/homebridge/branding/blob/master/logos/homebridge-silhouette-round-white.png?raw=true'

const timeFormatter = new DateFormatter();
timeFormatter.dateFormat = 'dd.MM.yyyy HH:mm:ss';
const headerFont = Font.boldMonospacedSystemFont(12);
const monospacedHeaderFont = Font.lightMonospacedSystemFont(12);
const infoFont = Font.systemFont(10);
const chartAxisFont = Font.systemFont(7);
const updatedAtFont = Font.systemFont(7);
const fontColorWhite = new Color("#FFFFFF");
const bgColorPurple = new Color("#421367");
const chartColor = new Color("#FFFFFF");
const UNAVAILABLE = 'UNAVAILABLE';

class LineChart {
    // LineChart by https://kevinkub.de/
    // taken from https://gist.github.com/kevinkub/b74f9c16f050576ae760a7730c19b8e2
    constructor(width, height, values) {
        this.ctx = new DrawContext();
        this.ctx.size = new Size(width, height);
        this.values = values;
    }

    _calculatePath() {
        let maxValue = Math.max(...this.values);
        let minValue = Math.min(...this.values);
        let difference = maxValue - minValue;
        let count = this.values.length;
        let step = this.ctx.size.width / (count - 1);
        let points = this.values.map((current, index, all) => {
            let x = step * index;
            let y = this.ctx.size.height - (current - minValue) / difference * this.ctx.size.height;
            return new Point(x, y);
        });
        return this._getSmoothPath(points);
    }

    _getSmoothPath(points) {
        let path = new Path();
        path.move(new Point(0, this.ctx.size.height));
        path.addLine(points[0]);
        for (let i = 0; i < points.length - 1; i++) {
            let xAvg = (points[i].x + points[i + 1].x) / 2;
            let yAvg = (points[i].y + points[i + 1].y) / 2;
            let avg = new Point(xAvg, yAvg);
            let cp1 = new Point((xAvg + points[i].x) / 2, points[i].y);
            let next = new Point(points[i + 1].x, points[i + 1].y);
            let cp2 = new Point((xAvg + points[i + 1].x) / 2, points[i + 1].y);
            path.addQuadCurve(avg, cp1);
            path.addQuadCurve(next, cp2);
        }
        path.addLine(new Point(this.ctx.size.width, this.ctx.size.height));
        path.closeSubpath();
        return path;
    }

    configure(fn) {
        let path = this._calculatePath();
        if (fn) {
            fn(this.ctx, path);
        } else {
            this.ctx.addPath(path);
            this.ctx.fillPath(path);
        }
        return this.ctx;
    }
}

// WIDGET INIT //////////////////////
let widget = await createWidget();
if (!config.runsInWidget) {
    await widget.presentMedium();
}

Script.setWidget(widget);
Script.complete();

// WIDGET INIT END //////////////////////


async function createWidget() {
    // authenticate against the hb-service
    let token = await getAuthToken();

    let widget = new ListWidget();
    widget.backgroundColor = bgColorPurple;
    if (token !== UNAVAILABLE) {
        widget.addSpacer(10);
    }

    // LOGO AND HEADER //////////////////////
    let titleStack = widget.addStack();
    titleStack.size = new Size(maxLineWidth, normalLineHeight);
    const logo = await getHbLogo();
    const imgwidget = titleStack.addImage(logo);
    imgwidget.imageSize = new Size(40, 30);

    let headerText = titleStack.addText(' Homebridge ');
    headerText.font = headerFont;
    headerText.size = new Size(60, normalLineHeight);
    headerText.color = fontColorWhite;
    // LOGO AND HEADER END //////////////////////


    if (token === UNAVAILABLE) {
        // script ends after the next line
        return addNotAvailableInfos(widget, titleStack);
    }

    // fetch all the data necessary
    let hbStatus = await getHomebridgeStatus(token);
    let hbUpToDate = await getHomebridgeUpToDate(token);
    let pluginsUpToDate = await getPluginsUpToDate(token);
    let cpuData = await fetchData(token, cpuUrl);
    let ramData = await fetchData(token, ramUrl);
    let usedRamText = await getUsedRamString(ramData);
    let uptimeText = await getUptimeString(token);

    // STATUS PANEL IN THE HEADER //////////////////////
    let statusInfo = titleStack.addText(hbStatus + 'Running         ' + hbUpToDate + 'UTD\n' + pluginsUpToDate + 'Plugins UTD  ' + hbUpToDate + 'Node.js UTD');
    statusInfo.font = monospacedHeaderFont;
    statusInfo.size = new Size(155, 30);
    statusInfo.color = fontColorWhite;
    // STATUS PANEL IN THE HEADER END //////////////////////


    widget.addSpacer(10);


    // CHART STACK START //////////////////////
    let cpuLoadAndRamText = widget.addText('CPU Load: ' + getAsRoundedString(cpuData.currentLoad, 1) + '%                           RAM Usage: ' + usedRamText + '%');
    cpuLoadAndRamText.font = infoFont;
    cpuLoadAndRamText.color = fontColorWhite;

    let chartStack = widget.addStack();
    chartStack.size = new Size(maxLineWidth, 30);

    let minMaxCpuLoadText = chartStack.addText(getMaxString(cpuData.cpuLoadHistory, 2) + '%\n\n' + getMinString(cpuData.cpuLoadHistory, 2) + '%');
    minMaxCpuLoadText.size = new Size(20, 10);
    minMaxCpuLoadText.font = chartAxisFont;
    minMaxCpuLoadText.color = fontColorWhite;

    let cpuLoadChart = new LineChart(500, 100, cpuData.cpuLoadHistory).configure((ctx, path) => {
        ctx.opaque = false;
        ctx.setFillColor(chartColor);
        ctx.addPath(path);
        ctx.fillPath(path);
    }).getImage();
    let cpuLoadChartImage = chartStack.addImage(cpuLoadChart);
    cpuLoadChartImage.imageSize = new Size(125, 25);

    chartStack.addSpacer(5);

    let minMaxRamUsageText = chartStack.addText(getMaxString(ramData.memoryUsageHistory, 2) + '%\n\n' + getMinString(ramData.memoryUsageHistory, 2) + '%');
    minMaxRamUsageText.size = new Size(20, 10);
    minMaxRamUsageText.font = chartAxisFont;
    minMaxRamUsageText.color = fontColorWhite;

    let ramUsageChart = new LineChart(500, 100, ramData.memoryUsageHistory).configure((ctx, path) => {
        ctx.opaque = false;
        ctx.setFillColor(chartColor);
        ctx.addPath(path);
        ctx.fillPath(path);
    }).getImage();
    let ramUsageChartImage = chartStack.addImage(ramUsageChart);
    ramUsageChartImage.imageSize = new Size(125, 25);
    // CHART STACK END //////////////////////


    widget.addSpacer(10);


    // LOWER PART //////////////////////
    let row3Stack = widget.addStack();
    row3Stack.size = new Size(maxLineWidth, 30);

    let cpuTempText = row3Stack.addText('CPU Temp: ' + getAsRoundedString(cpuData.cpuTemperature.main, 1) + '°C               ');
    cpuTempText.font = infoFont;
    cpuTempText.size = new Size(150, 30);
    cpuTempText.color = fontColorWhite;

    let uptimeTitleTextRef = row3Stack.addText('  Uptimes: ');
    uptimeTitleTextRef.font = infoFont;
    uptimeTitleTextRef.color = fontColorWhite;

    let uptimeTextRef = row3Stack.addText(uptimeText);
    uptimeTextRef.font = infoFont;
    uptimeTextRef.color = fontColorWhite;
    // LOWER PART END //////////////////////

    widget.addSpacer(5);

    // BOTTOM UPDATED TEXT //////////////////////
    let updatedAt = widget.addText('Updated: ' + timeFormatter.string(new Date()));
    updatedAt.font = updatedAtFont;
    updatedAt.textColor = fontColorWhite;
    updatedAt.centerAlignText();
    // BOTTOM UPDATED TEXT END //////////////////////

    return widget;
}

async function getAuthToken() {
    let req = new Request(authUrl);
    req.timeoutInterval = requestTimeoutInterval;
    let body = {
        "username": userName,
        "password": password,
        "otp": "string"
    };
    let headers = {
        "accept": "*\/*", "Content-Type": "application/json"
    };
    req.body = JSON.stringify(body);
    req.method = "POST";
    req.headers = headers;
    let authData;
    try {
        authData = await req.loadJSON();
    } catch (e) {
        return UNAVAILABLE;
    }
    return authData.access_token;
}

async function fetchData(token, url) {
    let req = new Request(url);
    req.timeoutInterval = requestTimeoutInterval;
    let headers = {
        "accept": "*\/*", "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
    req.headers = headers;
    return req.loadJSON();
}

async function getHomebridgeStatus(token) {
    const statusData = await fetchData(token, hbStatusUrl);
    return statusData.status === 'up' ? '✅' : '❌';
}

async function getHomebridgeUpToDate(token) {
    const hbVersionData = await fetchData(token, hbVersionUrl);
    return hbVersionData.updateAvailable ? '❌' : '✅';
}

async function getPluginsUpToDate(token) {
    const pluginsData = await fetchData(token, pluginsUrl);
    for (plugin of pluginsData) {
        if (plugin.updateAvailable) {
            return '❌';
        }
    }
    return '✅';
}

async function getUsedRamString(ramData) {
    return getAsRoundedString(100 - 100 * ramData.mem.available / ramData.mem.total, 2);
}

async function getUptimeString(token) {
    const uptimeData = await fetchData(token, uptimeUrl);
    let serverTime = uptimeData.time.uptime;
    let processUptime = uptimeData.processUptime;
    return '➡️ ' + systemGuiName + ': ' + formatMinutes(serverTime) + '\n➡️ UI-Service: ' + formatMinutes(processUptime);
}

function formatMinutes(value) {
    if (value > 60 * 60 * 24) {
        return getAsRoundedString(value / 60 / 60 / 24, 2) + 'd';
    } else if (value > 60 * 60) {
        return getAsRoundedString(value / 60 / 60, 2) + 'h';
    } else if (value > 60) {
        return getAsRoundedString(value / 60, 2) + 'm';
    } else {
        return getAsRoundedString(value, 2) + 's';
    }
}

async function loadImage(imgUrl) {
    let req = new Request(imgUrl);
    req.timeoutInterval = requestTimeoutInterval;
    let image = await req.loadImage();
    return image;
}

async function getHbLogo() {
    // this could be changed to FileManager.local() if you don't want to use iCloud
    let fm = FileManager.iCloud();
    let path = getStoredLogoPath();
    if (fm.fileExists(path)) {
        return fm.readImage(path);
    } else {
        // logo did not exist -> download it and save it for next time the widget runs
        const logo = await loadImage(logoUrl);
        saveHbLogo(logo);
        return logo;
    }
}

function saveHbLogo(image) {
    // this could be changed to FileManager.local() if you don't want to use iCloud
    let fm = FileManager.iCloud();
    let path = getStoredLogoPath();
    fm.writeImage(path, image);
}

function getStoredLogoPath() {
    let fm = FileManager.iCloud();
    let dirPath = fm.joinPath(fm.documentsDirectory(), "homebridgeStatus");
    if (!fm.fileExists(dirPath)) {
        fm.createDirectory(dirPath);
    }
    return fm.joinPath(dirPath, "hbLogo.png");
}


function addNotAvailableInfos(widget, titleStack) {
    let statusInfo = titleStack.addText('                                                 ');
    statusInfo.color = fontColorWhite;
    statusInfo.size = new Size(150, normalLineHeight);
    let errorText = widget.addText('   ❌ UI-Service not reachable!\n          👉🏻 Server started?\n          👉🏻 UI-Service process started?\n          👉🏻 Server-URL ' + hbServiceMachineBaseUrl + ' correct?\n          👉🏻 Are you in the same network?');
    errorText.size = new Size(410, 130);
    errorText.font = infoFont;
    errorText.color = fontColorWhite;


    widget.addSpacer(15);
    let updatedAt = widget.addText('Updated: ' + timeFormatter.string(new Date()));
    updatedAt.font = updatedAtFont;
    updatedAt.textColor = fontColorWhite;
    updatedAt.centerAlignText();

    return widget;
}

function getAsRoundedString(value, decimals) {
    let factor = Math.pow(10, decimals);
    return (Math.round((value + Number.EPSILON) * factor) / factor).toString().replace('.', decimalChar);
}

function getMaxString(arrayOfNumbers, decimals) {
    let factor = Math.pow(10, decimals);
    return (Math.round((Math.max(...arrayOfNumbers) + Number.EPSILON) * factor) / factor).toString().replace('.', decimalChar);
}

function getMinString(arrayOfNumbers, decimals) {
    let factor = Math.pow(10, decimals);
    return (Math.round((Math.min(...arrayOfNumbers) + Number.EPSILON) * factor) / factor).toString().replace('.', decimalChar);
}
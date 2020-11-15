// Welcome! This script shows basic infos about your Homebridge installation
// All infos shown are based and provided by the Homebridge Config UI X found at https://github.com/oznu/homebridge-config-ui-x
// Thanks to the github user oznu for providing such a nice programm!
// This script does not work if you don't have the Homebridge service (Homebridge Config UI X) running
// This script was developed with Homebridge Config UI X in version 4.32.0 (2020-11-06), Homebridge at version 1.1.6 and Scriptable app in version 1.6.1 on iOS 14.2
// Maybe you need to update the UI-service OR Homebridge OR the Scriptable app OR your iPhone if this script does not work for you

// CONFIGURATION //////////////////////
// you must at least configure the next 3 lines to make this script work
const hbServiceMachineBaseUrl = '>enter the ip with the port here<'; // location of your system running the hb-service, e.g. http://192.168.178.33:8581
const userName = '>enter username here<'; // username of administrator of the hb-service
const password = '>enter password here<'; // password of administrator of the hb-service

const systemGuiName = 'Raspberry Pi'; // name of the system your service is running on
const fileManagerMode = 'ICLOUD'; // default is ICLOUD. If you don't use iCloud Drive use option LOCAL
const bgColorMode = 'PURPLE'; // default is PURPLE. Second option is BLACK
const failIcon = '❌';
const bulletPointIcon = '🔸';
const temperatureUnitConfig = 'CELSIUS'; // options are CELSIUS or FAHRENHEIT
const requestTimeoutInterval = 1; // in seconds; If requests take longer, the script is stopped. Increase it if it doesn't work or you
const decimalChar = ','; // if you like a dot as decimal separator make the comma to a dot here
const maxLineWidth = 310; // if layout doesn't look good for you,
const normalLineHeight = 35; // try to tweak the (font-)sizes & remove/add spaces below
// CONFIGURATION END //////////////////////

const authUrl = hbServiceMachineBaseUrl + '/api/auth/login';
const cpuUrl = hbServiceMachineBaseUrl + '/api/status/cpu';
const hbStatusUrl = hbServiceMachineBaseUrl + '/api/status/homebridge';
const ramUrl = hbServiceMachineBaseUrl + '/api/status/ram';
const uptimeUrl = hbServiceMachineBaseUrl + '/api/status/uptime';
const pluginsUrl = hbServiceMachineBaseUrl + '/api/plugins';
const hbVersionUrl = hbServiceMachineBaseUrl + '/api/status/homebridge-version';
const nodeJsUrl = hbServiceMachineBaseUrl + '/api/status/nodejs';
// logo is downloaded only the first time! It is saved in iCloud and then loaded from there everytime afterwards
const logoUrl = 'https://github.com/homebridge/branding/blob/master/logos/homebridge-silhouette-round-white.png?raw=true';

const timeFormatter = new DateFormatter();
timeFormatter.dateFormat = 'dd.MM.yyyy HH:mm:ss';
const headerFont = Font.boldMonospacedSystemFont(12);
const infoFont = Font.systemFont(10);
const chartAxisFont = Font.systemFont(7);
const updatedAtFont = Font.systemFont(7);
const fontColorWhite = new Color("#FFFFFF");
const bgColorPurple = new Color("#421367");
const bgColorBrighterPurple = new Color("#481367");
const purpleBgGradient = new LinearGradient();
purpleBgGradient.locations = [0, 1];
purpleBgGradient.colors = [bgColorPurple, bgColorBrighterPurple];
const blackBgGradient = new LinearGradient();
blackBgGradient.locations = [0, 1];
blackBgGradient.colors = [new Color("111111"), new Color("222222")];

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
    // Widget background color
    if (bgColorMode === 'BLACK') {
        widget.backgroundGradient = blackBgGradient;
    } else {
        widget.backgroundGradient = purpleBgGradient;
    }

    if (token !== UNAVAILABLE) {
        widget.addSpacer(10);
    }

    // LOGO AND HEADER //////////////////////
    let titleStack = widget.addStack();
    titleStack.size = new Size(maxLineWidth, normalLineHeight);
    const logo = await getHbLogo();
    const imgWidget = titleStack.addImage(logo);
    imgWidget.imageSize = new Size(40, 30);

    let headerText = titleStack.addText(' Homebridge ');
    headerText.font = headerFont;
    headerText.size = new Size(60, normalLineHeight);
    headerText.textColor = fontColorWhite;
    // LOGO AND HEADER END //////////////////////


    if (token === UNAVAILABLE) {
        // script ends after the next line
        return addNotAvailableInfos(widget, titleStack);
    }

    // fetch all the data necessary
    let hbStatus = await getHomebridgeStatus(token);
    let hbUpToDate = await getHomebridgeUpToDate(token);
    let pluginsUpToDate = await getPluginsUpToDate(token);
    let nodeJsUpToDate = await getNodeJsUpToDate(token);
    let cpuData = await fetchData(token, cpuUrl);
    let ramData = await fetchData(token, ramUrl);
    let usedRamText = await getUsedRamString(ramData);
    let uptimeText = await getUptimeString(token);

    // STATUS PANEL IN THE HEADER ///////////////////
    let statusInfo = titleStack.addStack();
    statusInfo.layoutVertically();

    let firstLine = statusInfo.addStack();
    firstLine.addSpacer(15);
    addStatusInfo(firstLine, hbStatus, 'Running');
    firstLine.addSpacer(30);
    addStatusInfo(firstLine, hbUpToDate, 'UTD');
    statusInfo.addSpacer(5); // space between the lines

    let secondLine = statusInfo.addStack();
    secondLine.addSpacer(15);
    addStatusInfo(secondLine, pluginsUpToDate, 'Plugins UTD');
    secondLine.addSpacer();

    addStatusInfo(secondLine, nodeJsUpToDate, 'Node.js UTD');
    // STATUS PANEL IN THE HEADER END ////////////////

    widget.addSpacer(10);

    // CHART STACK START //////////////////////
    if (cpuData && ramData) {
        let textStack = widget.addStack();
        textStack.addSpacer(2);
        let cpuLoadAndRamText = textStack.addText('   CPU Load: ' + getAsRoundedString(cpuData.currentLoad, 1) + '%                      RAM Usage: ' + usedRamText + '%');
        cpuLoadAndRamText.font = infoFont;
        cpuLoadAndRamText.textColor = fontColorWhite;

        let chartStack = widget.addStack();
        chartStack.size = new Size(maxLineWidth, 30);

        let minMaxCpuLoadText = chartStack.addText(getMaxString(cpuData.cpuLoadHistory, 2) + '%\n\n' + getMinString(cpuData.cpuLoadHistory, 2) + '%');
        minMaxCpuLoadText.size = new Size(20, 10);
        minMaxCpuLoadText.font = chartAxisFont;
        minMaxCpuLoadText.textColor = fontColorWhite;
        chartStack.addSpacer(2);
        let cpuLoadChart = new LineChart(500, 100, cpuData.cpuLoadHistory).configure((ctx, path) => {
            ctx.opaque = false;
            ctx.setFillColor(chartColor);
            ctx.addPath(path);
            ctx.fillPath(path);
        }).getImage();
        let cpuLoadChartImage = chartStack.addImage(cpuLoadChart);
        cpuLoadChartImage.imageSize = new Size(100, 25);

        chartStack.addSpacer(15);

        let minMaxRamUsageText = chartStack.addText(getMaxString(ramData.memoryUsageHistory, 2) + '%\n\n' + getMinString(ramData.memoryUsageHistory, 2) + '%');
        minMaxRamUsageText.size = new Size(20, 10);
        minMaxRamUsageText.font = chartAxisFont;
        minMaxRamUsageText.textColor = fontColorWhite;

        chartStack.addSpacer(2);
        let ramUsageChart = new LineChart(500, 100, ramData.memoryUsageHistory).configure((ctx, path) => {
            ctx.opaque = false;
            ctx.setFillColor(chartColor);
            ctx.addPath(path);
            ctx.fillPath(path);
        }).getImage();
        let ramUsageChartImage = chartStack.addImage(ramUsageChart);
        ramUsageChartImage.imageSize = new Size(100, 25);
        chartStack.addSpacer(5);
    }
    // CHART STACK END //////////////////////

    widget.addSpacer(10);

    // LOWER PART //////////////////////
    let row3Stack = widget.addStack();
    row3Stack.size = new Size(maxLineWidth, 30);
    row3Stack.addSpacer(3);

    let cpuTempText = row3Stack.addText('CPU Temp: ' + getTemperatureString(cpuData?.cpuTemperature.main) + '            ');
    cpuTempText.font = infoFont;
    cpuTempText.size = new Size(150, 30);
    cpuTempText.textColor = fontColorWhite;

    let uptimeTitleTextRef = row3Stack.addText('     Uptimes: ');
    uptimeTitleTextRef.font = infoFont;
    uptimeTitleTextRef.textColor = fontColorWhite;

    if (uptimeText) {
        let uptimeTextRef = row3Stack.addText(uptimeText);
        uptimeTextRef.font = infoFont;
        uptimeTextRef.textColor = fontColorWhite;
    }
    // LOWER PART END //////////////////////

    widget.addSpacer(5);

    // BOTTOM UPDATED TEXT //////////////////////
    let updatedAt = widget.addText('Updated: ' + timeFormatter.string(new Date()));
    updatedAt.font = updatedAtFont;
    updatedAt.textColor = fontColorWhite;
    updatedAt.centerAlignText();
    // BOTTOM UPDATED TEXT END //////////////////

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
    let result;
    try {
        result = req.loadJSON();
    } catch (e) {
        return undefined;
    }
    return result;
}

async function getHomebridgeStatus(token) {
    const statusData = await fetchData(token, hbStatusUrl);
    if (statusData === undefined) {
        return undefined;
    }
    return statusData.status === 'up';
}

async function getHomebridgeUpToDate(token) {
    const hbVersionData = await fetchData(token, hbVersionUrl);
    if (hbVersionData === undefined) {
        return undefined;
    }
    return !hbVersionData.updateAvailable;
}

async function getNodeJsUpToDate(token) {
    const nodeJsData = await fetchData(token, nodeJsUrl);
    if (nodeJsData === undefined) {
        return undefined;
    }
    return !nodeJsData.updateAvailable;
}

async function getPluginsUpToDate(token) {
    const pluginsData = await fetchData(token, pluginsUrl);
    if (pluginsData === undefined) {
        return undefined;
    }
    for (plugin of pluginsData) {
        if (plugin.updateAvailable) {
            return false;
        }
    }
    return true;
}

async function getUsedRamString(ramData) {
    if (ramData === undefined) return 'unknown';
    return getAsRoundedString(100 - 100 * ramData.mem.available / ramData.mem.total, 2);
}

async function getUptimeString(token) {
    const uptimeData = await fetchData(token, uptimeUrl);
    if (uptimeData === undefined) return;
    let serverTime = uptimeData.time.uptime;
    let processUptime = uptimeData.processUptime;
    return bulletPointIcon + systemGuiName + ': ' + formatMinutes(serverTime) + '\n' + bulletPointIcon + 'UI-Service: ' + formatMinutes(processUptime);
}

function formatMinutes(value) {
    if (value > 60 * 60 * 24) {
        return getAsRoundedString(value / 60 / 60 / 24, 1) + 'd';
    } else if (value > 60 * 60) {
        return getAsRoundedString(value / 60 / 60, 1) + 'h';
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
    // fileManagerMode must be LOCAL if you do not use iCloud drive
    let fm = fileManagerMode === 'LOCAL' ? FileManager.local() : FileManager.iCloud();
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
    // fileManagerMode must be LOCAL if you do not use iCloud drive
    let fm = fileManagerMode === 'LOCAL' ? FileManager.local() : FileManager.iCloud();
    let path = getStoredLogoPath();
    fm.writeImage(path, image);
}

function getStoredLogoPath() {
    // fileManagerMode must be LOCAL if you do not use iCloud drive
    let fm = fileManagerMode === 'LOCAL' ? FileManager.local() : FileManager.iCloud();
    let dirPath = fm.joinPath(fm.documentsDirectory(), "homebridgeStatus");
    if (!fm.fileExists(dirPath)) {
        fm.createDirectory(dirPath);
    }
    return fm.joinPath(dirPath, "hbLogo.png");
}


function addNotAvailableInfos(widget, titleStack) {
    let statusInfo = titleStack.addText('                                                 ');
    statusInfo.textColor = fontColorWhite;
    statusInfo.size = new Size(150, normalLineHeight);
    let errorText = widget.addText('   ' + failIcon + ' UI-Service not reachable!\n          👉🏻 Server started?\n          👉🏻 UI-Service process started?\n          👉🏻 Server-URL ' + hbServiceMachineBaseUrl + ' correct?\n          👉🏻 Are you in the same network?');
    errorText.size = new Size(410, 130);
    errorText.font = infoFont;
    errorText.textColor = fontColorWhite;


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

function getTemperatureString(temperatureInCelsius) {
    if (temperatureInCelsius === undefined) return 'unknown';

    if (temperatureUnitConfig === 'FAHRENHEIT') {
        return getAsRoundedString(convertToFahrenheit(temperatureInCelsius), 1) + '°F';
    } else {
        return getAsRoundedString(temperatureInCelsius, 1) + '°C';
    }
}

function convertToFahrenheit(temperatureInCelsius) {
    return temperatureInCelsius * 9 / 5 + 32
}

function addStatusIcon(widget, statusBool) {
    let name = '';
    let color;
    if (statusBool === undefined) {
        name = 'questionmark.circle.fill';
        color = Color.yellow();
    } else if (statusBool) {
        name = 'checkmark.circle.fill';
        color = Color.green();
    } else {
        name = 'exclamationmark.triangle.fill';
        color = Color.red();
    }
    let sf = SFSymbol.named(name);
    sf.applyFont(Font.heavySystemFont(50));
    let iconImage = sf.image;
    let imageWidget = widget.addImage(iconImage);
    imageWidget.resizable = true;
    imageWidget.imageSize = new Size(13, 13);
    imageWidget.tintColor = color;
}

function addStatusInfo(lineWidget, statusBool, shownText) {
    let itemStack = lineWidget.addStack();
    itemStack.centerAlignContent();
    addStatusIcon(itemStack, statusBool);
    itemStack.addSpacer(2);
    let text = itemStack.addText(shownText);
    text.font = Font.semiboldMonospacedSystemFont(10);
    text.textColor = fontColorWhite;
}